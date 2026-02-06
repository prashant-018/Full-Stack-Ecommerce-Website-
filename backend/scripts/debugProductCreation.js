const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api';

const debugProductCreation = async () => {
  try {
    console.log('🔍 Debugging Product Creation...\n');

    // 1. Login as admin
    console.log('1️⃣ Logging in as admin...');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@ecommerce.com',
      password: 'admin123'
    });

    const adminToken = adminLogin.data.data.token;
    console.log('✅ Admin login successful');

    // 2. Try to create a simple product
    console.log('\n2️⃣ Attempting to create product...');

    const productData = {
      name: 'Debug Test Product',
      description: 'This is a test product for debugging',
      price: 99.99,
      originalPrice: 99.99,
      category: 'Men\'s T-Shirts',
      section: 'men',
      sizes: [{ size: 'M', stock: 10 }],
      colors: [{ name: 'Blue', hex: '#0000ff' }],
      images: [{ url: 'https://via.placeholder.com/400x500', alt: 'Test Product', isPrimary: true }],
      sku: `DEBUG-${Date.now()}`
    };

    console.log('📦 Product data:', JSON.stringify(productData, null, 2));

    try {
      const response = await axios.post(`${BASE_URL}/products`, productData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Product created successfully!');
      console.log('📦 Response:', JSON.stringify(response.data, null, 2));

    } catch (createError) {
      console.log('❌ Product creation failed');
      console.log('📄 Status:', createError.response?.status);
      console.log('📄 Status Text:', createError.response?.statusText);
      console.log('📄 Error Response:', JSON.stringify(createError.response?.data, null, 2));
      console.log('📄 Full Error:', createError.message);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
  }
};

debugProductCreation().catch(console.error);