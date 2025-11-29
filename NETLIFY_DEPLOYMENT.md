# SagarSaathi - Netlify Deployment Guide

## Quick Deploy Steps

### 1. Push Changes to GitHub
```bash
git add .
git commit -m "Configure for Netlify deployment"
git push origin main
```

### 2. Netlify Dashboard Settings

Go to your Netlify project settings and configure:

**Build Settings:**
- **Branch to deploy**: `main`
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `20`

**Environment Variables** (Add these in Netlify dashboard):
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
NODE_VERSION=20
```

### 3. Install Netlify Next.js Plugin

In your Netlify project:
1. Go to **Plugins** tab
2. Search for **"Essential Next.js"** or **"@netlify/plugin-nextjs"**
3. Click **Install**

### 4. Trigger Redeploy

After pushing the changes:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

## What Was Fixed

1. ✅ Removed `output: 'standalone'` from `next.config.js` (Docker-only setting)
2. ✅ Created `netlify.toml` with proper configuration
3. ✅ Updated `package.json` with postinstall script for dependencies

## Backend Deployment

Your frontend needs a backend. Deploy the backend separately:

### Option 1: Render.com (Recommended)
1. Go to [render.com](https://render.com)
2. Create **New Web Service**
3. Connect repo: `sagarsaathi1`
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secret_key
     PORT=5000
     TWILIO_ACCOUNT_SID=your_twilio_sid
     TWILIO_AUTH_TOKEN=your_twilio_token
     TWILIO_PHONE_NUMBER=your_twilio_number
     ```

### Option 2: Railway.app
Similar setup, just point to `backend` directory

## After Backend Deployment

Update Netlify environment variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

Then redeploy on Netlify.

## Troubleshooting

### Build fails with dependency errors
- The `netlify.toml` includes `--legacy-peer-deps` flag
- If still failing, check build logs for specific errors

### 404 errors
- Ensure base directory is set to `frontend`
- Check that Next.js plugin is installed

### API calls fail
- Verify backend is deployed and running
- Check environment variables are set correctly
- Ensure CORS is enabled on backend

## MongoDB Setup

You need MongoDB Atlas for production:
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Add to backend environment variables

## Testing

After deployment:
- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-backend.onrender.com`
- Test API: `https://your-backend.onrender.com/api/health`
