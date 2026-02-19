# 🚀 Quick Fix - Products Not Loading on Vercel

## ⚡ 3-Step Fix

### Step 1: Set Environment Variable in Vercel (REQUIRED)

1. Go to: **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://full-stack-ecommerce-website-2-8vaf.onrender.com`
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application

### Step 2: Redeploy Backend (REQUIRED)

1. Go to your backend hosting (Render/Railway)
2. Trigger a **redeploy** (to apply CORS fixes)
3. Wait for deployment to complete

### Step 3: Test

1. Visit: `https://your-app.vercel.app/men`
2. Open browser console (F12)
3. You should see: `🌐 Production API URL: https://...`
4. Products should load!

## ✅ Verification

Check browser console for:
- ✅ `🌐 Production API URL: https://...` (not localhost)
- ✅ `✅ Environment variable loaded successfully`
- ✅ No CORS errors
- ✅ Products loading

## ❌ If Still Not Working

1. **Check Vercel Environment Variables**:
   - Verify `VITE_API_URL` is set
   - Value should NOT end with `/api`
   - Value should start with `https://`

2. **Check Backend**:
   - Visit: `https://full-stack-ecommerce-website-2-8vaf.onrender.com/api/health`
   - Should return JSON (not error)

3. **Check Browser Console**:
   - Look for specific error messages
   - Check Network tab for failed requests

4. **Enable Debug Panel**:
   - Add `VITE_DEBUG=true` to Vercel env vars
   - Redeploy
   - Click "🔍 API Debug" button in bottom-right

## 📞 Common Issues

| Error | Solution |
|-------|----------|
| `VITE_API_URL not set` | Set env var in Vercel |
| `CORS error` | Redeploy backend |
| `Network Error` | Check backend is running |
| `404 Not Found` | Verify API URL is correct |

---

**Full Guide**: See `DEPLOYMENT_GUIDE.md` for complete documentation.

