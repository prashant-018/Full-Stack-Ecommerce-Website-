const axios = require('axios');

const testMenProductsAPI = async () => {
  try {
    console.log('🧪 Testing Men\'s Products API...\n');

    // Test 1: Get all men's products
    console.log('1. Testing GET /api/products?section=men');
    const response1 = await axios.get('http://localhost:5000/api/products?section=men&limit=10');

    if (response1.data.success) {
      const products = response1.data.data?.products || response1.data.products || [];
      console.log(`✅ Success: Found ${products.length} men's products`);

      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - ₹${product.price} (${product.sku})`);
      });
    } else {
      console.log('❌ Failed to fetch men\'s products');
    }

    // Test 2: Get a specific product by ID
    if (response1.data.success) {
      const products = response1.data.data?.products || response1.data.products || [];
      if (products.length > 0) {
        const firstProduct = products[0];
        console.log(`\n2. Testing GET /api/products/${firstProduct._id}`);

        const response2 = await axios.get(`http://localhost:5000/api/products/${firstProduct._id}`);

        if (response2.data.success) {
          const product = response2.data.product;
          console.log(`✅ Success: Retrieved product "${product.name}"`);
          console.log(`   Price: ₹${product.price}`);
          console.log(`   Category: ${product.category}`);
          console.log(`   Section: ${product.section}`);
          console.log(`   Material: ${product.material}`);
          console.log(`   Fit: ${product.fit}`);
          console.log(`   Sizes: ${product.sizes.map(s => s.size).join(', ')}`);
          console.log(`   Colors: ${product.colors.map(c => c.name).join(', ')}`);
        } else {
          console.log('❌ Failed to fetch specific product');
        }
      }
    }

    console.log('\n✅ API tests completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 5000');
      console.log('   Run: npm run dev');
    }
  }
};

testMenProductsAPI();