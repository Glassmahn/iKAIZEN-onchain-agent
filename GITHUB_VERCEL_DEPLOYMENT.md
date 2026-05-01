# 🚀 GitHub & Vercel Deployment Guide

## Step 1: Initialize Git & Push to GitHub

### 1.1 Set Up Git Locally

```bash
cd c:\Users\hp\Desktop\iKAIZEN-onchain-agent

# Initialize git repo
git init

# Add remote origin (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/iKAIZEN-onchain-agent.git
```

### 1.2 Stage & Commit

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: iKAIZEN frontend + backend"
```

### 1.3 Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

**Expected output:**
```
Enumerating objects: ...
Counting objects: 100% ...
...
Branch 'main' set up to track remote 'origin/main'.
```

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Deploy from Root

```bash
# From project root
cd c:\Users\hp\Desktop\iKAIZEN-onchain-agent

# Deploy
vercel
```

**Follow prompts:**
- `? Set up and deploy "c:\Users\hp\Desktop\iKAIZEN-onchain-agent"?` → Yes
- `? Which scope do you want to deploy to?` → Select your account
- `? Link to existing project?` → No (first deploy)
- `? What's your project's name?` → `ikaizen-frontend`
- `? In which directory is your code located?` → `frontend/`
- `? Want to modify these settings?` → No

### 2.3 Environment Variables on Vercel

After first deploy, add env vars:

```bash
# Add each env variable to Vercel
vercel env add NEXT_PUBLIC_API_URL
# Enter value: https://your-backend-url.com (or keep localhost for testing)

vercel env add NEXT_PUBLIC_AGENT_NFT_ADDRESS
# Enter value: 0x1515d22b7Ea637D69c760C3986373FB976d96E8F

vercel env add NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
# Enter value: e3eb813c63b8122bc2158ec0eb5d8c8c

vercel env add NEXT_PUBLIC_0G_RPC_URL
# Enter value: https://evmrpc-testnet.0g.ai
```

Or add via Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Settings → Environment Variables
4. Add each variable

### 2.4 Redeploy with Env Vars

```bash
vercel --prod
```

---

## Step 3: Deploy Backend

### Option A: Render (Recommended for Node.js)

1. **Push code to GitHub** (already done above)

2. **Go to [render.com](https://render.com)**

3. **Create New → Web Service**
   - Connect GitHub repo
   - Select branch: `main`
   - Build command: `cd backend && npm install && npm run build`
   - Start command: `cd backend && npm start`
   - Environment: `Node`

4. **Add Environment Variables**
   - `PORT`: `3001`
   - `FRONTEND_URL`: `https://your-vercel-url.vercel.app`
   - `NODE_ENV`: `production`

5. **Deploy**

---

### Option B: Railway (Simpler)

1. **Go to [railway.app](https://railway.app)**

2. **New Project → Deploy from GitHub**
   - Select your repo
   - Select branch: `main`

3. **Add Service**
   - Railway will auto-detect Node.js
   - Configure start command: `cd backend && npm start`

4. **Add Variables**
   - `PORT`: `3001`
   - `FRONTEND_URL`: `https://your-vercel-url.vercel.app`

5. **Deploy**

---

### Option C: Heroku (Legacy but still works)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create ikaizen-backend

# Set environment variables
heroku config:set FRONTEND_URL=https://your-vercel-url.vercel.app

# Deploy
git push heroku main
```

---

## Step 4: Update Frontend API URL

Once backend is deployed, update `NEXT_PUBLIC_API_URL` in Vercel:

1. Go to Vercel Dashboard
2. Select `ikaizen-frontend` project
3. Settings → Environment Variables
4. Edit `NEXT_PUBLIC_API_URL`
5. Change from `http://localhost:3001` to production URL:
   - **Render**: `https://your-app.onrender.com`
   - **Railway**: `https://your-app.railway.app`
   - **Heroku**: `https://ikaizen-backend.herokuapp.com`
6. Click Redeploy on main branch

---

## Step 5: Verify Deployment

### Frontend
```bash
# Test frontend
curl https://your-project.vercel.app/dashboard
```

Expected: HTML response with dashboard content

### Backend
```bash
# Test backend health check
curl https://your-backend-url.com/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2026-05-01T10:00:00.000Z"
}
```

### API Endpoints
```bash
# Test API
curl https://your-backend-url.com/api/soul
```

Expected: JSON with soul data

---

## Step 6: Database Setup (Important!)

### For Production Backend

The current setup uses `soul.json` (file-based). For production, migrate to a database:

### PostgreSQL (Recommended)

1. **Get connection string from provider:**
   - Railway: Auto-provided
   - Render: Included with database add-on
   - Neon: Free tier at [neon.tech](https://neon.tech)

2. **Update backend to use database**

### MongoDB

1. **Get cluster URL from [mongodb.com](https://mongodb.com)**
2. **Update connection in backend**
3. **Add to environment variables**

---

## Troubleshooting

### "Build failed" on Vercel

**Solution:**
```bash
# Verify local build works
cd frontend
npm run build

# Check for TypeScript errors
npm run lint
```

### "Cannot find module" on backend

**Solution:**
```bash
cd backend
npm install
npm run build
```

### API calls from frontend fail

**Check:**
1. ✅ Backend is running
2. ✅ `NEXT_PUBLIC_API_URL` is correct in Vercel env
3. ✅ CORS is configured in backend
4. ✅ No typos in URL

**Fix CORS if needed:**
```typescript
// backend/src/server.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

### "Port already in use"

**For local testing:**
```bash
# Kill process on port 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] Frontend deployed successfully
- [ ] Backend deployed on hosting platform
- [ ] CORS configured for production URLs
- [ ] API URL updated in Vercel env vars
- [ ] All endpoints tested (health, soul, stats)
- [ ] Wallet connection works on deployed frontend
- [ ] Mint function works on deployed frontend
- [ ] Activity feed shows data
- [ ] Dashboard displays live prices

---

## Production URLs Reference

| Service | URL Format |
|---------|-----------|
| **Vercel Frontend** | `https://your-project.vercel.app` |
| **Render Backend** | `https://your-app.onrender.com` |
| **Railway Backend** | `https://your-app.railway.app` |
| **Heroku Backend** | `https://ikaizen-backend.herokuapp.com` |

---

## Git Workflow for Future Updates

```bash
# Make changes locally
git add .
git commit -m "Feature: description"

# Push to GitHub
git push origin main

# Vercel auto-deploys from main branch
# (check Vercel dashboard for deployment status)

# Backend manual redeploy
# (depends on hosting platform)
```

---

## Quick Reference Commands

```bash
# Git
git status
git log
git pull origin main

# Vercel
vercel --prod          # Deploy to production
vercel --inspect       # Check deployment
vercel logs            # View logs

# Heroku (if using)
heroku logs --tail
heroku config:get
```

---

**Once deployed, share your Vercel URL with friends to test!** 🚀
