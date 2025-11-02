# Vercel Deployment Instructions

Your code is now on GitHub: **https://github.com/duliangkuan/Agent_test**

## Quick Deploy to Vercel

### Step 1: Go to Vercel
Visit: https://vercel.com/new

### Step 2: Import Repository
1. Click "Import" next to your GitHub repository
2. Or search for "duliangkuan/Agent_test"
3. Click "Import"

### Step 3: Configure (Usually Auto-detected)
The settings should be pre-filled, but verify:
- **Framework Preset**: `Vite`
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Deploy
Click the big **"Deploy"** button!

### Step 5: Wait for Build
- First build takes 2-3 minutes
- You'll get a live URL like: `https://your-app.vercel.app`

## After Deployment

### ⚠️ Important: Backend API

Your frontend will be deployed on Vercel, but **the backend API needs separate hosting**.

**Recommended**: Deploy backend to **Railway** (easiest):

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose "duliangkuan/Agent_test"
6. Railway will auto-detect Python
7. Add environment variable if needed:
   - `PORT` = `8000`
8. Deploy!

### Update Frontend to Use Backend URL

Once your backend is deployed, get its URL (e.g., `https://your-backend.railway.app`)

1. In Vercel dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `VITE_API_URL` = `https://your-backend.railway.app`
3. Redeploy your Vercel project

Or manually update `vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'https://your-backend.railway.app',
    changeOrigin: true,
  },
}
```

## Alternative Backend Hosting

### Render.com
1. https://render.com → New Web Service
2. Connect GitHub repo: duliangkuan/Agent_test
3. Settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Deploy

### Render.com (Alternative Start Command if above doesn't work)
```bash
python -m backend.run
```

## Verify Deployment

✅ Visit your Vercel URL
✅ All wizard steps should work
✅ Sample report should display
✅ Test the application

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Your GitHub: https://github.com/duliangkuan/Agent_test

## Quick Links

- **Frontend Deploy**: https://vercel.com/new
- **Backend Deploy**: https://railway.app
- **Repository**: https://github.com/duliangkuan/Agent_test

