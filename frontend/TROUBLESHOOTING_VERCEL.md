# Troubleshooting: Products Not Showing on Vercel

## Quick Checklist

### ✅ Step 1: Set Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `full-stack-ecommerce-website-sandy`
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://your-backend.onrender.com` or `https://your-backend.railway.app`)
   - **Environment**: Select **Production**, **Preview**, and **Development**
6. Click **Save**
7. **Redeploy** your application (go to Deployments → click the three dots → Redeploy)

### ✅ Step 2: Verify Backend is Running

1. Open your backend URL in a browser
2. Try accessing: `https://your-backend-url.com/api/products?section=men`
3. You should see JSON data with products
4. If you get an error, your backend is not accessible

### ✅ Step 3: Check Browser Console

1. Open your Vercel site: `https://full-stack-ecommerce-website-sandy.vercel.app/men`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for error messages:
   - ❌ `VITE_API_URL not set` → Environment variable not configured
   - ❌ `Network Error` → Backend is not accessible or CORS issue
   - ❌ `404 Not Found` → Wrong API URL
   - ❌ `CORS error` → Backend CORS not configured

### ✅ Step 4: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. Look for requests to `/api/products` or your backend URL
4. Check:
   - **Status**: Should be 200 (green), not 404/500 (red)
   - **Request URL**: Should point to your backend, not localhost
   - **Response**: Should contain product data

## Common Issues & Solutions

### Issue 1: "VITE_API_URL not set" Error

**Problem**: Environment variable not configured in Vercel

**Solution**:
1. Set `VITE_API_URL` in Vercel environment variables
2. Value should be your backend URL WITHOUT `/api` at the end
3. Example: `https://my-backend.onrender.com` (NOT `https://my-backend.onrender.com/api`)
4. Redeploy after setting

### Issue 2: Network Error / Cannot Connect

**Problem**: Backend is not accessible or URL is wrong

**Solution**:
1. Verify backend is running and accessible
2. Test backend URL directly in browser
3. Check if backend URL in Vercel is correct
4. Ensure backend URL uses `https://` not `http://`

### Issue 3: CORS Error

**Problem**: Backend CORS not allowing Vercel domain

**Solution**: Update backend CORS configuration:
```javascript
// In backend server.js
const corsOptions = {
  origin: [
    'http://localhost:5175',
    'https://full-stack-ecommerce-website-sandy.vercel.app',
    'https://*.vercel.app' // Allow all Vercel preview deployments
  ],
  credentials: true
};
```

### Issue 4: 404 Not Found

**Problem**: API endpoint doesn't exist or URL is wrong

**Solution**:
1. Check backend API routes are correct
2. Verify endpoint: `/api/products?section=men`
3. Test endpoint directly: `https://your-backend.com/api/products?section=men`

### Issue 5: Products Array is Empty

**Problem**: Backend returns empty array or wrong response structure

**Solution**:
1. Check backend database has products with `section: "men"` or `section: "women"`
2. Verify API response structure matches frontend expectations
3. Check browser console for API response logs

## Debugging Steps

### 1. Check Environment Variable

Add this to your component temporarily to debug:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Full API Base:', api.defaults.baseURL);
```

### 2. Test API Endpoint Directly

Open in browser:
```
https://your-backend-url.com/api/products?section=men
```

Should return JSON like:
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {...}
  }
}
```

### 3. Check Backend Logs

1. Go to your backend hosting (Render, Railway, etc.)
2. Check logs for incoming requests
3. Verify requests are reaching the backend

### 4. Verify Database

1. Check MongoDB has products
2. Verify products have `section: "men"` or `section: "women"`
3. Verify products have `isActive: true`

## Expected API Response Structure

The frontend expects one of these formats:

```javascript
// Format 1
{
  data: {
    products: [...]
  }
}

// Format 2
{
  products: [...]
}

// Format 3
[...] // Direct array
```

## Still Not Working?

1. **Check Vercel Build Logs**: Go to Deployments → Click on latest deployment → Check build logs
2. **Check Backend Logs**: Verify backend is receiving requests
3. **Test Locally**: Run `npm run build` and `npm run preview` to test production build locally
4. **Contact Support**: Share browser console errors and network tab screenshots

## Quick Test

After setting `VITE_API_URL` and redeploying:

1. Open: `https://full-stack-ecommerce-website-sandy.vercel.app/men`
2. Open browser console (F12)
3. You should see: `🌐 Using API URL: https://your-backend.com/api`
4. If you see `❌ VITE_API_URL not set`, the environment variable is not configured correctly

