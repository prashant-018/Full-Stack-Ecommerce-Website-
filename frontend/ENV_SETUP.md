# Environment Variables Setup Guide

## Development (.env.development)

Create `EcommerecWeb/frontend/.env.development`:

```env
VITE_API_URL=http://localhost:5002
```

This file is used when running `npm run dev` locally.

## Production (Vercel)

**IMPORTANT**: Set this in Vercel Dashboard, NOT in a file.

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add:
   ```
   Name: VITE_API_URL
   Value: https://full-stack-ecommerce-website-2-8vaf.onrender.com
   ```

3. **DO NOT** include `/api` at the end - the config adds it automatically.

4. Select environments:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development (optional)

5. **Redeploy** after adding the variable.

## Verification

After deployment, check browser console:
```
🌐 Production API URL: https://full-stack-ecommerce-website-2-8vaf.onrender.com/api
```

If you see `VITE_API_URL from env: NOT SET`, the environment variable is not configured correctly.


