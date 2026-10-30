"""
Background removal for the /get-dp page.

POST /remove-bg takes a photo as the multipart field `image` and answers with
the person cut out as a transparent PNG, cropped to their outline. The face it
found, in the returned PNG's pixels, comes back in the `X-Face-Box` header as
`x,y,width,height` so the page can line the face up with the poster. The
header is left out when no face is found.

Photos are processed in memory and never written to disk.
"""

import io
import os
import secrets

import cv2
import numpy as np
from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from fastapi.responses import Response
from PIL import Image, ImageOps, UnidentifiedImageError
from rembg import new_session, remove

MODEL = os.environ.get("REMBG_MODEL", "u2net_human_seg")
# Longest side the photo is reduced to before processing. Posters are about
# 1080px wide, so more than this only costs time.
MAX_SIDE = int(os.environ.get("MAX_SIDE", "1600"))
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
# When set, callers must send `Authorization: Bearer <token>`, so only the
# website can use the service.
API_TOKEN = os.environ.get("API_TOKEN", "")

# Loading the model takes a few seconds, so do it once at startup rather than
# on the first request.
session = new_session(MODEL)
face_detector = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
# Lifts shadows and midtones, keeping highlights.
LIGHTEN = np.array([((i / 255) ** 0.6) * 255 for i in range(256)], dtype=np.uint8)
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))

app = FastAPI(title="DevFest Ilorin background removal")


@app.get("/health")
def health():
    return {"ok": True, "model": MODEL}


@app.post("/remove-bg")
def remove_background(
    image: UploadFile = File(...),
    authorization: str = Header(default=""),
):
    if API_TOKEN and not secrets.compare_digest(
        authorization, f"Bearer {API_TOKEN}"
    ):
        raise HTTPException(status_code=401, detail="Unauthorized.")

    data = image.file.read(MAX_UPLOAD_BYTES + 1)

    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Photo is too large.")

    try:
        photo = Image.open(io.BytesIO(data))
        # Phones store photos sideways and record the rotation separately.
        photo = ImageOps.exif_transpose(photo).convert("RGB")
    except (UnidentifiedImageError, Image.DecompressionBombError, OSError):
        raise HTTPException(status_code=415, detail="That file is not a photo.")

    photo.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)

    cutout = remove(photo, session=session)
    # Ignore the faint haze models leave around the subject when cropping.
    bounds = cutout.getchannel("A").point(lambda a: 255 if a > 10 else 0).getbbox()

    if bounds is None:
        raise HTTPException(
            status_code=422, detail="Could not find a person in that photo."
        )

    cutout = cutout.crop(bounds)

    buffer = io.BytesIO()
    cutout.save(buffer, format="PNG", optimize=False, compress_level=6)

    headers = {"Cache-Control": "no-store"}
    face = find_face(photo)

    if face is not None:
        x, y, w, h = face
        headers["X-Face-Box"] = f"{x - bounds[0]},{y - bounds[1]},{w},{h}"

    return Response(buffer.getvalue(), media_type="image/png", headers=headers)


def find_face(photo: Image.Image):
    """The largest face in the photo as (x, y, width, height), or None."""
    gray = cv2.cvtColor(np.asarray(photo), cv2.COLOR_RGB2GRAY)
    smallest = max(40, min(gray.shape) // 10)

    # The detector misses darker skin and warm, dim lighting more often than
    # it should, so look again at lightened versions of the photo. Together
    # they found 28 of the 29 speakers' faces, against 27 for the best alone.
    for version in (cv2.LUT(gray, LIGHTEN), gray, clahe.apply(gray)):
        faces = face_detector.detectMultiScale(
            version, scaleFactor=1.1, minNeighbors=6, minSize=(smallest, smallest)
        )

        if len(faces) > 0:
            x, y, w, h = max(faces, key=lambda face: face[2] * face[3])

            return int(x), int(y), int(w), int(h)

    return None
