#!/usr/bin/env bash
# Build + deploy everything: landing, frontend, backend.
# Idempotent — safe to run repeatedly. Pulls the latest main first.
#
# Usage on the EC2 instance:
#   bash ~/xavier_saas/deploy/deploy.sh
set -euo pipefail

REPO_DIR="${REPO_DIR:-$HOME/xavier_saas}"
LANDING_WEB=/var/www/landing
FRONTEND_WEB=/var/www/frontend

cd "$REPO_DIR"

echo "▶ Pulling latest from main..."
git pull --ff-only

# ── Backend ────────────────────────────────────────────────────
echo "▶ Backend: installing deps + generating Prisma client..."
cd "$REPO_DIR/backend"
npm ci --omit=dev
# `postinstall` runs `prisma generate`, so the client is fresh here.

# .env must exist for zod validation in src/config/env.js to pass.
if [ ! -f .env ]; then
  echo "❌ backend/.env is missing. Create it from deploy/env.example first."
  exit 1
fi

# Restart or start the PM2 process.
if pm2 describe xavier-api >/dev/null 2>&1; then
  echo "▶ Backend: reloading via PM2..."
  pm2 reload xavier-api --update-env
else
  echo "▶ Backend: starting via PM2..."
  pm2 start "$REPO_DIR/deploy/ecosystem.config.cjs"
  pm2 save
fi

# ── Landing (Next.js static export) ────────────────────────────
echo "▶ Landing: installing deps + building static export..."
cd "$REPO_DIR/landing"
npm ci
npm run build

echo "▶ Landing: syncing to $LANDING_WEB..."
sudo rsync -a --delete out/ "$LANDING_WEB/"

# ── Frontend (Vite SPA at /dashboard) ──────────────────────────
echo "▶ Frontend: installing deps + building for /dashboard..."
cd "$REPO_DIR/frontend"

if [ ! -f .env.production ]; then
  echo "❌ frontend/.env.production is missing. Create it with VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL (empty for same-origin)."
  exit 1
fi

npm ci
VITE_BASE_PATH=/dashboard/ npm run build

echo "▶ Frontend: syncing to $FRONTEND_WEB..."
sudo rsync -a --delete dist/ "$FRONTEND_WEB/"

# ── nginx ──────────────────────────────────────────────────────
echo "▶ nginx: reloading config..."
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "✅ Deploy complete."
echo ""
echo "SMOKE TEST:"
echo "  curl -sS http://localhost/health         # backend via nginx"
echo "  curl -sSI http://localhost/              # landing"
echo "  curl -sSI http://localhost/dashboard/    # SPA"
