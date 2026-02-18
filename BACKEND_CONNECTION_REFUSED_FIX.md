# Backend Connection Refused - Complete Fix Guide

## Error: `net::ERR_CONNECTION_REFUSED`

### What This Means
- Your frontend is trying to connect to `http://localhost:5002`
- But **NO server is listening** on that port
- The backend server is **NOT running**

---

## Quick Diagnosis

### 1. Check if Backend is Running
```bash
# Windows
netstat -ano | findstr :5002

# Mac/Linux
lsof -i :5002

# If you see output → Server is running
# If you see nothing → Server is NOT running (this is your issue!)
```

### 2. Check if MongoDB is Running
```bash
# Windows
net start | findstr MongoDB

# Mac/Linux
ps aux | grep mongod

# Or try connecting
mongosh
# or
mongo
```

---

## Root Causes & Solutions

### Cause 1: Server Not Started ⭐ MOST COMMON

**Problem:** You haven't started the backend server

**Solution:**
```bash
cd EcommerecWeb/backend
npm start
# or
node server.js
# or
nodemon server.js
```

**Expected Output:**
```
✅ Connected to MongoDB
📊 Database: ecommerce
🔗 Host: localhost:27017
🚀 Server running on port 5002
📍 Environment: development
🌐 API URL: http://localhost:5002/api
```

---

### Cause 2: MongoDB Not Running

**Problem:** MongoDB is not installed or not running

**Check MongoDB Status:**
```bash
# Windows - Check if MongoDB service is running
sc query MongoDB

# Start MongoDB service (Windows)
net start MongoDB

# Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

**If MongoDB is not installed:**
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Edition
3. Start the service

**Alternative - Use MongoDB Atlas (Cloud):**
```env
# In .env file, uncomment this line:
MONGODB_URI=mongodb+srv://prashant089:prashant089@completecoding.ysiqcy9.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CompleteCoding
```

---

### Cause 3: Port Already in Use

**Problem:** Another process is using port 5002

**Check:**
```bash
# Windows
netstat -ano | findstr :5002

# Mac/Linux
lsof -i :5002
```

**Solution:**
```bash
# Kill the process (Windows)
taskkill /PID <PID_NUMBER> /F

# Kill the process (Mac/Linux)
kill -9 <PID_NUMBER>

# Or change port in .env
PORT=5003
```

---

### Cause 4: Missing Dependencies

**Problem:** npm packages not installed

**Solution:**
```bash
cd EcommerecWeb/backend
npm install
```

---

### Cause 5: Server Crashes on Startup

**Problem:** Server starts but immediately crashes

**Debug:**
```bash
cd EcommerecWeb/backend
node server.js
# Watch for error messages
```

**Common Crash Reasons:**

1. **Missing .env file**
   ```bash
   # Create .env if missing
   cp .env.example .env
   ```

2. **Invalid MongoDB URI**
   ```env
   # Use local MongoDB
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   ```

3. **Missing required environment variables**
   ```env
   PORT=5002
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_secret_key_here
   SESSION_SECRET=your_session_secret_here
   ```

---

## Step-by-Step Fix Process

### Step 1: Verify MongoDB is Running

```bash
# Try to connect to MongoDB
mongosh
# or
mongo

# If it connects, MongoDB is running ✅
# If it fails, start MongoDB:

# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 2: Install Dependencies

```bash
cd EcommerecWeb/backend
npm install
```

### Step 3: Check .env Configuration

Your `.env` file should have:
```env
NODE_ENV=development
PORT=5002
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_super_secret_session_key_here
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Step 4: Start the Server

```bash
cd EcommerecWeb/backend
npm start
```

**Watch for:**
- ✅ "Connected to MongoDB" - Good!
- ✅ "Server running on port 5002" - Good!
- ❌ Any error messages - Fix them!

### Step 5: Test the Server

**Open a new terminal:**
```bash
# Test health endpoint
curl http://localhost:5002/api/health

# Or open in browser:
# http://localhost:5002/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running and MongoDB is connected!",
  "database": {
    "status": "connected",
    "connected": true
  }
}
```

---

## Production-Ready server.js Setup

Your current `server.js` is already well-configured! It includes:

✅ Proper error handling
✅ MongoDB connection with fallback
✅ Health check endpoints
✅ CORS configuration
✅ Rate limiting
✅ Security headers
✅ Session management
✅ Graceful shutdown

**Key Features:**
1. Tries MongoDB Atlas first, falls back to local
2. Exits gracefully if MongoDB fails
3. Provides detailed connection status
4. Health check at `/api/health`
5. DB status at `/api/db/status`

---

## Debugging Commands

### 1. Check Server Status
```bash
# Is server running?
curl http://localhost:5002/api/health

# Check MongoDB status
curl http://localhost:5002/api/db/status
```

### 2. Check Logs
```bash
cd EcommerecWeb/backend
npm start
# Watch console output for errors
```

### 3. Test MongoDB Connection
```bash
# Connect to MongoDB directly
mongosh
# or
mongo

# List databases
show dbs

# Use your database
use ecommerce

# List collections
show collections
```

### 4. Check Port Availability
```bash
# Windows
netstat -ano | findstr :5002

# Mac/Linux
lsof -i :5002

# No output = Port is free ✅
# Output = Port is in use ❌
```

---

## Common Error Messages & Fixes

### Error: "EADDRINUSE: address already in use"
**Fix:** Port 5002 is already in use
```bash
# Kill the process or change port
PORT=5003 npm start
```

### Error: "MongooseServerSelectionError"
**Fix:** MongoDB is not running
```bash
# Start MongoDB
net start MongoDB  # Windows
brew services start mongodb-community  # Mac
```

### Error: "Cannot find module"
**Fix:** Missing dependencies
```bash
npm install
```

### Error: "JWT_SECRET is not defined"
**Fix:** Missing environment variables
```bash
# Check .env file exists and has required variables
cat .env  # Mac/Linux
type .env  # Windows
```

---

## Quick Start Checklist

- [ ] MongoDB is installed and running
- [ ] `.env` file exists with correct values
- [ ] Dependencies installed (`npm install`)
- [ ] Port 5002 is available
- [ ] Backend server started (`npm start`)
- [ ] Health check passes (`curl http://localhost:5002/api/health`)
- [ ] Frontend configured to use `http://localhost:5002`

---

## Testing the Fix

### 1. Start Backend
```bash
cd EcommerecWeb/backend
npm start
```

### 2. Verify in Browser
Open: `http://localhost:5002/api/health`

Should see:
```json
{
  "success": true,
  "message": "Server is running and MongoDB is connected!"
}
```

### 3. Test Login from Frontend
```bash
cd EcommerecWeb/frontend
npm run dev
```

Try to login - should work now!

---

## Prevention Tips

1. **Always start backend before frontend**
   ```bash
   # Terminal 1
   cd backend && npm start
   
   # Terminal 2
   cd frontend && npm run dev
   ```

2. **Use nodemon for auto-restart**
   ```bash
   npm install -g nodemon
   nodemon server.js
   ```

3. **Create start script**
   ```json
   // package.json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

4. **Check MongoDB before starting**
   ```bash
   # Add to your startup routine
   net start MongoDB  # Windows
   ```

---

## Summary

**ERR_CONNECTION_REFUSED means:**
- Backend server is NOT running
- Nothing is listening on port 5002

**To fix:**
1. Start MongoDB
2. Start backend server (`npm start`)
3. Verify with health check
4. Then start frontend

**Your server.js is already production-ready!** Just need to start it properly.
