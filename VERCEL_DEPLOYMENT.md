# Vercel Deployment Guide

This guide will walk you through deploying the SagarSaathi application to Vercel.

## Architecture Overview

- **Frontend**: Deployed to Vercel (Next.js)
- **Backend**: Deployed to Render or similar (Node.js + Express + Socket.io)

> [!IMPORTANT]
> The backend should remain on Render (or similar platform) because it uses Socket.io which requires persistent WebSocket connections. Vercel's serverless architecture is not ideal for this use case.

## Prerequisites

1. [Vercel Account](https://vercel.com/signup)
2. GitHub repository with your code
3. Backend deployed and running (e.g., on Render)

## Step 1: Prepare Your Repository

Ensure your latest changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

## Step 2: Import Project to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (`sagarsaathi`)
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install --legacy-peer-deps`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to your project
cd /path/to/sagarsaathi

# Deploy
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** sagarsaathi (or your preferred name)
- **Directory?** `./frontend`
- **Override settings?** Yes
  - **Build Command**: `npm install --legacy-peer-deps && npm run build`
  - **Output Directory**: `.next`
  - **Development Command**: `npm run dev`

## Step 3: Configure Environment Variables

In the Vercel Dashboard, go to your project → **Settings** → **Environment Variables** and add:

### Required Variables

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | Your backend URL (e.g., `https://sagarsaathi-backend.onrender.com`) | Production, Preview, Development |
| `NEXT_PUBLIC_SOCKET_URL` | Your backend URL (same as API URL) | Production, Preview, Development |

> [!TIP]
> **Finding Your Backend URL:**
> - If using Render: Go to your Render dashboard → Your backend service → Copy the URL
> - Format: `https://your-service-name.onrender.com` (no trailing slash)

### How to Add Environment Variables

1. Go to **Project Settings** → **Environment Variables**
2. Click **Add New**
3. Enter the variable name (e.g., `NEXT_PUBLIC_API_URL`)
4. Enter the value (your backend URL)
5. Select which environments to apply to (Production, Preview, Development)
6. Click **Save**

## Step 4: Configure Backend CORS

Update your backend to allow requests from your Vercel domain.

Edit `backend/server.js`:

```javascript
const cors = require("cors");

// Update CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3002",
    "https://your-vercel-app.vercel.app",  // Add your Vercel domain
    "https://your-custom-domain.com"        // Add custom domain if you have one
  ],
  credentials: true
}));

// Update Socket.io CORS
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3002",
      "https://your-vercel-app.vercel.app",  // Add your Vercel domain
      "https://your-custom-domain.com"        // Add custom domain if you have one
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

> [!WARNING]
> Replace `your-vercel-app.vercel.app` with your actual Vercel deployment URL.

After updating, redeploy your backend on Render.

## Step 5: Deploy

### Automatic Deployment

Once configured, Vercel will automatically deploy your app whenever you push to your main branch.

### Manual Deployment

```bash
vercel --prod
```

## Step 6: Verify Deployment

1. **Check Build Logs**: In Vercel dashboard, go to **Deployments** and check the latest deployment logs
2. **Test the Application**: 
   - Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Test user registration/login
   - Test real-time features (Socket.io)
   - Check browser console for errors

## Step 7: Custom Domain (Optional)

### Add Custom Domain

1. Go to **Project Settings** → **Domains**
2. Click **Add**
3. Enter your domain name
4. Follow the DNS configuration instructions

### Update Backend CORS

After adding a custom domain, update your backend CORS configuration to include the new domain.

## Troubleshooting

### Build Fails

**Issue**: Build fails with dependency errors

**Solution**: 
- Ensure `package.json` has all required dependencies
- Check that `--legacy-peer-deps` flag is used in build command
- Review build logs in Vercel dashboard

### API Requests Fail

**Issue**: Frontend can't connect to backend

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Check backend CORS configuration includes Vercel domain
3. Ensure backend is running and accessible
4. Check browser console for CORS errors

### Socket.io Not Working

**Issue**: Real-time features don't work

**Solution**:
1. Verify `NEXT_PUBLIC_SOCKET_URL` is set correctly
2. Check Socket.io CORS configuration on backend
3. Ensure backend supports WebSocket connections
4. Check browser console for WebSocket errors

### Environment Variables Not Working

**Issue**: Environment variables are undefined

**Solution**:
1. Ensure variables start with `NEXT_PUBLIC_` prefix (for client-side access)
2. Redeploy after adding/changing environment variables
3. Check that variables are added to correct environment (Production/Preview/Development)

### 404 on Page Refresh

**Issue**: Getting 404 when refreshing pages

**Solution**: This shouldn't happen with Next.js, but if it does:
- Check that you're using Next.js App Router correctly
- Verify `next.config.js` is properly configured

## Monitoring and Analytics

### Vercel Analytics

Enable Vercel Analytics for performance monitoring:

1. Go to **Project Settings** → **Analytics**
2. Enable **Web Analytics**
3. Deploy to see analytics data

### Error Tracking

Consider integrating error tracking:
- [Sentry](https://sentry.io/)
- [LogRocket](https://logrocket.com/)
- [Datadog](https://www.datadoghq.com/)

## Performance Optimization

### Image Optimization

Next.js automatically optimizes images. Use the `next/image` component:

```tsx
import Image from 'next/image';

<Image 
  src="/path/to/image.jpg" 
  alt="Description"
  width={500}
  height={300}
/>
```

### Caching

Vercel automatically caches static assets. For API responses, implement caching in your backend.

### Edge Functions (Advanced)

For improved performance, consider using Vercel Edge Functions for certain API routes.

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Root directory set to `frontend`
- [ ] Environment variables configured
- [ ] Backend CORS updated with Vercel domain
- [ ] Backend redeployed with updated CORS
- [ ] Deployment successful
- [ ] Application tested and working
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)

## Useful Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Pull environment variables
vercel env pull
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Support

If you encounter issues:
1. Check [Vercel Status](https://www.vercel-status.com/)
2. Review [Vercel Community](https://github.com/vercel/vercel/discussions)
3. Contact [Vercel Support](https://vercel.com/support)

---

**Last Updated**: December 2025
