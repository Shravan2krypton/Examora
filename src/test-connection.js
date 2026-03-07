// Test file to verify frontend-backend connection
import api from './services/api';

export async function testBackendConnection() {
  try {
    console.log('Testing backend connection...');
    console.log('API Base URL:', api.defaults.baseURL);
    
    const response = await api.get('/health');
    console.log('✅ Backend connection successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// Auto-test on import
testBackendConnection();
