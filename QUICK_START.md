# Quick Start: Vercel Deployment

## 🚀 Deploy in 3 Steps

### 1️⃣ Deploy Backend (5 minutes)

**Using Render** (Recommended):
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repo: `sagarsaathi`
4. Configure:
   - **Name**: `sagarsaathi-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
6. Click "Create Web Service"
7. **Copy your backend URL** (e.g., `https://sagarsaathi-backend.onrender.com`)

---

### 2️⃣ Deploy Frontend (3 minutes)

**Using Vercel CLI**:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /Users/sharanya/Desktop/sagarsaathi
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_API_URL
# Paste your backend URL from step 1

vercel env add NEXT_PUBLIC_SOCKET_URL
# Paste your backend URL from step 1

# Deploy to production
vercel --prod
```

**OR Using Vercel Dashboard**:
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your backend URL
   - `NEXT_PUBLIC_SOCKET_URL` = your backend URL
5. Click "Deploy"

---

### 3️⃣ Verify (2 minutes)

1. **Test Backend**:
   ```bash
   curl https://your-backend-url.onrender.com/
   # Should return: "SagarSaathi API is running"
   ```

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try logging in/registering
   - Check browser console for errors

---

## 📝 Environment Variables Checklist

### Backend (Render)
- [ ] `MONGODB_URI` - Get from MongoDB Atlas
- [ ] `JWT_SECRET` - Generate random string
- [ ] `NODE_ENV` - Set to `production`
- [ ] `FRONTEND_URL` - Your Vercel URL

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_URL` - Your Render backend URL
- [ ] `NEXT_PUBLIC_SOCKET_URL` - Your Render backend URL

---

## 🆘 Troubleshooting

**Build fails on Vercel?**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json

**Backend not connecting?**
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access (allow 0.0.0.0/0)

**CORS errors?**
- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
