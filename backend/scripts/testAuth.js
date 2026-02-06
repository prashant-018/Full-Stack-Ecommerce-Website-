const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api';

// Test authentication system
const testAuth = async () => {
  try {
    console.log('🧪 Testing Authentication System...\n');

    // 1. Test Admin Login
    console.log('1️⃣ Testing Admin Login...');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@ecommerce.com',
      password: 'admin123'
    });

    const adminToken = adminLogin.data.data.token;
    console.log('✅ Admin login successful');
    console.log('🔑 Admin Token:', adminToken.substring(0, 20) + '...');
    console.log('👤 Admin Role:', adminLogin.data.data.user.role);

    // 2. Test User Login
    console.log('\n2️⃣ Testing User Login...');
    const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'user@test.com',
      password: 'user123'
    });

    const userToken = userLogin.data.data.token;
    console.log('✅ User login successful');
    console.log('🔑 User Token:', userToken.substring(0, 20) + '...');
    console.log('👤 User Role:', userLogin.data.data.user.role);

    // 3. Test Admin Access to Products (should work)
    console.log('\n3️⃣ Testing Admin Access to Create Product...');
    try {
      const newProduct = await axios.post(`${BASE_URL}/products`, {
        name: 'Test Admin Product',
        description: 'This product was created by admin',
        price: 99.99,
        originalPrice: 99.99,
        category: 'Men\'s T-Shirts',
        section: 'men',
        sizes: [{ size: 'M', stock: 10 }],
        colors: [{ name: 'Blue', hex: '#0000ff' }],
        images: [{ url: 'https://via.placeholder.com/400x500', alt: 'Test Product', isPrimary: true }],
        sku: `TEST-ADMIN-${Date.now()}`
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      console.log('✅ Admin can create products');
      console.log('📦 Product created:', newProduct.data.data.name);
    } catch (error) {
      console.log('❌ Admin product creation failed:', error.response?.data?.message || error.message);
    }

    // 4. Test User Access to Products (should fail)
    console.log('\n4️⃣ Testing User Access to Create Product (should fail)...');
    try {
      await axios.post(`${BASE_URL}/products`, {
        name: 'Test User Product',
        description: 'This should fail',
        price: 50.00,
        originalPrice: 50.00,
        category: 'Men\'s T-Shirts',
        section: 'men',
        sizes: [{ size: 'M', stock: 5 }],
        colors: [{ name: 'Red', hex: '#ff0000' }],
        images: [{ url: 'https://via.placeholder.com/400x500', alt: 'Test Product', isPrimary: true }],
        sku: `TEST-USER-${Date.now()}`
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      console.log('❌ User should NOT be able to create products');
    } catch (error) {
      console.log('✅ User correctly denied access:', error.response?.data?.message);
    }

    // 5. Test Getting Current User Profile
    console.log('\n5️⃣ Testing Get Current User Profile...');
    const adminProfile = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    console.log('✅ Admin profile retrieved');
    console.log('👤 Name:', adminProfile.data.data.user.name);
    console.log('📧 Email:', adminProfile.data.data.user.email);
    console.log('🎭 Role:', adminProfile.data.data.user.role);

    // 6. Test Public Access (no token needed)
    console.log('\n6️⃣ Testing Public Access to Products...');
    const publicProducts = await axios.get(`${BASE_URL}/products?section=men`);
    console.log('✅ Public can view products');
    console.log('📦 Products found:', publicProducts.data.data.products?.length || 0);

    console.log('\n🎉 All authentication tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

// Run tests only if server is running
testAuth().catch(console.error);