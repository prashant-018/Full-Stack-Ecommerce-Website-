# 🍪 Session & Cookie Management Guide

## Overview

This implementation provides comprehensive session and cookie management for your MERN stack e-commerce application with:

- **Server-side sessions** with MongoDB persistence
- **Secure HTTP-only cookies** for authentication
- **Client-side cookie utilities** for preferences and cart
- **Automatic token refresh** mechanism
- **Session-based authentication** alongside JWT

---

## 🔧 **Backend Implementation**

### **1. Session Configuration**

```javascript
// Enhanced session with MongoDB store
const sessionConfig = {
  name: 'ecom.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiry on activity
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600,
    ttl: 24 * 60 * 60
  })
};
```

### **2. Cookie Utilities**

```javascript
const { setAuthCookie, clearAuthCookies } = require('../utils/cookieUtils');

// Set authentication cookie
setAuthCookie(res, token, maxAge);

// Clear all auth cookies
clearAuthCookies(res);
```

### **3. Session Management**

```javascript
const { initializeUserSession, clearUserSession } = require('../middleware/sessionManager');

// Initialize user session
initializeUserSession(req, user);

// Clear session on logout
clearUserSession(req, callback);
```

---

## 🎨 **Frontend Implementation**

### **1. Cookie Utilities**

```javascript
import { getCookie, setCookie, deleteCookie, getJSONCookie } from '../utils/cookieUtils';

// Basic cookie operations
setCookie('name', 'value', 7); // 7 days
const value = getCookie('name');
deleteCookie('name');

// JSON cookies
setJSONCookie('preferences', { theme: 'dark' });
const prefs = getJSONCookie('preferences');
```

### **2. Session Hook**

```javascript
import { useSessionContext } from '../contexts/SessionContext';

const MyComponent = () => {
  const { session, login, logout, updateUser } = useSessionContext();
  
  if (session.loading) return <div>Loading...</div>;
  
  if (!session.isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }
  
  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### **3. Authentication HOCs**

```javascript
import { withAuth, withAdminAuth } from '../contexts/SessionContext';

// Require authentication
const ProtectedComponent = withAuth(MyComponent);

// Require admin role
const AdminComponent = withAdminAuth(MyAdminComponent);
```

---

## 🔐 **Security Features**

### **1. Secure Cookies**

- **HttpOnly**: Prevents XSS attacks
- **Secure**: HTTPS only in production
- **SameSite**: CSRF protection
- **Domain**: Proper domain scoping

### **2. Session Security**

- **Rolling sessions**: Extend on activity
- **Secure storage**: MongoDB persistence
- **Automatic cleanup**: Expired session removal
- **Session validation**: Server-side checks

### **3. Token Management**

- **Access tokens**: Short-lived (24 hours)
- **Refresh tokens**: Long-lived (30 days)
- **Automatic refresh**: Background token renewal
- **Secure storage**: HTTP-only cookies

---

## 📊 **API Endpoints**

### **Authentication**

```bash
# Login with session
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password",
  "rememberMe": true
}

# Get session info
GET /api/auth/session

# Refresh token
POST /api/auth/refresh

# Logout (clears session & cookies)
POST /api/auth/logout
```

### **Session Management**

```bash
# Get current user with session
GET /api/auth/me

# Session will include:
{
  "session": {
    "isAuthenticated": true,
    "user": { "id": "...", "name": "...", "role": "..." },
    "sessionId": "sess_123...",
    "loginTime": "2024-01-01T00:00:00.000Z",
    "lastActivity": "2024-01-01T01:00:00.000Z"
  }
}
```

---

## 🛠 **Setup Instructions**

### **1. Install Dependencies**

```bash
# Backend
cd backend
npm install connect-mongo express-session cookie-parser

# Frontend (optional)
cd ../frontend
npm install js-cookie
```

### **2. Environment Variables**

```env
# Session & Cookie Configuration
SESSION_SECRET=your_super_secret_session_key
JWT_REFRESH_SECRET=your_refresh_token_secret
COOKIE_DOMAIN=.yourdomain.com
```

### **3. Update App.jsx**

```javascript
import { SessionProvider } from './contexts/SessionContext';

function App() {
  return (
    <SessionProvider>
      <Router>
        {/* Your app components */}
      </Router>
    </SessionProvider>
  );
}
```

---

## 🎯 **Use Cases**

### **1. User Authentication**

```javascript
// Login with session tracking
const handleLogin = async (credentials) => {
  const result = await login(credentials);
  if (result.success) {
    // Session automatically initialized
    // Cookies set securely
    // Redirect to dashboard
  }
};
```

### **2. Guest Cart Management**

```javascript
import { getGuestCart, setGuestCart } from '../utils/cookieUtils';

// Store guest cart in cookies
const addToGuestCart = (item) => {
  const cart = getGuestCart();
  cart.push(item);
  setGuestCart(cart);
};
```

### **3. User Preferences**

```javascript
import { getUserPreferences, setUserPreferences } from '../utils/cookieUtils';

// Save user preferences
const updateTheme = (theme) => {
  const prefs = getUserPreferences();
  setUserPreferences({ ...prefs, theme });
};
```

### **4. Admin Protection**

```javascript
// Protect admin routes
const AdminDashboard = withAdminAuth(() => {
  return <div>Admin Dashboard</div>;
});
```

---

## 🔄 **Session Lifecycle**

### **1. Login Flow**

1. User submits credentials
2. Server validates user
3. JWT tokens generated
4. Session initialized in MongoDB
5. Secure cookies set
6. Client receives user data

### **2. Request Flow**

1. Client sends request with cookies
2. Server validates session
3. Updates last activity
4. Processes request
5. Returns response

### **3. Logout Flow**

1. Client calls logout endpoint
2. Server destroys session
3. Cookies cleared
4. Client state reset
5. Redirect to login

---

## 🚀 **Production Considerations**

### **1. Security**

- Use HTTPS in production
- Set secure cookie flags
- Configure proper CORS
- Use strong session secrets
- Implement rate limiting

### **2. Performance**

- Use Redis for session store (high traffic)
- Configure session TTL appropriately
- Implement session cleanup
- Monitor session storage usage

### **3. Monitoring**

- Track session creation/destruction
- Monitor cookie usage
- Log authentication events
- Alert on security issues

---

## 🧪 **Testing**

### **1. Session Testing**

```javascript
// Test session creation
const response = await request(app)
  .post('/api/auth/login')
  .send({ email: 'test@example.com', password: 'password' })
  .expect(200);

expect(response.headers['set-cookie']).toBeDefined();
```

### **2. Cookie Testing**

```javascript
// Test cookie utilities
import { setCookie, getCookie } from '../utils/cookieUtils';

setCookie('test', 'value');
expect(getCookie('test')).toBe('value');
```

---

## 📝 **Best Practices**

1. **Always use HTTPS** in production
2. **Set appropriate cookie expiry** times
3. **Validate sessions** on sensitive operations
4. **Clear sessions** on logout
5. **Monitor session storage** usage
6. **Use secure cookie flags**
7. **Implement proper CORS**
8. **Handle token refresh** gracefully
9. **Store minimal data** in sessions
10. **Regular security audits**

---

This implementation provides a robust, secure, and scalable session and cookie management system for your e-commerce application! 🎉