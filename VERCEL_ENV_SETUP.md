# Production Environment Variables

## Frontend (Vercel)

Add these environment variables in the Vercel Dashboard under **Project Settings** → **Environment Variables**:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.onrender.com
```

### How to Set in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: Your backend URL (e.g., `https://sagarsaathi-backend.onrender.com`)
   - Environment: Production, Preview, Development
4. Click **Save**
5. Redeploy your application

> **Important**: Replace `your-backend-url.onrender.com` with your actual backend URL from Render.

## Backend (Render)

These should already be configured in your Render dashboard:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Additional Backend Configuration:

After deploying frontend to Vercel, update your backend CORS configuration to include your Vercel domain.

## Security Notes

- Never commit `.env` files to version control
- Use Vercel's environment variable encryption
- Rotate secrets regularly
- Use different values for development and production
- Keep `JWT_SECRET` secure and unique

## Verification

After setting environment variables:

1. Check Vercel deployment logs for any missing variable warnings
2. Test API connectivity from frontend
3. Verify Socket.io connections work
4. Check browser console for any configuration errors
