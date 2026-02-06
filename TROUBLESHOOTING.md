# Troubleshooting Guide

## Issue: "localhost:5175 says Order deleted successfully" Error

This error occurs when there's a communication issue between the frontend (Vite dev server on port 5175) and the backend (Express server on port 5002).

### ✅ **Solutions Applied:**

### 1. **Vite Proxy Configuration**
Updated `vite.config.js` to proxy API calls:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### 2. **API Service Configuration**
Updated `src/services/api.js` to use relative URLs in development:
```javascript
const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : 'http://localhost:5002/api',
  // ...
});
```

### 3. **Admin API Functions**
Added dedicated admin API functions:
- `getAdminOrders(params)`
- `getOrderStats()`
- `updateOrderStatus(orderId, updateData)`
- `deleteOrder(orderId)`

### 4. **Updated AdminOrders Component**
Replaced direct axios calls with the new API functions for better error handling and consistency.

## 🔧 **How to Fix:**

### Step 1: Restart Both Servers
```bash
# Terminal 1 - Backend
cd EcommerecWeb/backend
npm run dev

# Terminal 2 - Frontend  
cd EcommerecWeb/frontend
npm run dev
```

### Step 2: Test Backend API
```bash
cd EcommerecWeb/backend
npm run test:admin:api
```

### Step 3: Verify Admin User
```bash
cd EcommerecWeb/backend
npm run test:admin
```

### Step 4: Check Browser Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try deleting an order
4. Check if requests go to `/api/admin/orders/{id}` (not full URL)

## 🐛 **Common Issues & Solutions:**

### Issue 1: CORS Errors
**Symptoms:** 
- "Access to XMLHttpRequest blocked by CORS policy"
- Network errors in browser console

**Solution:**
- Ensure Vite proxy is configured correctly
- Restart both frontend and backend servers
- Check backend CORS configuration in `server.js`

### Issue 2: Authentication Errors
**Symptoms:**
- 401 Unauthorized errors
- Redirected to login page

**Solution:**
```bash
# Check if admin user exists
npm run test:admin

# Create admin user if missing
npm run seed:admin
```

### Issue 3: Network Timeout
**Symptoms:**
- Requests taking too long
- Timeout errors

**Solution:**
- Check if backend server is running on port 5002
- Verify MongoDB connection
- Check server logs for errors

### Issue 4: Order Not Found
**Symptoms:**
- 404 errors when deleting orders
- "Order not found" messages

**Solution:**
- Refresh the orders list
- Check if order ID is valid
- Verify order exists in database

## 📋 **Verification Steps:**

### 1. Check Server Status
```bash
# Backend health check
curl http://localhost:5002/api/health

# Should return: {"success": true, "message": "Server is running..."}
```

### 2. Test Admin Login
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"prashant123"}'
```

### 3. Test Admin Orders Endpoint
```bash
# Replace {TOKEN} with actual token from login
curl -H "Authorization: Bearer {TOKEN}" \
  http://localhost:5002/api/admin/orders
```

### 4. Check Frontend Proxy
- Open http://localhost:5175/api/health in browser
- Should show backend health status (proxied through Vite)

## 🚀 **Best Practices:**

### 1. Always Use API Functions
```javascript
// ✅ Good
import { deleteOrder } from '../services/api';
const result = await deleteOrder(orderId);

// ❌ Avoid
const result = await api.delete(`/admin/orders/${orderId}`);
```

### 2. Proper Error Handling
```javascript
try {
  const result = await deleteOrder(orderId);
  if (result.success) {
    // Handle success
  } else {
    // Handle API error
    alert(result.message);
  }
} catch (error) {
  // Handle network/unexpected errors
  console.error('Error:', error);
  alert('Network error. Please try again.');
}
```

### 3. Check Authentication
```javascript
const token = localStorage.getItem('authToken');
if (!token) {
  navigate('/login');
  return;
}
```

## 📞 **Still Having Issues?**

1. **Check Console Logs:**
   - Browser DevTools Console
   - Backend server terminal
   - Network tab in DevTools

2. **Verify Environment:**
   - Node.js version (should be 16+)
   - MongoDB running
   - All dependencies installed

3. **Reset Everything:**
   ```bash
   # Backend
   cd EcommerecWeb/backend
   rm -rf node_modules
   npm install
   npm run dev

   # Frontend  
   cd EcommerecWeb/frontend
   rm -rf node_modules
   npm install
   npm run dev
   ```

4. **Test with Postman/curl:**
   - Test API endpoints directly
   - Verify authentication works
   - Check response formats