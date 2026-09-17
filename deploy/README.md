# AWS EC2 deployment — Xavier SaaS

Everything on **one EC2 t2.micro** (Amazon Linux 2023, free tier):

```
Internet ── nginx :80 ──┬── /            → static Next.js export (landing)
                        ├── /dashboard/* → static Vite SPA (frontend)
                        └── /api/*       → Node/Express :8080 via PM2 (backend)

Backend talks to → Postgres 15 on 127.0.0.1:5432 (same box)
```

**RAM budget on 1GB t2.micro:** nginx ~30MB · Node/Express ~250MB · Postgres ~150MB · OS ~250MB · headroom ~320MB. Tight but works for testing / low traffic. Upgrade to t3.small ($15/mo) if you outgrow it.

## Files in this folder

| File | Purpose |
|---|---|
| `nginx.conf` | nginx site config (`/etc/nginx/conf.d/xavier.conf`) |
| `ecosystem.config.cjs` | PM2 config for the backend process |
| `bootstrap.sh` | One-time EC2 setup (Node, git, nginx, PM2, Postgres, clone repo) |
| `deploy.sh` | Build + deploy all three services (run on every code change) |
| `env.example` | Template for `backend/.env` |
| `frontend.env.example` | Template for `frontend/.env.production` |

## First-time flow

1. **Launch EC2 t2.micro** — Amazon Linux 2023, us-east-1 (or your region), Free-tier eligible. Security group: allow SSH (your IP), HTTP (anywhere), HTTPS (anywhere). Download key pair.
2. **SSH in:** `ssh -i xavier-key.pem ec2-user@<public-IP>`
3. **Bootstrap:**
   ```
   curl -sSL https://raw.githubusercontent.com/devRafy/slovx/main/deploy/bootstrap.sh | bash
   ```
   Installs Node 20, nginx, PM2, Postgres 15. Creates DB `xavier` + user `xavier` with a random password saved to `~/.xavier_db`.
4. **Fill in env files:**
   ```
   cat ~/.xavier_db   # note the DB password
   cp ~/xavier_saas/deploy/env.example          ~/xavier_saas/backend/.env
   cp ~/xavier_saas/deploy/frontend.env.example ~/xavier_saas/frontend/.env.production
   nano ~/xavier_saas/backend/.env
   nano ~/xavier_saas/frontend/.env.production
   ```
   Backend: paste the DB password into both `DATABASE_URL` and `DIRECT_URL`, plus your Anthropic key, generated JWT secrets (`openssl rand -base64 48`), and `FRONTEND_URL=http://<your-IP>`.
   Frontend: leave `VITE_API_URL` empty. Firebase vars only if you want Google sign-in.
5. **Push schema + deploy:**
   ```
   cd ~/xavier_saas/backend && npx prisma db push
   bash ~/xavier_saas/deploy/deploy.sh
   ```
6. **Enable PM2 on reboot:**
   ```
   pm2 startup     # copy-paste the printed sudo command
   pm2 save
   ```

## Subsequent deploys

```
ssh -i xavier-key.pem ec2-user@<public-IP>
bash ~/xavier_saas/deploy/deploy.sh
```

Pulls latest main, rebuilds all three, reloads nginx, zero-downtime PM2 reload of the backend.

## Health checks

```
curl http://<public-IP>/health         # backend via nginx
curl -I http://<public-IP>/            # landing
curl -I http://<public-IP>/dashboard/  # SPA
```

## Common commands

```
pm2 logs xavier-api --lines 50         # backend live tail
sudo tail -50 /var/log/nginx/error.log # nginx errors
sudo systemctl status postgresql       # DB status
psql -h 127.0.0.1 -U xavier -d xavier  # connect to DB (needs password from ~/.xavier_db)
```

## Adding HTTPS later

**Cloudflare (recommended, free):**
1. Point a domain at your EC2 Elastic IP (A record)
2. Add site to Cloudflare, set SSL mode to "Flexible"
3. Done — TLS terminates at Cloudflare, HTTP to origin

**Let's Encrypt via certbot:**
1. Point a domain A record at the Elastic IP
2. `sudo dnf install -y certbot python3-certbot-nginx`
3. `sudo certbot --nginx -d yourdomain.com`
4. Certbot rewrites nginx config for you and sets up auto-renewal

## Backups

Postgres on the box means you own the backups. Cheap options:

```
# One-off manual dump
pg_dump -h 127.0.0.1 -U xavier xavier > ~/xavier-$(date +%F).sql

# Automated daily via cron: append to `crontab -e`
0 2 * * * pg_dump -h 127.0.0.1 -U xavier xavier | gzip > ~/backups/xavier-$(date +\%F).sql.gz && find ~/backups -type f -mtime +14 -delete
```

Consider pushing dumps to S3 (free 5GB tier) for off-box durability once you have real data.
