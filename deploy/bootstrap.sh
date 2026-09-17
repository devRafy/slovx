#!/usr/bin/env bash
# One-time EC2 bootstrap for a fresh Amazon Linux 2023 t2.micro.
# Installs Node 20, git, nginx, PM2, Postgres 15; clones the repo; creates
# the app database + user.
#
# Usage (SSH into the instance first, then):
#   curl -sSL https://raw.githubusercontent.com/devRafy/slovx/main/deploy/bootstrap.sh | bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/devRafy/slovx.git}"
CLONE_DIR="${CLONE_DIR:-$HOME/xavier_saas}"
DB_NAME="${DB_NAME:-xavier}"
DB_USER="${DB_USER:-xavier}"
# One-off DB password generated on first bootstrap. Saved to ~/.xavier_db
# so subsequent runs (or deploy.sh) can read it without regenerating.
if [ -f "$HOME/.xavier_db" ]; then
  # shellcheck disable=SC1091
  source "$HOME/.xavier_db"
else
  DB_PASSWORD="$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)"
  echo "DB_PASSWORD='$DB_PASSWORD'" > "$HOME/.xavier_db"
  chmod 600 "$HOME/.xavier_db"
fi

echo "▶ Updating packages..."
sudo dnf update -y

echo "▶ Installing Node.js 20, git, nginx, Postgres 15..."
sudo dnf install -y nodejs20 nodejs20-npm git nginx postgresql15 postgresql15-server
sudo alternatives --install /usr/bin/node node /usr/bin/node-20 90 \
                   --slave  /usr/bin/npm  npm  /usr/bin/npm-20
node --version && npm --version

echo "▶ Installing PM2 globally..."
sudo npm install -g pm2

echo "▶ Initialising Postgres cluster (idempotent)..."
if [ ! -f /var/lib/pgsql/data/PG_VERSION ]; then
  sudo postgresql-setup --initdb
fi

echo "▶ Enabling md5 password auth on localhost..."
# Amazon Linux ships pg_hba.conf with 'ident' auth for local — replace with md5
# so our app can connect via password. Loopback only, so no external exposure.
sudo sed -i 's/^host\s\+all\s\+all\s\+127\.0\.0\.1\/32\s\+ident/host all all 127.0.0.1\/32 md5/' /var/lib/pgsql/data/pg_hba.conf
sudo sed -i 's/^host\s\+all\s\+all\s\+::1\/128\s\+ident/host all all ::1\/128 md5/' /var/lib/pgsql/data/pg_hba.conf
sudo sed -i 's/^local\s\+all\s\+all\s\+peer/local all all md5/' /var/lib/pgsql/data/pg_hba.conf

echo "▶ Starting Postgres..."
sudo systemctl enable --now postgresql

echo "▶ Creating database + user (idempotent)..."
sudo -u postgres psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASSWORD';
  ELSE
    ALTER ROLE $DB_USER WITH PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
 WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
SQL

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
sudo sed -i 's|listen       80;|listen 80 disabled;|' /etc/nginx/nginx.conf 2>/dev/null || true

echo "▶ Preparing web root directories..."
sudo mkdir -p /var/www/landing /var/www/frontend
sudo chown -R "$USER:$USER" /var/www/landing /var/www/frontend

echo ""
echo "✅ Bootstrap complete."
echo ""
echo "─────────────────────────────────────────────────────────────"
echo " Postgres is running on 127.0.0.1:5432"
echo " Database:  $DB_NAME"
echo " User:      $DB_USER"
echo " Password:  (saved to ~/.xavier_db — cat that file to see it)"
echo ""
echo " DATABASE_URL for backend/.env:"
echo "   postgresql://$DB_USER:\$DB_PASSWORD@127.0.0.1:5432/$DB_NAME"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "NEXT STEPS:"
echo "  1. Copy deploy/env.example → backend/.env and fill in values"
echo "     (DB password is in ~/.xavier_db)"
echo "  2. Copy deploy/frontend.env.example → frontend/.env.production"
echo "  3. Run: bash $CLONE_DIR/deploy/deploy.sh"
