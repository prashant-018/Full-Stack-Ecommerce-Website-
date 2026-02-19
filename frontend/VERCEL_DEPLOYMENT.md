# Vercel Deployment Guide

## Problem Fixed
Products were not showing on Vercel because the frontend was trying to connect to `localhost:5002` which doesn't exist in production.

## Changes Made

### 1. Fixed API Configuration (`src/services/api.js`)
- Updated to use `VITE_API_URL` environment variable
- Falls back to localhost only in development
- Properly handles API URL with/without trailing slashes

### 2. Fixed Hardcoded URLs
Updated these files to use environment variables:
- `src/components/ManageProducts.jsx`
- `src/components/EditProduct.jsx`
- `src/pages/OrderSuccess.jsx`
- `src/components/Login-Sigin.jsx`

### 3. Vercel Configuration (`vercel.json`)
- Added SPA rewrite rules for React Router
- All routes now redirect to `index.html`

## Vercel Setup Instructions

### Step 1: Add Environment Variable
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://your-backend.onrender.com`)
   - **Environment**: Production, Preview, Development (select all)

### Step 2: Verify Build Settings
In Vercel project settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Deploy
1. Push your changes to GitHub
2. Vercel will automatically deploy
3. Or manually trigger a deployment from Vercel dashboard

## Environment Variable Format

```
VITE_API_URL=https://your-backend.onrender.com
```

**Important**: 
- Do NOT include `/api` at the end
- The code automatically appends `/api` to the base URL
- Use `https://` (not `http://`)

## Testing

After deployment:
1. Visit your Vercel URL
2. Check the Men's and Women's pages
3. Products should now load correctly
4. Check browser console for any API errors

## Troubleshooting

### Products still not showing?
1. Check browser console (F12) for errors
2. Verify `VITE_API_URL` is set correctly in Vercel
3. Ensure backend CORS allows your Vercel domain
4. Check backend is running and accessible

### CORS Errors?
Add your Vercel domain to backend CORS configuration:
```javascript
// In backend server.js
const corsOptions = {
  origin: [
    'http://localhost:5175',
    'https://your-app.vercel.app'
  ]
};
```


