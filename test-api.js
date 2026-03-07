// Test API connection
import axios from 'axios';

async function testAPI() {
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend API is working:', response.data);
  } catch (error) {
    console.error('❌ Backend API error:', error.message);
  }
}

testAPI();
