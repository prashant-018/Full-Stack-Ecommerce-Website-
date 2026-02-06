const axios = require('axios');

const testAPIEndpoint = async () => {
  try {
    console.log('🧪 Testing actual API endpoint...\n');

    const baseURL = 'http://localhost:5000';

    // Test 1: Get all products
    console.log('1️⃣ Testing GET /api/products (all products)...');
    try {
      const response1 = await axios.get(`${baseURL}/api/products`);
      console.log(`   Status: ${response1.status}`);
      console.log(`   Total products: ${response1.data.data.products.length}`);
      console.log(`   Pagination: ${JSON.stringify(response1.data.data.pagination)}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }

    // Test 2: Get women products
    console.log('\n2️⃣ Testing GET /api/products?section=women...');
    try {
      const response2 = await axios.get(`${baseURL}/api/products?section=women`);
      console.log(`   Status: ${response2.status}`);
      console.log(`   Women products: ${response2.data.data.products.length}`);
      console.log(`   Pagination: ${JSON.stringify(response2.data.data.pagination)}`);

      if (response2.data.data.products.length > 0) {
        console.log('   Sample products:');
        response2.data.data.products.slice(0, 3).forEach(product => {
          console.log(`   - ${product.name} (section: "${product.section}")`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }

    // Test 3: Get men products
    console.log('\n3️⃣ Testing GET /api/products?section=men...');
    try {
      const response3 = await axios.get(`${baseURL}/api/products?section=men`);
      console.log(`   Status: ${response3.status}`);
      console.log(`   Men products: ${response3.data.data.products.length}`);
      console.log(`   Pagination: ${JSON.stringify(response3.data.pagination)}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }

    // Test 4: Test with higher limit
    console.log('\n4️⃣ Testing GET /api/products?section=women&limit=100...');
    try {
      const response4 = await axios.get(`${baseURL}/api/products?section=women&limit=100`);
      console.log(`   Status: ${response4.status}`);
      console.log(`   Women products (limit 100): ${response4.data.data.products.length}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }

    // Test 5: Test case variations
    console.log('\n5️⃣ Testing case variations...');
    const variations = ['Women', 'WOMEN', 'women'];

    for (const variation of variations) {
      try {
        const response = await axios.get(`${baseURL}/api/products?section=${variation}&limit=100`);
        console.log(`   section=${variation}: ${response.data.data.products.length} products`);
      } catch (error) {
        console.log(`   section=${variation}: ❌ Error - ${error.response?.data?.message || error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

// Check if axios is available
try {
  testAPIEndpoint();
} catch (error) {
  console.log('❌ axios not available. Please install it with: npm install axios');
  console.log('Or test manually with curl:');
  console.log('curl "http://localhost:5000/api/products?section=women&limit=100"');
}