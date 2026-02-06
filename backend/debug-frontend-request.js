const axios = require('axios');

// Debug test to capture the exact frontend request and response
const BASE_URL = 'http://localhost:5002/api';

async function debugFrontendRequest() {
  console.log('🔍 Debug Frontend Request - Real-time Test...\n');

  try {
    // Get a real product first
    const productsResponse = await axios.get(`${BASE_URL}/products?limit=1`);
    const testProduct = productsResponse.data.data.products[0];
    console.log(`✅ Using product: ${testProduct.name} (${testProduct._id})`);

    // Simulate the EXACT payload that PaymentOptions.jsx would send
    // Based on the frontend code structure
    const frontendPayload = {
      customerInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-0123'
      },
      items: [{
        productId: testProduct._id,
        product: testProduct._id,
        name: testProduct.name,
        price: testProduct.salePrice || testProduct.price,
        quantity: 1,
        size: 'M',
        color: 'Default',
        image: testProduct.images?.[0]?.url || '/placeholder-image.jpg'
      }],
      shippingAddress: {
        fullName: 'John Doe',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'India',
        phone: '555-0123'
      },
      paymentMethod: 'COD',
      paymentId: null,
      subtotal: testProduct.salePrice || testProduct.price,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: testProduct.salePrice || testProduct.price
    };

    console.log('📤 Sending request with payload:');
    console.log(JSON.stringify(frontendPayload, null, 2));

    console.log('\\n📤 Making POST request to /api/orders...');

    const response = await axios.post(`${BASE_URL}/orders`, frontendPayload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.status === 201) {
      console.log('\\n🎉 SUCCESS! Order created successfully!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }

  } catch (error) {
    console.error('\\n❌ REQUEST FAILED!');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);

    if (error.response) {
      console.error('\\n📋 Response Details:');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Headers:', error.response.headers);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));

      if (error.response.status === 400) {
        console.log('\\n🔍 400 Bad Request Analysis:');
        const data = error.response.data;

        if (data.errors && Array.isArray(data.errors)) {
          console.log('\\n❌ Validation Errors:');
          data.errors.forEach((err, index) => {
            console.log(`  ${index + 1}. Field: ${err.field}`);
            console.log(`     Message: ${err.message}`);
            console.log(`     Value: ${JSON.stringify(err.value)}`);
          });
        }

        if (data.message) {
          console.log('\\n❌ Error Message:', data.message);
        }

        console.log('\\n🔧 Suggested Fix:');
        console.log('Check the validation rules in the backend against the frontend payload structure.');
      }
    } else if (error.request) {
      console.error('\\n❌ No response received from server');
      console.error('Request details:', error.request);
    } else {
      console.error('\\n❌ Request setup error:', error.message);
    }
  }
}

// Run debug test
if (require.main === module) {
  debugFrontendRequest();
}

module.exports = { debugFrontendRequest };