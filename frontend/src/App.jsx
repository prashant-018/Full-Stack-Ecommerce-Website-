import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Category from './components/Category'
import EverLane from './components/EverLane'
import Footer from './components/Footer'
import About from './components/About'
import EverworldStories from './components/Everworld-Stories'
import Men from './components/Men'
import Women from './components/Women'
import Product from './components/Product'
import Cart from './components/Cart'
import ModernLogin from './components/ModernLogin'
import Checkout from './components/Checkout'
import MyOrders from './components/MyOrders'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './components/AdminDashboard'
import AddProduct from './components/AddProduct'
import ManageProducts from './components/ManageProducts'
import EditProduct from './components/EditProduct'
import AdminOrders from './components/AdminOrders'
import AdminUsers from './components/AdminUsers'
import ProductListing from './components/ProductListing'
import UserDashboard from './components/UserDashboard'
import UserProfile from './components/UserProfile'
import OrderSuccess from './pages/OrderSuccess'
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/ProtectedRoute'
import { getCart, addItemToCart } from './services/api'
import { AuthProvider } from './contexts/AuthContext'
import ApiDebugPanel from './components/ApiDebugPanel'

// Home Page Component
function HomePage() {
  return (
    <>
      <Hero />
      <div className="w-full h-10 sm:h-12 bg-white" />
      <Category />
      <EverLane />
    </>
  )
}

// App Content Component (to use useLocation inside Router)
function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const location = useLocation();

  // Load cart from MongoDB on mount
  useEffect(() => {
    loadCartFromDB();
  }, []);

  const loadCartFromDB = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // If not logged in, use local storage cart or empty array
      const localCart = localStorage.getItem('localCart');
      if (localCart) {
        try {
          setCartItems(JSON.parse(localCart));
        } catch (e) {
          console.error('Error parsing local cart:', e);
        }
      }
      return;
    }

    try {
      setLoadingCart(true);
      const response = await getCart();
      if (response.success && response.data.items) {
        // Transform API response to match frontend format
        const transformedItems = response.data.items.map(item => ({
          id: item.product._id || item.product.id,
          _id: item._id, // Cart item ID for updates/deletes
          name: item.product.name,
          price: item.product.originalPrice || item.product.price,
          salePrice: item.product.price || item.product.originalPrice,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          image: item.product.images?.[0]?.url || item.product.images?.[0] || item.product.image || '',
          discount: item.product.discountPercentage ? `${item.product.discountPercentage}% Off` : null
        }));
        setCartItems(transformedItems);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // If unauthorized, use local storage
      const localCart = localStorage.getItem('localCart');
      if (localCart) {
        try {
          setCartItems(JSON.parse(localCart));
        } catch (e) {
          console.error('Error parsing local cart:', e);
        }
      }
    } finally {
      setLoadingCart(false);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (product) => {
    const token = localStorage.getItem('authToken');
    const size = product.selectedSize;
    const color = product.selectedColor || (product.colors?.[0]?.name || 'Default');

    if (!size) {
      alert('Please select a size');
      return;
    }

    try {
      if (token) {
        // Save to MongoDB
        await addItemToCart(product.id || product._id, size, color, 1);
        // Reload cart from DB
        await loadCartFromDB();
      } else {
        // Use local storage for non-logged-in users
        const existingItem = cartItems.find(item =>
          item.id === product.id &&
          item.size === size &&
          item.color === color
        );

        let updatedItems;
        if (existingItem) {
          updatedItems = cartItems.map(item =>
            item.id === existingItem.id &&
              item.size === existingItem.size &&
              item.color === existingItem.color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          const primaryImage = product.images?.find(img => img.isPrimary);
          const imageUrl = primaryImage?.url ||
            product.images?.[0]?.url ||
            (typeof product.images?.[0] === 'string' ? product.images[0] : null) ||
            product.image || '';

          updatedItems = [...cartItems, {
            id: product.id || product._id,
            name: product.name,
            price: product.originalPrice || product.price,
            salePrice: product.price || product.originalPrice,
            size: size,
            color: color,
            image: imageUrl,
            quantity: 1,
            discount: product.discountPercentage ? `${product.discountPercentage}% Off` : null
          }];
        }
        setCartItems(updatedItems);
        localStorage.setItem('localCart', JSON.stringify(updatedItems));
      }
      openCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };

  // Check if current page is login or admin
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white">
      {/* Only show Navbar if not on login or admin page */}
      {!isLoginPage && !isAdminPage && <Navbar onCartClick={openCart} cartItemCount={cartItems.length} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/women" element={<Women />} />
        <Route path="/men" element={<Men />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<Product onAddToCart={addToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/everworld-stories" element={<EverworldStories />} />

        {/* Public Route - redirects authenticated users */}
        <Route path="/login" element={
          <PublicRoute>
            <ModernLogin />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />

        <Route path="/my-orders" element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        } />

        <Route path="/order-success/:orderId" element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />

        {/* Admin Routes - Protected with AdminRoute */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
      {/* Only show Footer if not on login or admin page */}
      {!isLoginPage && !isAdminPage && <Footer />}
      {/* Only show Cart if not on login or admin page */}
      {!isLoginPage && !isAdminPage && (
        <Cart
          isOpen={isCartOpen}
          onClose={closeCart}
          items={cartItems}
          setItems={setCartItems}
          onCartUpdate={loadCartFromDB}
        />
      )}
      
      {/* API Debug Panel (only in dev/debug mode) */}
      <ApiDebugPanel />
    </div>
  );
}

function App() {
  // Keep-alive ping to prevent Render backend from sleeping
  useEffect(() => {
    const BACKEND_URL = 'https://cafes-20-main-6.onrender.com';
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

    const pingBackend = async () => {
      try {
        await fetch(`${BACKEND_URL}/api/health`, {
          method: 'GET',
          mode: 'no-cors' // Avoid CORS issues for keep-alive ping
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.debug('Keep-alive ping failed:', error.message);
      }
    };

    // Initial ping
    pingBackend();

    // Set up interval for periodic pings
    const intervalId = setInterval(pingBackend, PING_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
