# Background removal for Get DP

A small Python service that cuts the person out of a photo for the
[`/get-dp`](../../src/app/get-dp/page.tsx) page. It runs
[rembg](https://github.com/danielgatis/rembg) with the `u2net_human_seg`
model, and finds the face with OpenCV so the page can line it up with the
poster.

The website never calls it from the browser. The page posts the photo to the
site's own `/api/remove-bg` route, which forwards it here with a token.
Photos are handled in memory and never saved.

## API

`POST /remove-bg`, multipart form with the photo in the `image` field.

- **200**: the person as a transparent PNG, cropped to their outline. When a
  face is found, the `X-Face-Box` header holds `x,y,width,height` in the
  PNG's pixels.
- **401**: `API_TOKEN` is set and the request didn't send
  `Authorization: Bearer <token>`.
- **413**, **415**, **422**: the photo is too large, not an image (or too
  big to decode safely), or has no person in it. `detail` explains which, in
  words fit for the visitor.

`GET /health` answers `{"ok": true, "model": "..."}`.

## Run it locally

Needs Python 3.10 or newer. The first start downloads the model (about
170 MB).

```bash
cd services/remove-bg
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn main:app --port 8000
```

Then point the site at it in `.env.local` and restart `pnpm dev`:

```bash
REMOVE_BG_URL='http://localhost:8000'
```

## Settings

| Variable      | Default           | What it does                                                         |
| ------------- | ----------------- | -------------------------------------------------------------------- |
| `API_TOKEN`   | none              | When set, requests must carry it as a bearer token. Set it in production. |
| `REMBG_MODEL` | `u2net_human_seg` | Any [rembg model](https://github.com/danielgatis/rembg#models).      |
| `MAX_SIDE`    | `1600`            | Photos are shrunk to this many pixels on their longest side first.   |

`u2net_human_seg` was picked by trying rembg's models on the speakers'
photos. It took about half a second a photo on 4 CPU cores and kept clothing
solid, where `isnet-general-use` made a red top partly see-through.
`birefnet-portrait` has finer edges but took 49 seconds a photo, too slow
without a GPU.

## Deploy

Any host that runs a Docker container works. The image includes the model,
so new instances don't download it. On Google Cloud Run, from the repository
root:

```bash
gcloud run deploy devfest-remove-bg --source services/remove-bg --memory 2Gi --cpu 2 --allow-unauthenticated --set-env-vars API_TOKEN=CHANGE_ME
```

`--allow-unauthenticated` lets the website reach the service without Google
sign-in. The token keeps everyone else out. Use a long random value, for
example from `openssl rand -hex 32`.

Then set these on the website's host (Vercel) and redeploy it:

- `REMOVE_BG_URL`: the service's URL, such as
  `https://devfest-remove-bg-xxxxx.a.run.app`
- `REMOVE_BG_TOKEN`: the same value as `API_TOKEN`
