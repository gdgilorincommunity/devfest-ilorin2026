FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    REMBG_HOME=/models \
    PORT=8080

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Bake the model into the image so a fresh instance doesn't download it on
# its first request.
ARG REMBG_MODEL=u2net_human_seg
ENV REMBG_MODEL=${REMBG_MODEL}
RUN python -c "import os; from rembg import new_session; new_session(os.environ['REMBG_MODEL'])"

COPY main.py .

EXPOSE 8080
# The slim image has no curl or wget, so check health with Python. The start
# period covers loading the model.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD ["python", "-c", "import os, urllib.request; urllib.request.urlopen('http://localhost:%s/health' % os.environ.get('PORT', '8080'), timeout=4)"]

CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT}
