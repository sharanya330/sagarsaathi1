# Remaining Setup Instructions

## 1. Render Dashboard Configuration
After pushing your code to GitHub and connecting it to Render, you must manually set the following environment variables in the Render Dashboard for your **Backend Service**:

| Variable Name | Value Description |
| :--- | :--- |
| `MONGODB_URI` | Your production MongoDB connection string (e.g., from MongoDB Atlas). |
| `JWT_SECRET` | A long, random string for securing user sessions. |
| `EMAIL_SERVICE` | `gmail` (or your preferred service). |
| `EMAIL_USER` | Your email address (e.g., `yourname@gmail.com`). |
| `EMAIL_PASS` | Your App Password (not your login password). |

> [!NOTE]
> The `PORT` variable is automatically handled by Render, but we've set it to `5000` in `render.yaml` just in case.

## 2. Local Development Setup
To run the project locally, you need to create `.env` files in both the `frontend` and `backend` directories.

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and fill in your local details:
```bash
cp backend/.env.example backend/.env
```
Then edit `backend/.env` to add your local MongoDB URI and Email credentials.

### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```
The default values in `.env.example` (`http://localhost:5000`) are usually correct for local development.

## 3. Deployment Verification
Once deployed:
1.  **Check Logs**: Look at the "Logs" tab in Render for both services to ensure they started without errors.
2.  **Test API**: Try to register or login to verify the backend is connected to MongoDB.
3.  **Test Frontend**: Navigate to your frontend URL and ensure it loads and can communicate with the backend.
