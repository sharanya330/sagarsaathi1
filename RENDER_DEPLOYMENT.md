# Deploy SagarSaathi to Render

Complete guide to deploy SagarSaathi to Render with MongoDB Atlas.

## Prerequisites

- GitHub account
- Render account (free): https//render.com
- MongoDB Atlas account (free): https://www.mongodb.com/cloud/atlas/register

## Step 1: Set Up MongoDB Atlas

### 1.1 Create Account and Cluster

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a new project (name it "SagarSaathi")
4. Click "Build a Database"
5. Choose **M0 FREE** tier
6. Select a cloud provider and region (closest to you)
7. Name your cluster (e.g., "sagarsaathi-cluster")
8. Click "Create"

### 1.2 Configure Database Access

1. In Atlas dashboard, go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `sagarsaathi_user`
5. Click "Autogenerate Secure Password" - **SAVE THIS PASSWORD**
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.3 Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.4 Get Connection String

1. Go to **Database** (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string - looks like:
   ```
   mongodb+srv://sagarsaathi_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you saved earlier
7. Add database name before the `?`: `/sagarsaathi?retryWrites=true&w=majority`

**Final connection string format:**
```
mongodb+srv://sagarsaathi_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/sagarsaathi?retryWrites=true&w=majority
```

## Step 2: Push Code to GitHub

1. Make sure your code is committed:
   ```bash
   cd /Users/sharanya/Desktop/sagarsaathi
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (sagarsaathi)
4. Configure:
   - **Name:** `sagarsaathi-backend`
   - **Region:** Oregon (US West)
   - **Branch:** main
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 3.2 Set Environment Variables

Click "Advanced" → "Add Environment Variable" for each:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string from Step 1.4 |
| `JWT_SECRET` | Generate with: `openssl rand -base64 32` |
| `TWILIO_ACCOUNT_SID` | `your_account_sid_here` (optional) |
| `TWILIO_AUTH_TOKEN` | `your_auth_token_here` (optional) |
| `TWILIO_PHONE_NUMBER` | `your_twilio_phone_number_here` (optional) |

### 3.3 Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://sagarsaathi-backend.onrender.com`

## Step 4: Deploy Frontend to Render

### 4.1 Create Static Site

1. In Render dashboard, click "New +" → "Static Site"
2. Select your GitHub repository
3. Configure:
   - **Name:** `sagarsaathi-frontend`
   - **Branch:** main
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `.next`

### 4.2 Set Environment Variables

Add these environment variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://sagarsaathi-backend.onrender.com` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://sagarsaathi-backend.onrender.com` |

### 4.3 Deploy

1. Click "Create Static Site"
2. Wait for deployment (3-5 minutes)
3. Your frontend URL will be: `https://sagarsaathi-frontend.onrender.com`

## Step 5: Test Your Deployment

1. Visit your frontend URL: `https://sagarsaathi-frontend.onrender.com`
2. Try registering a new user
3. Test login functionality
4. Verify dashboard loads

## Your Live URLs

After deployment, you'll have:

- **Frontend:** `https://sagarsaathi-frontend.onrender.com`
- **Backend API:** `https://sagarsaathi-backend.onrender.com`
- **Database:** MongoDB Atlas (managed)

## Important Notes

> [!WARNING]
> **Free Tier Limitations:**
> - Services sleep after 15 minutes of inactivity
> - First request after sleep takes ~30 seconds to wake up
> - 750 hours/month limit
> - Not suitable for production traffic

> [!TIP]
> **Keep Services Awake:**
> Use a service like UptimeRobot (free) to ping your backend every 14 minutes to prevent sleeping.

## Troubleshooting

### Backend won't start

1. Check logs in Render dashboard
2. Verify `MONGODB_URI` is correct
3. Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Frontend can't connect to backend

1. Verify `NEXT_PUBLIC_API_URL` matches your backend URL exactly
2. Check backend is running (visit backend URL directly)
3. Check browser console for CORS errors

### Database connection fails

1. Verify password in connection string is correct
2. Check Network Access in MongoDB Atlas allows 0.0.0.0/0
3. Ensure database user has read/write permissions

## Alternative: Use render.yaml

For automated deployment, Render can use the `render.yaml` file:

1. In Render dashboard, click "New +" → "Blueprint"
2. Connect your repository
3. Render will detect `render.yaml` and configure automatically
4. You'll still need to set `MONGODB_URI` and `JWT_SECRET` manually

## Next Steps

- Set up custom domain (optional)
- Configure SSL/HTTPS (automatic with Render)
- Set up monitoring and alerts
- Configure automated backups for MongoDB Atlas
