# Quick Start Guide - SagarSaathi

Choose your deployment method:

## Option 1: Local Deployment (Fastest - 2 minutes)

Get SagarSaathi running on your machine:

```bash
cd /Users/sharanya/Desktop/sagarsaathi
./setup-local.sh
```

**Access URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**What the script does:**
- Generates secure JWT_SECRET
- Creates .env files automatically
- Stops old containers
- Starts Docker Compose
- Displays access URLs

**Stop services:**
```bash
docker-compose down
```

---

## Option 2: Cloud Deployment (Public URL - 20 minutes)

Deploy to Render for a public URL like `https://sagarsaathi-frontend.onrender.com`

**Follow the guide:** [RENDER_DEPLOYMENT.md](file:///Users/sharanya/Desktop/sagarsaathi/RENDER_DEPLOYMENT.md)

**Steps:**
1. Create MongoDB Atlas account (5 min)
2. Create Render account (2 min)
3. Deploy backend (5 min)
4. Deploy frontend (5 min)
5. Test deployment (3 min)

**You'll get:**
- Public URLs accessible from anywhere
- Free tier (suitable for demos)
- Automatic SSL/HTTPS
- No local setup needed

---

## Which Should I Choose?

**Choose Local if:**
- ✅ You want to test quickly
- ✅ You're developing/debugging
- ✅ You don't need public access
- ✅ You have Docker installed

**Choose Cloud if:**
- ✅ You want a public demo URL
- ✅ You want to share with others
- ✅ You don't want to run Docker locally
- ✅ You want automatic deployments from GitHub

---

## Need Help?

- **Docker deployment:** See [DOCKER_DEPLOYMENT.md](file:///Users/sharanya/Desktop/sagarsaathi/DOCKER_DEPLOYMENT.md)
- **Cloud deployment:** See [RENDER_DEPLOYMENT.md](file:///Users/sharanya/Desktop/sagarsaathi/RENDER_DEPLOYMENT.md)
- **Environment variables:** See backend/.env.example and frontend/.env.example
