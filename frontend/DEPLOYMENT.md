# SagarSaathi Deployment Guide

This guide covers deploying the SagarSaathi application to production using Vercel for the frontend and Render (or similar) for the backend.

## Architecture Overview

- **Frontend**: Next.js application deployed on Vercel
- **Backend**: Express.js + Socket.io server deployed on Render/Railway/Fly.io
- **Database**: MongoDB Atlas (cloud-hosted)

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free tier available)
- [ ] Render/Railway/Fly.io account (free tier available)
- [ ] MongoDB Atlas account with a cluster set up

## Part 1: Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. Ensure your `backend/.env` file is NOT committed to Git (it should be in `.gitignore`)

2. Verify your `backend/package.json` has the correct start script:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

### Step 2: Deploy to Render

1. **Create a New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**
   - **Name**: `sagarsaathi-backend` (or your preferred name)
   - **Region**: Choose closest to your users (e.g., Singapore for India)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

3. **Set Environment Variables**
   
   Click "Environment" and add these variables:
   
   ```bash
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sagarsaathi?retryWrites=true&w=majority
   
   # Server
   PORT=5000
   NODE_ENV=production
   
   # Frontend URL (will be your Vercel URL - update after frontend deployment)
   FRONTEND_URL=https://your-app.vercel.app
   
   # JWT Secret (generate a strong random string)
   JWT_SECRET=your_very_secure_random_string_here
   
   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_specific_password
   
   # Cloudinary (if using)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Note your backend URL: `https://sagarsaathi-backend.onrender.com`

### Step 3: Update CORS Settings

After deployment, verify that your backend's CORS configuration includes your Vercel URL. This is already set up in `server.js` via the `FRONTEND_URL` environment variable.

## Part 2: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. Update `frontend/.env.local` with your backend URL:
   ```bash
   NEXT_PUBLIC_API_URL=https://sagarsaathi-backend.onrender.com
   NEXT_PUBLIC_SOCKET_URL=https://sagarsaathi-backend.onrender.com
   ```

2. Test the build locally:
   ```bash
   cd frontend
   npm run build
   ```
   
   Fix any build errors before proceeding.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Frontend Directory**
   ```bash
   cd frontend
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `sagarsaathi` (or your preferred name)
   - In which directory is your code located? `./`
   - Want to override settings? **N**

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter: https://sagarsaathi-backend.onrender.com
   
   vercel env add NEXT_PUBLIC_SOCKET_URL
   # Enter: https://sagarsaathi-backend.onrender.com
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

3. **Set Environment Variables**
   
   Add these in the "Environment Variables" section:
   
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://sagarsaathi-backend.onrender.com` |
   | `NEXT_PUBLIC_SOCKET_URL` | `https://sagarsaathi-backend.onrender.com` |

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-5 minutes)
   - Note your frontend URL: `https://sagarsaathi.vercel.app`

### Step 3: Update Backend FRONTEND_URL

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable to your Vercel URL:
   ```
   FRONTEND_URL=https://sagarsaathi.vercel.app
   ```
3. Render will automatically redeploy with the new environment variable

## Part 3: MongoDB Atlas Setup

If you haven't already set up MongoDB Atlas:

1. **Create a Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Choose a region close to your backend server

2. **Create Database User**
   - Go to "Database Access"
   - Add a new database user with a strong password
   - Note the username and password

3. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for Render/Vercel
   - Or add specific IPs if you know them

4. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `sagarsaathi`

## Part 4: Verification

### Test the Deployment

1. **Frontend Health Check**
   - Visit your Vercel URL
   - Verify the homepage loads correctly
   - Check browser console for errors

2. **Backend Health Check**
   - Visit `https://sagarsaathi-backend.onrender.com/`
   - Should see: "SagarSaathi API is running"

3. **API Connection Test**
   - Try registering a new user
   - Try logging in
   - Verify API calls work in browser Network tab

4. **Socket.io Test**
   - Test real-time features (GPS tracking, SOS alerts)
   - Check browser console for Socket.io connection status

### Common Issues

#### Frontend can't connect to backend
- ✅ Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- ✅ Check backend CORS allows your Vercel URL
- ✅ Ensure backend is running (check Render logs)

#### Socket.io not connecting
- ✅ Verify `NEXT_PUBLIC_SOCKET_URL` matches backend URL
- ✅ Check Render supports WebSockets (it does)
- ✅ Look for CORS errors in browser console

#### Database connection errors
- ✅ Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- ✅ Check connection string format
- ✅ Ensure database user has correct permissions

#### Render free tier sleeping
- ✅ Free tier sleeps after 15 minutes of inactivity
- ✅ First request may take 30-60 seconds to wake up
- ✅ Consider upgrading to paid tier for production

## Part 5: Continuous Deployment

Both Vercel and Render support automatic deployments:

### Vercel (Frontend)
- Automatically deploys on every push to `main` branch
- Preview deployments for pull requests
- Configure in Vercel dashboard → Settings → Git

### Render (Backend)
- Automatically deploys on every push to `main` branch
- Configure in Render dashboard → Settings → Build & Deploy

## Environment Variables Reference

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://sagarsaathi-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://sagarsaathi-backend.onrender.com
```

### Backend (.env)
```bash
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://sagarsaathi.vercel.app
JWT_SECRET=your_secure_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Security Checklist

- [ ] Strong JWT_SECRET in production
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables not committed to Git
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Email credentials use app-specific passwords
- [ ] Cloudinary credentials secured

## Monitoring & Logs

### Vercel Logs
- Dashboard → Your Project → Deployments → Click deployment → Runtime Logs
- Real-time function logs
- Build logs

### Render Logs
- Dashboard → Your Service → Logs
- Real-time application logs
- Filter by severity

## Cost Estimation

### Free Tier Limits
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Render**: 750 hours/month, sleeps after 15min inactivity
- **MongoDB Atlas**: 512MB storage, shared cluster

### Recommended Upgrades for Production
- **Render**: $7/month for always-on instance
- **MongoDB Atlas**: $9/month for dedicated cluster
- **Vercel**: Free tier usually sufficient, Pro is $20/month

## Support

For issues or questions:
- Check Vercel documentation: https://vercel.com/docs
- Check Render documentation: https://render.com/docs
- Review application logs for error messages
- Test locally first to isolate deployment issues

---

**Last Updated**: December 2025
