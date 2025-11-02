# Deployment Guide

This guide will help you deploy the Agent Security Testing Platform to GitHub and Vercel.

## Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. Git installed on your machine

## Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - Repository name: `agent-security-test-platform` (or your preferred name)
   - Description: "Agent Security Testing Platform - A web platform for testing AI Agent security"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Push Code to GitHub

After creating the repository, GitHub will show you commands to push existing code. Run these commands:

```bash
# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (Vercel prefers main branch)
git branch -M main

# Push code to GitHub
git push -u origin main
```

**Important**: Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

Follow the prompts to complete deployment.

## Step 4: Backend Deployment (Important!)

**Note**: Vercel only deploys the frontend. You need to deploy the backend separately.

### Recommended Backend Hosting Options:

#### Option 1: Railway
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will auto-detect Python
7. Configure environment variables if needed
8. Deploy

#### Option 2: Render
1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy

#### Option 3: Your Own Server
```bash
# SSH to your server
cd /path/to/your/app
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# Install dependencies
pip install -r requirements.txt

# Run with production WSGI server
cd backend
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Step 5: Configure Frontend API Endpoint

After deploying the backend, update the frontend to use the production backend URL:

1. Create environment variable in Vercel:
   - In Vercel dashboard, go to your project
   - Settings → Environment Variables
   - Add `VITE_API_URL` = `https://your-backend-url.com`

2. Update `vite.config.ts` to use the environment variable:
```typescript
proxy: {
  '/api': {
    target: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    changeOrigin: true,
  },
}
```

3. Redeploy on Vercel

## Step 6: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the application:
   - Navigate through the wizard steps
   - View the sample test report
   - Try starting a test (ensure backend is running)

## Troubleshooting

### Build Fails on Vercel

- Check that all dependencies are in `package.json`
- Ensure `vercel.json` is configured correctly
- Check Vercel build logs for specific errors

### API Calls Fail

- Verify backend is deployed and running
- Check CORS configuration in `backend/main.py`
- Ensure API endpoint URLs are correct
- Check browser console for CORS errors

### Environment Variables Not Working

- Add variables in Vercel dashboard, not in code
- Restart deployment after adding variables
- Check that variable names match exactly

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:
- Push to `main` branch → Production deployment
- Open Pull Request → Preview deployment

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

