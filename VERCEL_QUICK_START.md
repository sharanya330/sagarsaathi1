# Quick Start: Vercel Deployment

Deploy your SagarSaathi app to Vercel in 5 minutes!

## 🚀 Quick Deploy

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`

### 3. Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

### 4. Update Backend CORS
Add to your Render backend environment variables:

```
FRONTEND_URL=https://your-app.vercel.app
```

Then redeploy your backend on Render.

### 5. Deploy! 🎉
Click **Deploy** in Vercel. Your app will be live in ~2 minutes.

---

## 📋 Detailed Guide
For complete instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 🔧 Troubleshooting
- **API not connecting?** Check CORS and environment variables
- **Build failing?** Ensure `--legacy-peer-deps` is in build command
- **Socket.io not working?** Verify backend CORS includes Vercel domain

## 📚 Resources
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
