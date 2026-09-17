# AWS EC2 deployment — Xavier SaaS

Everything on **one EC2 t2.micro** (Amazon Linux 2023, free tier):

```
Internet ── nginx :80 ──┬── /            → static Next.js export (landing)
                        ├── /dashboard/* → static Vite SPA (frontend)
                        └── /api/*       → Node/Express :8080 via PM2 (backend)

Backend talks to → Supabase (Postgres + Auth) — external, free forever
```

## Files in this folder

| File | Purpose |
|---|---|
| `nginx.conf` | nginx site config; drops into `/etc/nginx/conf.d/xavier.conf` |
| `ecosystem.config.cjs` | PM2 config for the backend process |
| `bootstrap.sh` | One-time EC2 setup (installs Node, git, nginx, PM2, clones repo) |
| `deploy.sh` | Build + deploy all three services (run on every code change) |
| `env.example` | Template for `backend/.env` |
| `frontend.env.example` | Template for `frontend/.env.production` |

## First-time flow

1. Launch EC2 t2.micro in AWS Console (Amazon Linux 2023, us-east-1, allow HTTP/HTTPS/SSH in security group, download `.pem` key)
2. SSH in: `ssh -i xavier-key.pem ec2-user@<public-IP>`
3. Bootstrap:
   ```
   curl -sSL https://raw.githubusercontent.com/devRafy/slovx/main/deploy/bootstrap.sh | bash
   ```
4. Fill in env files:
   ```
   cp ~/xavier_saas/deploy/env.example ~/xavier_saas/backend/.env
   cp ~/xavier_saas/deploy/frontend.env.example ~/xavier_saas/frontend/.env.production
   nano ~/xavier_saas/backend/.env               # paste real values
   nano ~/xavier_saas/frontend/.env.production   # paste Supabase URL + anon key
   ```
5. Deploy:
   ```
   bash ~/xavier_saas/deploy/deploy.sh
   ```
6. Enable PM2 on boot (follow the printed command):
   ```
   pm2 startup
   pm2 save
   ```

## Subsequent deploys

```
ssh -i xavier-key.pem ec2-user@<public-IP>
bash ~/xavier_saas/deploy/deploy.sh
```

That's it — `deploy.sh` pulls the latest main, builds all three, reloads nginx, and PM2-reloads the backend zero-downtime.

## Health checks

```
curl http://<public-IP>/health         # backend
curl -I http://<public-IP>/            # landing
curl -I http://<public-IP>/dashboard/  # SPA
```

## Adding HTTPS later

Two paths:

**Cloudflare (recommended, free):**
1. Buy/point a domain at your EC2 Elastic IP (A record)
2. Add site to Cloudflare, set SSL mode to "Flexible" or "Full"
3. Done — TLS terminates at Cloudflare, HTTP to origin

**Let's Encrypt via certbot:**
1. Point a domain A record at the Elastic IP
2. `sudo dnf install -y certbot python3-certbot-nginx`
3. `sudo certbot --nginx -d yourdomain.com`
4. Certbot rewrites nginx config for you and sets up auto-renewal
