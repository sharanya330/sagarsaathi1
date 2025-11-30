# Hybrid Deployment Guide: Netlify + Render

This guide explains how to connect your **Netlify Frontend** to your **Render Backend**.

## Phase 1: Deploy Backend (Render)

1.  **Push Changes**: Ensure your code is on GitHub.
2.  **Render Dashboard**: Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
3.  **New Blueprint**: Click **New Blueprint Instance** and select your `sagarsaathi1` repo.
4.  **Configure**:
    - Render will detect `render.yaml` (Backend only).
    - Enter `MONGODB_URI` (from your local `.env`).
    - Click **Apply**.
5.  **Get URL**: Once deployed, copy your backend URL (e.g., `https://sagarsaathi-backend.onrender.com`).

## Phase 2: Deploy Frontend (Netlify)

1.  **Netlify Dashboard**: Go to your site settings.
2.  **Build Settings**:
    - **Base directory**: `frontend`
    - **Build command**: `npm install --legacy-peer-deps && npm run build`
    - **Publish directory**: `.next`
3.  **Environment Variables**:
    - Add `NEXT_PUBLIC_API_URL` = `YOUR_RENDER_BACKEND_URL`
    - Add `NEXT_PUBLIC_SOCKET_URL` = `YOUR_RENDER_BACKEND_URL`
4.  **Redeploy**: Trigger a new deploy.

## Verification

- Visit your Netlify URL.
- Try to **Register/Login**.
- If successful, your Frontend is talking to your Render Backend!
