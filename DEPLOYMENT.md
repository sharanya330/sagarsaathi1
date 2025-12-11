# SagarSaathi Deployment Guide

This guide covers deploying the consolidated SagarSaathi application to Vercel.

## Architecture Overview

The application is a **single Next.js application** containing both the frontend UI and the backend API routes.

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
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `your-client-secret` |
| `NEXTAUTH_URL` | Production URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random String for NextAuth | `openssl rand -base64 32` |

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
