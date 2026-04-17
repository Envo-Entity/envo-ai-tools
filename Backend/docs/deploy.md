# Backend Deployment Guide

**Server:** `ec2-3-250-26-73.eu-west-1.compute.amazonaws.com` (Ubuntu)  
**Live URL:** `https://aitools.clubenvo.com`  
**SSH key:** `/Users/mayank/Developer/Envo/envo-ai-tools-server-key.pem`

---

## Deploying code updates

Run these three commands from the repo root every time you update the backend:

**1. Build locally** (tsc runs out of memory on the server)
```bash
cd Backend
./node_modules/.bin/tsc -p tsconfig.json
```

**2. Sync compiled output to server**
```bash
rsync -avz -e "ssh -i /Users/mayank/Developer/Envo/envo-ai-tools-server-key.pem -o StrictHostKeyChecking=no" \
  --exclude node_modules --exclude .env \
  Backend/dist/ \
  ubuntu@ec2-3-250-26-73.eu-west-1.compute.amazonaws.com:~/app/backend/dist/
```

**3. Restart the app**
```bash
ssh -i /Users/mayank/Developer/Envo/envo-ai-tools-server-key.pem ubuntu@ec2-3-250-26-73.eu-west-1.compute.amazonaws.com \
  "pm2 restart envo-backend"
```

Verify it's healthy:
```bash
curl https://aitools.clubenvo.com/health
# Expected: {"status":"ok","service":"ENVO AI TOOLS Backend"}
```

---

## Updating environment variables

SSH into the server and edit `.env`, then restart:
```bash
ssh -i /Users/mayank/Developer/Envo/envo-ai-tools-server-key.pem ubuntu@ec2-3-250-26-73.eu-west-1.compute.amazonaws.com
nano ~/app/backend/.env
pm2 restart envo-backend --update-env
```

---

## Adding new npm dependencies

If you add a package to `package.json`, you need to install it on the server too:
```bash
# After syncing dist/, SSH in and run:
ssh -i /Users/mayank/Developer/Envo/envo-ai-tools-server-key.pem ubuntu@ec2-3-250-26-73.eu-west-1.compute.amazonaws.com \
  "cd ~/app/backend && npm install --omit=dev && pm2 restart envo-backend"
```

Also sync `package.json` and `package-lock.json`:
```bash
rsync -avz -e "ssh -i /Users/mayank/Developer/Envo/envo-ai-tools-server-key.pem -o StrictHostKeyChecking=no" \
  Backend/package.json Backend/package-lock.json \
  ubuntu@ec2-3-250-26-73.eu-west-1.compute.amazonaws.com:~/app/backend/
```

---

## Useful server commands

```bash
SSH_CMD="ssh -i /Users/mayank/Developer/Envo/envo-ai-tools-server-key.pem ubuntu@ec2-3-250-26-73.eu-west-1.compute.amazonaws.com"

$SSH_CMD "pm2 status"          # Check if app is running
$SSH_CMD "pm2 logs envo-backend --lines 50"   # View recent logs
$SSH_CMD "pm2 restart envo-backend"           # Restart app
$SSH_CMD "sudo systemctl status nginx"        # Check nginx
$SSH_CMD "sudo nginx -t"                      # Test nginx config
$SSH_CMD "free -m"                            # Check memory
```

---

## Server setup details (already done)

- Node.js 22 installed via NodeSource
- PM2 configured with `pm2 startup systemd` — auto-starts on reboot
- nginx reverse-proxies port 80/443 → port 4000
- SSL cert via Let's Encrypt (auto-renews)
- 1GB swap file at `/swapfile` to prevent OOM crashes
- App lives at `~/app/backend/`, env at `~/app/backend/.env`
