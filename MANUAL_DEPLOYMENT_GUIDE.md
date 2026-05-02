# 🚀 Manual Deployment Guide

Your code has been pushed to GitHub. Now complete deployment manually:

---

## ✅ GitHub Status
- Repository: `https://github.com/glassmahn/iKAIZEN-onchain-agent`
- Branch: `main`
- Status: **Code pushed successfully**

---

## 🔴 STEP 1: Deploy Frontend to Vercel

### Option A: Via GitHub (Easiest - Recommended)

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Paste: `https://github.com/glassmahn/iKAIZEN-onchain-agent`
5. Click **"Continue"**
6. Select **"Root Directory"** → Choose `frontend/`
7. Click **"Deploy"**
8. ⏳ Wait 3-5 minutes for deployment

### Once Deployed:

9. After success, click **"Settings"** on the project
10. Click **"Environment Variables"**
11. Add these variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` |
| `NEXT_PUBLIC_AGENT_NFT_ADDRESS` | `0x1515d22b7Ea637D69c760C3986373FB976d96E8F` |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | `e3eb813*******b5d8c8c` |
| `NEXT_PUBLIC_0G_RPC_URL` | `https://evmrpc-testnet.0g.ai` |
| `NEXT_PUBLIC_AGENT_MARKET_ADDRESS` | `0x0000000000000000000000000000000000000000` |

12. Click **"Redeploy"** → **"Redeploy Now"** on the main branch
13. ✅ Frontend is live!

**Your Frontend URL:** Will be shown after deployment (e.g., `https://ikaizen-frontend-xxx.vercel.app`)

---

## 🔴 STEP 2: Deploy Backend to Render

### Setup:

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Connect account"** and authorize with GitHub
5. Find and select: `iKAIZEN-onchain-agent`
6. Click **"Connect"**

### Configuration:

7. Fill in the form:
   - **Name:** `ikaizen-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### Environment Variables:

8. Scroll down to **"Environment"**
9. Add these variables:
   - `PORT` = `3001`
   - `FRONTEND_URL` = `http://localhost:3000` (for now)
   - `NODE_ENV` = `production`

10. Click **"Create Web Service"**
11. ⏳ Wait 5-10 minutes for deployment
12. ✅ Backend is live!

**Your Backend URL:** Will be shown (e.g., `https://ikaizen-backend-xxxxx.onrender.com`)

---

## 🔴 STEP 3: Link Frontend & Backend

### Update API URL:

1. Copy your **Backend URL** from Render
2. Go back to **Vercel** dashboard
3. Select `ikaizen-frontend`
4. Go to **Settings** → **Environment Variables**
5. Edit `NEXT_PUBLIC_API_URL`
6. Change value to your **Backend URL** (e.g., `https://ikaizen-backend-xxxxx.onrender.com`)
7. Click **"Redeploy"** button on the **Deployments** tab
8. Click **"Redeploy Now"** on main branch

⏳ Wait 2-3 minutes for redeploy...

✅ Everything is now connected!

---

## 🔴 STEP 4: Verify Everything Works

### Test Frontend:

1. Open your Vercel URL: `https://ikaizen-frontend-xxx.vercel.app/dashboard`
2. Check:
   - ✅ Dashboard loads
   - ✅ Stats cards display
   - ✅ Price feed shows data
   - ✅ No console errors

### Test Backend:

1. Open: `https://your-backend-url.com/health`
2. Should see: `{"status":"ok","timestamp":"..."}`

### Test Full Feature:

1. Go to `/dashboard/mint`
2. Connect wallet
3. Fill agent name
4. Click mint
5. Should show success/error message

---

## 📋 Final Checklist

- [ ] Frontend deployed on Vercel
- [ ] Environment variables added to Vercel
- [ ] Backend deployed on Render
- [ ] Backend URL linked in Vercel env vars
- [ ] Frontend redeployed with correct API URL
- [ ] Frontend loads without errors
- [ ] Backend health check responds
- [ ] Mint function works end-to-end

---

## 🎉 Success!

Once all steps complete:
- **Frontend:** `https://ikaizen-frontend-xxx.vercel.app`
- **Backend:** `https://ikaizen-backend-xxxxx.onrender.com`

Share your Vercel URL with friends to test! 🚀

---

## ⚠️ Common Issues

### "Page not found" after Vercel deploy
- Solution: Make sure "Root Directory" is set to `frontend/` not root

### "Cannot connect to API" 
- Solution: Check `NEXT_PUBLIC_API_URL` env var is correct Render URL

### "Backend not responding"
- Solution: Check Render logs - may still be building
- Click "Manual Deploy" to retry

### "Permission denied" on GitHub
- Solution: Check GitHub token has `repo` scope
- Go to Settings → Developer settings → Personal access tokens

---

**Still need help? Let me know which step you're on!**
