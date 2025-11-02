# Backend Deployment Guide

The frontend is deployed on Vercel, but the backend needs to be deployed separately.

## Quick Deploy to Railway (Recommended)

1. Go to https://railway.app and sign up/login

2. Click "New Project" → "Deploy from GitHub repo"

3. Select your repository: `duliangkuan/Agent_test`

4. Add Service:
   - Add a **Python** service
   - Railway will auto-detect it

5. Configure Settings:
   - **Root Directory**: `/backend`
   - **Start Command**: Leave empty (Railway will auto-detect) OR `python run.py`

6. Environment Variables:
   - Railway automatically sets `$PORT` variable
   - Add any other required env vars if needed

7. Get Your Backend URL:
   - Railway will provide a public URL like: `https://your-app.up.railway.app`
   - Copy this URL

## Update Frontend Configuration

After deploying the backend, you need to update your Vercel environment variables:

1. Go to Vercel Dashboard: https://vercel.com/duliangkuans-projects/agent-test-platform/settings/environment-variables

2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Railway backend URL (e.g., `https://your-app.up.railway.app`)

3. Redeploy the frontend:
   ```bash
   vercel --prod
   ```

## Alternative: Render.com

1. Go to https://render.com and sign up/login

2. New → Web Service

3. Connect your GitHub repo

4. Configure:
   - **Environment**: Python 3
   - **Build Command**: `cd backend && pip install -r ../requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Get the public URL and follow the same steps to update frontend

## Local Testing

To test locally with the deployed backend:

1. Start the backend locally:
   ```bash
   cd backend
   python run.py
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

The frontend is already configured to proxy `/api/*` requests to `http://localhost:8000`.

## Troubleshooting

### Backend not responding

1. Check Railway/Render logs for errors
2. Verify the `$PORT` environment variable is set
3. Check CORS configuration in `backend/main.py`

### CORS errors

The backend CORS is configured to allow:
- Local development: `localhost:3000`, `127.0.0.1:3000`
- Production: `agent-test-platform.vercel.app`
- Preview deployments: `*.vercel.app`

If you get CORS errors, add your domain to `backend/main.py`.

