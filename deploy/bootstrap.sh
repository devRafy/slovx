#!/usr/bin/env bash
# One-time EC2 bootstrap for a fresh Amazon Linux 2023 t2.micro.
# Installs Node 20, git, nginx, PM2; clones the repo; sets up log dirs.
#
# Usage (SSH into the instance first, then):
#   curl -sSL https://raw.githubusercontent.com/devRafy/slovx/main/deploy/bootstrap.sh | bash
#
# Or clone the repo manually and run `bash deploy/bootstrap.sh`.
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/devRafy/slovx.git}"
CLONE_DIR="${CLONE_DIR:-$HOME/xavier_saas}"

echo "▶ Updating packages..."
sudo dnf update -y

echo "▶ Installing Node.js 20 (via Amazon Linux AppStream)..."
# Amazon Linux 2023 has Node 20 in its default repos as `nodejs20`.
sudo dnf install -y nodejs20 nodejs20-npm git nginx
# Point `node` and `npm` at the v20 binaries system-wide.
sudo alternatives --install /usr/bin/node node /usr/bin/node-20 90 \
                   --slave  /usr/bin/npm  npm  /usr/bin/npm-20
node --version && npm --version

echo "▶ Installing PM2 globally..."
sudo npm install -g pm2

echo "▶ Cloning repo..."
if [ -d "$CLONE_DIR/.git" ]; then
  echo "Repo already exists at $CLONE_DIR — pulling latest."
  git -C "$CLONE_DIR" pull --ff-only
else
  git clone "$REPO_URL" "$CLONE_DIR"
fi

echo "▶ Creating log directory..."
mkdir -p "$HOME/logs"

echo "▶ Installing nginx site config..."
sudo cp "$CLONE_DIR/deploy/nginx.conf" /etc/nginx/conf.d/xavier.conf
# Amazon Linux 2023 uses /etc/nginx/conf.d/*.conf, so a plain drop-in works.
# Remove the default welcome server so ours is the only :80 listener.
sudo sed -i 's|listen       80;|listen 80 disabled;|' /etc/nginx/nginx.conf 2>/dev/null || true

echo "▶ Preparing web root directories..."
sudo mkdir -p /var/www/landing /var/www/frontend
sudo chown -R "$USER:$USER" /var/www/landing /var/www/frontend

echo "✅ Bootstrap complete."
echo ""
echo "NEXT STEPS:"
echo "  1. Create $CLONE_DIR/backend/.env with your Supabase + Anthropic + Meta env vars."
echo "     (See deploy/env.example for the full list.)"
echo "  2. Run:  bash $CLONE_DIR/deploy/deploy.sh"
echo "  3. Test: curl http://localhost/health"
