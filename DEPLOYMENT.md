# SagarSaathi Deployment Guide

## Issue: 404 Error on Vercel

The 404 error occurs because Vercel is trying to deploy from the root directory, but the Next.js app is in the `frontend` folder.

## Solution: Configure Vercel Properly

### Option 1: Deploy Frontend Only (Recommended for Quick Fix)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Import your repository**: `sharanya330/sagarsaathi1`
3. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` ← **IMPORTANT!**
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install --legacy-peer-deps`

4. **Add Environment Variables** (if needed):
   - None required for frontend-only deployment

5. **Deploy**

### Option 2: Deploy Both Frontend and Backend

#### Frontend (Vercel)
Follow Option 1 above

#### Backend (Render/Railway/Heroku)

**Using Render.com:**
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo: `sharanya330/sagarsaathi1`
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     PORT=5001
     TWILIO_ACCOUNT_SID=your_twilio_sid (optional)
     TWILIO_AUTH_TOKEN=your_twilio_token (optional)
     TWILIO_PHONE_NUMBER=your_twilio_number (optional)
     ```

5. Deploy

6. **Update Frontend API URL**:
   - In `frontend/next.config.ts`, update the rewrite destination to your Render backend URL
   - Or update all API calls in components to use the backend URL

### Option 3: Deploy as Monorepo (Advanced)

Use the `vercel.json` file in the root directory (already created).

**Steps:**
1. Push the `vercel.json` to GitHub
2. In Vercel dashboard, redeploy
3. Vercel will use the configuration from `vercel.json`

## Quick Fix (Right Now)

**In Vercel Dashboard:**
1. Go to your project settings
2. Click "Build & Development Settings"
3. Set **Root Directory** to: `frontend`
4. Click "Save"
5. Redeploy

## MongoDB Setup for Production

You'll need a cloud MongoDB instance:

**MongoDB Atlas (Free Tier):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to backend environment variables

## Testing Deployment

After deployment:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com` (if using Render)

## Common Issues

### 404 Error
- **Cause**: Wrong root directory
- **Fix**: Set root directory to `frontend` in Vercel settings

### Build Fails
- **Cause**: Missing `--legacy-peer-deps` flag
- **Fix**: Set install command to `npm install --legacy-peer-deps`

### API Calls Fail
- **Cause**: Backend not deployed or wrong URL
- **Fix**: Deploy backend separately and update API URLs in frontend

## Environment Variables

### Frontend (Vercel)
None required (API URLs are in code)

### Backend (Render/Railway)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sagarsaathi
JWT_SECRET=your_random_secret_key_here
PORT=5001
NODE_ENV=production
```

## Need Help?

If you're still getting 404:
1. Check Vercel deployment logs
2. Verify root directory is set to `frontend`
3. Make sure the build completed successfully
4. Check that `frontend/src/app/page.tsx` exists
