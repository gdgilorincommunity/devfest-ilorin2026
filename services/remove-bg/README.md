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
so new instances don't download it, and it checks its own health through
`/health`.

### Production: Coolify on the VPS

The live service is `https://getdp.devfestilorin.com`, a Coolify app on the
Contabo VPS (`164.68.105.57`). The server's nginx and certbot handle HTTPS,
not Coolify's proxy, so leave the proxy stopped: it would fight nginx for
ports 80 and 443.

| Setting         | Value                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| Source          | Public repository `gdgilorincommunity/devfest-ilorin2026`, branch `main` |
| Build pack      | Dockerfile, base directory `/services/remove-bg`, Dockerfile `/Dockerfile` |
| Ports exposes   | `8080`                                                                 |
| Port mappings   | `127.0.0.1:8090:8080`                                                  |
| Domains         | none                                                                   |
| Health check    | off in Coolify. The image's own `HEALTHCHECK` reports it               |
| Resource limits | CPU `2`, memory `2g`, memory and swap `2g` (no swap)                   |
| Env vars        | `API_TOKEN` only                                                       |

The source is a public repository, so pushes don't redeploy it. Press
Redeploy in Coolify after a change here is merged.

The nginx site, `/etc/nginx/sites-available/getdp.devfestilorin.com`:

```nginx
server {
    listen 80;
    server_name getdp.devfestilorin.com;

    client_max_body_size 11m;
    proxy_read_timeout 60s;

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enabled with `ln -s` into `sites-enabled`, then
`certbot --nginx -d getdp.devfestilorin.com`, which also renews it. The DNS
record is proxied through Cloudflare. Its SSL mode must be Full (strict), as
Flexible loops on certbot's redirect. Switch the record to DNS only if a
certificate ever has to be issued again by hand.

### Google Cloud Run

From the repository root:

```bash
gcloud run deploy devfest-remove-bg --source services/remove-bg --memory 2Gi --cpu 2 --allow-unauthenticated --set-env-vars API_TOKEN=CHANGE_ME
```

`--allow-unauthenticated` lets the website reach the service without Google
sign-in. The token keeps everyone else out.

### The website

Use a long random token, for example from `openssl rand -hex 32`. Set these on
the website's host and redeploy it:

- `REMOVE_BG_URL`: the service's URL, `https://getdp.devfestilorin.com`
- `REMOVE_BG_TOKEN`: the same value as `API_TOKEN`
