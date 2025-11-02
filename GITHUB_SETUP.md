# Quick GitHub and Vercel Setup

Follow these steps to push your code to GitHub and deploy to Vercel.

## Step 1: Create GitHub Repository

Go to https://github.com/new and create a new repository, then run:

```bash
# IMPORTANT: Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values!

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Vercel

### Quick Deploy via Web:

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Import your repository
4. Settings:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**

That's it! Your frontend will be deployed.

### For Backend API:

The backend needs separate hosting. Recommended options:

**Railway (Easiest):**
1. https://railway.app → New Project → Deploy from GitHub
2. Select your repo → Railway auto-detects Python
3. Done!

**Render:**
1. https://render.com → New Web Service
2. Connect repo → Configure build command
3. Deploy

## Troubleshooting

If you need to push again:
```bash
git add .
git commit -m "Your commit message"
git push
```

