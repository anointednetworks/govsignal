# govsignal — Claude Code Context

## Hosting
- **Cloudflare Pages project:** `govsignal`
- **pages.dev URL:** https://govsignal.pages.dev
- **Custom domain:** None (pages.dev only)
- **Migrated from:** Netlify (Aug 2026 — see global ~/.claude/CLAUDE.md for full migration context)

## Stack
Static Vite SPA, no backend

## Deploy this site
```bash
# 1. Build
cd "/Users/anthonygibson/Downloads/GovSignal"
npm install && npm run build

# 2. (No functions/ folder — skip)

# 3. Bundle + zip
STAGE=/tmp/govsignal-stage && rm -rf "$STAGE" && mkdir -p "$STAGE"
cp -R dist/. "$STAGE"/

cd "$STAGE" && rm -f /tmp/govsignal.zip && zip -qr /tmp/govsignal.zip .

# 4. Upload via dashboard (dashboard flow — wrangler CLI login is broken)
open https://dash.cloudflare.com/94cf8a68e51d1dbdf4ab3f82668732d1/pages/view/govsignal/deployments/new
# Drag /tmp/govsignal.zip onto the dropzone, wait for "N/N files uploaded", click "Save and deploy"
```

## Do NOT
- Do NOT tell me to `git push` and expect a deploy — pushing updates git history only. The CF Pages project is direct-upload; deploys are a manual step.
- Do NOT bundle the `functions/` folder into the zip — CF's direct-upload flow silently ignores it. Only the compiled `_worker.js` runs.
