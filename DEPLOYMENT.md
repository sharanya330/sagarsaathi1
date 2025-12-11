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
# Deployment Guide

This guide covers deploying the consolidated SagarSaathi application to Vercel.

## Architecture Overview

The application is now a **single Next.js application** containing both the frontend UI and the backend API routes.

- **Frontend**: Next.js App Router (`src/app`)
- **Backend**: Next.js API Routes (`src/app/api`)
- **Database**: MongoDB Atlas

## 1. Prerequisites

- **GitHub Account**: Source code hosted on GitHub.
- **Vercel Account**: For deployment.
- **MongoDB Atlas Account**: For the database.
- **Cloudinary Account**: For file uploads.
- **Gmail Account**: For sending emails (App Password required).

## 2. Environment Variables

You need to set the following environment variables in your Vercel Project Settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for signing tokens | `your-super-secret-key-123` |
| `EMAIL_SERVICE` | Email provider | `gmail` |
| `EMAIL_USER` | Email address for sending | `your-email@gmail.com` |
| `EMAIL_PASS` | App Password (not login password) | `abcd efgh ijkl mnop` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `abcdef123456` |
| `NEXT_PUBLIC_API_URL` | API Base URL (Internal) | `https://your-app.vercel.app` |

## 3. Deploying to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository (`sagarsaathi1`).
4. **Framework Preset**: Next.js (Auto-detected).
5. **Root Directory**: `frontend` (Important!).
6. Expand **Environment Variables** and add the variables listed above.
7. Click **Deploy**.

### Option B: Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Run deploy command from root:
   ```bash
   vercel --prod
   ```
3. Follow the prompts.

## 4. Post-Deployment Verification

1. **Check Build Logs**: Ensure the build passed without errors.
2. **Test API**: Visit `https://your-app.vercel.app/api/auth/me` (should return 401 Unauthorized if not logged in, proving the API is working).
3. **Test Database**: Try registering a new user to verify MongoDB connection.

## 5. Troubleshooting

### Build Failures
- **TypeScript Errors**: We have disabled strict type checking for build (`ignoreBuildErrors: true` in `next.config.js`).
- **Tailwind CSS**: Ensure you are using `tailwindcss` v4 if using `@tailwindcss/postcss`.

### Runtime Errors
- **500 Internal Server Error**: Check Vercel Function Logs. Usually indicates missing environment variables (e.g., `MONGODB_URI`).
- **404 Not Found**: Check if your API routes are in `src/app/api/...`.

### Socket.io Issues
- **Connection Failed**: Socket.io has limitations on Vercel serverless functions.
- **Solution**: For production real-time features, consider migrating to a managed service like **Pusher** or **Ably**.

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
