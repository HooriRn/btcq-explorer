# Deploying the QBTC Risk Dashboard (frontend)

The explorer is a static single-page app: Vite builds it into `dist/`, and on the
production server `vite preview` serves that folder on port 3000.

```
browser ──► Cloudflare ──► dev-nginx-1 (:80) ──► vite preview (172.17.0.1:3000) ──► dist/
                                         └─────► uvicorn API (172.17.0.1:5000)
```

- nginx config: `/root/dev/nginx/nginx.conf` (in the `btc-risk-dashboard` repo).
  It sends `dashboard.thegreatlich.xyz` and `indexer.qbtc.net` to port 3000, and any
  unknown host gets 444.
- The data comes from the Python API (`/root/dev/indexer/api.py`).

## Prerequisites

| Tool | Version on the server | Notes |
|---|---|---|
| Node | 24.11.1 | installed with nvm (`/root/.nvm`) |
| pnpm | 10.22.0 | use pnpm. `pnpm-lock.yaml` is the lockfile |

`.npmrc` hoists `@heroui/*`, which HeroUI's Tailwind plugin needs. Don't delete it.

## Configuration (build time)

Vite bakes `VITE_*` variables into the bundle **when you build**. Changing `.env` has no
effect until you rebuild.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.thegreatlich.xyz/` | Python API. **The trailing slash is required.** |
| `VITE_APP_ENVIRONMENT` | unset | Optional environment label |

Copy `.env.example` to `.env` and edit it. `.env` is gitignored.

Users can also override the API URL in the browser on the `/settings` page. The override is
stored in localStorage under `settings-storage` and takes precedence over the built-in
defaults. If one browser shows different data from another, check this first.

## Deploying on the production server

1. Get the code:

   ```bash
   cd /root/explorer/btcq-explorer
   git status          # make sure there's no uncommitted work you'd lose
   git pull
   ```

2. Install dependencies and build:

   ```bash
   pnpm install --frozen-lockfile
   cp -r dist dist.prev   # optional: keep the current build for rollback
   pnpm run build         # tsc -b && vite build, then copies .htaccess into dist/
   ```

   `tsc -b` runs first, so a type error stops the build before `dist/` is touched.
   Once `vite build` starts, it empties `dist/`, so the site is briefly unavailable
   until the build finishes.

3. Restart the preview server. It runs in tmux session `0`, window `3`:

   ```bash
   tmux a -t 0          # then press Ctrl-b 3 to go to window 3
   # Ctrl-C to stop the running server, then:
   pnpm run preview --port 3000 --host 0.0.0.0
   # Ctrl-b d to detach
   ```

   Always restart after changing `vite.config.ts`, because the preview server reads
   `allowedHosts` only when it starts.

4. Check that it works:

   ```bash
   curl -sI http://127.0.0.1:3000/ | head -1                                       # direct
   curl -sI -H 'Host: dashboard.thegreatlich.xyz' http://127.0.0.1/ | head -1     # through nginx
   ```

   Both should return `200`. Then open https://dashboard.thegreatlich.xyz and make sure
   the metric cards show real numbers. If the API is unreachable, the app falls back to
   mock metrics.

### Rollback

```bash
rm -rf dist && mv dist.prev dist
```

Then restart the preview server as in step 3. To go back to an older commit, check it
out and rebuild.

## Adding a domain

A new hostname has to be added in three places:

1. **Cloudflare DNS**: point it at the server, proxied.
2. **nginx**: add it to the frontend `server_name` in `/root/dev/nginx/nginx.conf`, then run
   `docker exec dev-nginx-1 nginx -t && docker exec dev-nginx-1 nginx -s reload`.
3. **`vite.config.ts`**: add it to `preview.allowedHosts`. Then rebuild and restart the
   preview server. If you skip this, Vite answers with *"Blocked request. This host is not
   allowed."*

## Hosting elsewhere

`dist/` is plain static files, so any static host works as long as every route falls
back to `index.html` (the router uses browser history). Config files for this are already
in the repo:

- Vercel: `vercel.json`
- Netlify / Cloudflare Pages: `public/_redirects`
- Apache: `.htaccess` (copied into `dist/` by the build)

## Known limitations of the current setup

- `vite preview` isn't meant to be a production server. A sturdier setup would have
  `dev-nginx-1` serve `dist/` directly, with `try_files $uri /index.html`.
- It binds to `0.0.0.0:3000`, so port 3000 can be reached directly from the internet,
  bypassing nginx and Cloudflare, unless a firewall blocks it.
- It lives in a tmux window, so it **doesn't come back after a reboot**. After a reboot,
  start it again as in step 3. A systemd unit would fix this.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Blocked request. This host is not allowed" | Hostname missing from `preview.allowedHosts`. Add it, rebuild, restart. |
| Dashboard shows round or fake-looking numbers | API unreachable, so the mock fallback is showing. Check `curl https://api.thegreatlich.xyz/stats/overview`, the trailing slash in `VITE_API_BASE_URL`, and the browser's `/settings` override. |
| 444 or empty response through the domain | nginx doesn't know the hostname (see *Adding a domain*). |
| 502 from nginx | The preview server isn't running on port 3000. Check with `ss -ltnp \| grep 3000`. |
