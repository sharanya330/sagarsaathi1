# SagarSaathi Deployment Guide

## 🚀 Quick Deployment Overview

This project consists of two parts:
1. **Frontend** (Next.js) → Deploy to **Vercel**
2. **Backend** (Express + Socket.io) → Deploy to **Render/Railway/Fly.io**

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works)
- Render/Railway/Fly.io account (for backend)
- MongoDB Atlas account (for database)

---

## 🎯 Part 1: Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

The backend is already configured for deployment. Ensure you have:
- ✅ `backend/package.json` with start script
- ✅ `backend/server.js` configured
- ✅ Environment variables documented in `backend/.env.example`

### Step 2: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `sagarsaathi` repository

3. **Configure Service**
   ```
   Name: sagarsaathi-backend
   Region: Singapore (or closest to your users)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables**
   
   Add these in Render's Environment section:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sagarsaathi
   JWT_SECRET=your_super_secret_jwt_key_change_this
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://sagarsaathi-backend.onrender.com`)

### Alternative: Deploy to Railway

1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables (same as above)
6. Deploy and copy the URL

---

## 🎨 Part 2: Frontend Deployment (Vercel)

### Step 1: Update Frontend Environment Variables

Create `frontend/.env.local` with your backend URL:

```env
NEXT_PUBLIC_API_URL=https://sagarsaathi-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://sagarsaathi-backend.onrender.com
```

### Step 2: Test Build Locally

```bash
cd frontend
npm install
npm run build
```

Ensure build completes without errors.

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd /Users/sharanya/Desktop/sagarsaathi
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `sagarsaathi` (or your choice)
   - In which directory is your code located? `./`
   - Want to override settings? **N**

5. **Set Environment Variables in Vercel**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter your backend URL when prompted
   
   vercel env add NEXT_PUBLIC_SOCKET_URL
   # Enter your backend URL when prompted
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: cd frontend && npm install && npm run build
   Output Directory: frontend/.next
   Install Command: npm install && cd frontend && npm install
   ```

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`
     - `NEXT_PUBLIC_SOCKET_URL` = `https://your-backend-url.onrender.com`

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

---

## ✅ Verification Steps

### 1. Test Backend

```bash
curl https://your-backend-url.onrender.com/
# Should return: "SagarSaathi API is running"
```

### 2. Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Check browser console for errors
3. Try logging in / registering
4. Verify API calls are working

### 3. Test Real-time Features

1. Open browser console
2. Navigate to a page with GPS tracking
3. Check Socket.io connection status
4. Verify real-time updates work

---

## 🔧 Troubleshooting

### Frontend Build Errors

**Error: Cannot find module '@tailwindcss/postcss'**
```bash
cd frontend
npm install @tailwindcss/postcss
```

**Error: Peer dependency conflict**
```bash
cd frontend
npm install --legacy-peer-deps
```

### Backend Connection Issues

**CORS Error**
- Ensure `FRONTEND_URL` in backend env matches your Vercel URL
- Check backend CORS configuration in `server.js`

**Socket.io Connection Failed**
- Verify `NEXT_PUBLIC_SOCKET_URL` is set correctly
- Check backend Socket.io CORS settings
- Ensure backend supports WebSocket connections (Render/Railway do)

### Database Connection Issues

**MongoDB Connection Error**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)
- Ensure database user has proper permissions

---

## 📝 Environment Variables Checklist

### Backend (Render/Railway)
- [ ] `MONGODB_URI`
- [ ] `JWT_SECRET`
- [ ] `PORT`
- [ ] `NODE_ENV`
- [ ] `FRONTEND_URL`
- [ ] `EMAIL_SERVICE`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASS`

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_SOCKET_URL`

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

- **Vercel**: Automatically deploys on push to `main` branch
- **Render**: Automatically deploys on push to `main` branch

To disable auto-deploy, check the settings in respective dashboards.

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🆘 Need Help?

If you encounter issues:
1. Check deployment logs in Vercel/Render dashboard
2. Verify all environment variables are set correctly
3. Test backend API endpoints directly
4. Check browser console for frontend errors
