# 🚀 Quick Vercel Deployment Reference

## Prerequisites Checklist
- [ ] Backend deployed to Render/Railway/Fly.io
- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend URL noted (e.g., `https://your-app.onrender.com`)
- [ ] Vercel account created

## Frontend Deployment (5 minutes)

### Option 1: Vercel CLI (Fastest)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend directory
cd frontend

# Deploy to production
vercel --prod
```

### Option 2: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. Click "Deploy"

## Environment Variables (Required)

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | Your backend URL | `https://sagarsaathi-backend.onrender.com` |
| `NEXT_PUBLIC_SOCKET_URL` | Your backend URL | `https://sagarsaathi-backend.onrender.com` |
| `GOOGLE_CLIENT_ID` | Google Client ID | `your-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google Client Secret | `your-client-secret` |
| `NEXTAUTH_URL` | Production URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random String | `your-random-secret` |

### Important: Google OAuth Redirect URI
In your **Google Cloud Console** > **Credentials** > **OAuth 2.0 Client IDs**:
1.  Add your **Production URL** to "Authorized JavaScript origins":
    -   `https://your-app.vercel.app`
2.  Add your **Callback URL** to "Authorized redirect URIs":
    -   `https://your-app.vercel.app/api/auth/callback/google`
    -   *(If testing on Vercel Preview)*: `https://your-preview-url.vercel.app/api/auth/callback/google`

## Post-Deployment

1. **Update Backend CORS**
   - Go to your backend deployment (Render/Railway)
   - Set `FRONTEND_URL` environment variable to your Vercel URL
   - Example: `https://sagarsaathi.vercel.app`

2. **Test Deployment**
   - Visit your Vercel URL
   - Try registering/logging in
   - Check browser console for errors
   - Test real-time features (GPS tracking, SOS)

## Common Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL
```

## Troubleshooting

### Build Fails
```bash
# Test build locally first
cd frontend
npm run build
```

### API Connection Issues
- ✅ Check `NEXT_PUBLIC_API_URL` is set in Vercel
- ✅ Verify backend is running
- ✅ Check CORS configuration in backend

### Socket.io Not Connecting
- ✅ Verify `NEXT_PUBLIC_SOCKET_URL` matches backend URL
- ✅ Check browser console for connection errors
- ✅ Ensure backend supports WebSockets (Render does)

## Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Full Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Need Help?** See the complete [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions.
