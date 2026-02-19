# CORS Configuration Fix for Vercel Deployment

## Problem
Your Vercel frontend (`https://full-stack-ecommerce-website-sandy.vercel.app`) is being blocked by CORS when trying to access your backend API.

## Solution

### Option 1: Set CORS_ORIGIN Environment Variable (Recommended)

1. Go to your **Render Dashboard** (or wherever your backend is hosted)
2. Navigate to your backend service
3. Go to **Environment** tab
4. Add or update the `CORS_ORIGIN` environment variable:

```
CORS_ORIGIN=https://full-stack-ecommerce-website-sandy.vercel.app
```

**For multiple domains** (if you have preview deployments):
```
CORS_ORIGIN=https://full-stack-ecommerce-website-sandy.vercel.app,https://your-other-domain.com
```

5. **Redeploy** your backend service

### Option 2: Automatic Vercel Support (Already Implemented)

The backend code has been updated to **automatically allow all Vercel domains** (any URL ending with `.vercel.app`). 

**You still need to redeploy your backend** for this change to take effect.

## Verify CORS is Working

1. After redeploying backend, test the API:
   ```bash
   curl -H "Origin: https://full-stack-ecommerce-website-sandy.vercel.app" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        https://full-stack-ecommerce-website-2-8vaf.onrender.com/api/products
   ```

2. You should see `Access-Control-Allow-Origin` header in the response

3. Visit your Vercel site and check browser console - CORS errors should be gone

## Current Backend Configuration

The backend now:
- ✅ Automatically allows all `.vercel.app` domains
- ✅ Respects `CORS_ORIGIN` environment variable for custom domains
- ✅ Allows credentials (cookies, auth headers)
- ✅ Supports all HTTP methods (GET, POST, PUT, DELETE, OPTIONS, PATCH)

## Quick Fix Steps

1. **Redeploy your backend** (Render will automatically use the updated code)
2. **Wait for deployment to complete** (usually 2-5 minutes)
3. **Test your Vercel site** - products should now load!

## Still Not Working?

1. Check backend logs for CORS errors
2. Verify backend is running: `https://full-stack-ecommerce-website-2-8vaf.onrender.com/api/health`
3. Check browser console for specific error messages
4. Verify `NODE_ENV=production` is set in backend environment variables


