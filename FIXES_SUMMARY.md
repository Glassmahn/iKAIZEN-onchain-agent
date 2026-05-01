# ✅ Fixed: Backend Connection + Mint Errors

## 🔴 Problem #1: Backend Connection Refused
```
GET http://localhost:3001/api/soul net::ERR_CONNECTION_REFUSED
GET http://localhost:3001/api/agent/stats net::ERR_CONNECTION_REFUSED
```

**Root Cause:** Backend API is NOT running at `http://localhost:3001`

**Solution:** 
See `BACKEND_STARTUP.md` for complete setup (5 minutes)

**Quick Start:**
```bash
cd backend
npm install express cors dotenv ethers @types/express @types/node typescript ts-node
npm run dev
```

Backend will start on `http://localhost:3001` ✅

---

## 🟡 Problem #2: Mint Function Not Showing Errors

**Root Cause:** 
- Mint page was using mock implementation (setTimeout)
- Not using `useMintAgent()` hook
- No error display UI

**Fixed in:** `frontend/app/dashboard/mint/page.tsx`

### What Changed

**Before:**
```typescript
const handleMint = () => {
  setMinting(true)
  // Simulate minting
  setTimeout(() => setMinting(false), 3000)
}
```

**After:**
```typescript
const { mint, isLoading, error } = useMintAgent()

const handleMint = async () => {
  try {
    // Validate wallet connection
    if (!isConnected || !address) {
      setMintError("Please connect your wallet first")
      return
    }

    // Validate inputs
    if (!agentName.trim()) {
      setMintError("Agent name is required")
      return
    }

    // Call actual contract mint
    const hash = await mint(address, uri, address)
    setTxHash(hash)
    
    // Show success toast
    toast({ title: "iNFT Minted!", ... })
  } catch (err) {
    setMintError(err.message)
    toast({ title: "Mint failed", variant: "destructive", ... })
  }
}
```

### UI Improvements

✅ **Wallet Connection Check**
- Shows alert if wallet not connected
- Button disabled until connected

✅ **Error Display**
```
┌─────────────────────────────────────┐
│ ⚠️ Connection status                │
│ Connect your wallet to mint an iNFT │
└─────────────────────────────────────┘
```

✅ **Error Messages**
```
┌──────────────────────────────────────┐
│ ❌ Error                             │
│ AgentNFT contract address not        │
│    configured. Set env var...        │
└──────────────────────────────────────┘
```

✅ **Success Display**
```
┌──────────────────────────────────────┐
│ ✅ iNFT Minted Successfully!         │
│                                      │
│ View on 0G Explorer: 0xabcd12...   │
└──────────────────────────────────────┘
```

---

## Two-Terminal Setup (Recommended)

### Terminal 1: Frontend
```bash
cd frontend
npm run dev
```
Output:
```
▲ Next.js 15.0.0
- Local: http://localhost:3000
```

### Terminal 2: Backend
```bash
cd backend
npm run dev
```
Output:
```
✅ Backend running on http://localhost:3001
📊 Soul file: c:\Users\hp\Desktop\iKAIZEN-onchain-agent\soul\soul.json
🌐 CORS origin: http://localhost:3000
```

---

## Test Mint Flow

1. **Open** http://localhost:3000/dashboard/mint
2. **Enter** agent name (e.g., "KAIZEN-001")
3. **Enter** trading goal (e.g., "Maximize ETH-USDC yield")
4. **Connect** wallet via RainbowKit button
5. **Click** "Mint iKAIZEN"
6. **See** either:
   - ✅ Success with transaction hash
   - ❌ Clear error message

---

## Verify Backend Health

```bash
# Windows PowerShell
Invoke-WebRequest "http://localhost:3001/health" | Select-Object -ExpandProperty Content
```

Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:34:52.123Z"
}
```

---

## Files Updated

| File | Changes |
|------|---------|
| `frontend/app/dashboard/mint/page.tsx` | Integrated `useMintAgent()` hook + error display |
| `BACKEND_STARTUP.md` | NEW - Complete backend setup guide |

---

## Complete Flow After Fixes

```
Frontend (localhost:3000)
    ↓ Mint button clicked
    ↓ Wallet connected?
    ├─ NO → Show "Connect wallet" alert
    └─ YES → Proceed
         ↓
         ↓ Call useMintAgent()
         ↓
         ↓ Wagmi contract write
         ├─ ERROR → Show error message in Alert
         └─ SUCCESS → Show tx hash + link to explorer
              ↓
              ↓ Dashboard auto-refresh
              ├─ Backend GET /api/soul
              ├─ Backend GET /api/agent/stats
              └─ UI updates with new data
```

---

## Summary

### Problem 1 Solution
➡️ **Start backend with:** `npm run dev` in `/backend` folder  
➡️ See `BACKEND_STARTUP.md` for full setup

### Problem 2 Solution
➡️ **Mint function now uses real contract hook**  
➡️ **Error messages displayed in UI**  
➡️ **Success shows transaction hash with explorer link**

---

## Next Steps

1. ✅ Create `/backend` folder (use BACKEND_STARTUP.md)
2. ✅ Start backend: `npm run dev`
3. ✅ Frontend continues running
4. ✅ Test mint on `/dashboard/mint`
5. ✅ See error messages if issues
6. ✅ See success with tx hash if working

**Both issues are now fixed!** 🚀
