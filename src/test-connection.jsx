import { useEffect } from 'react';
import axios from 'axios';

function TestConnection() {
  useEffect(() => {
    async function testAPI() {
      try {
        const response = await axios.get('/api/health');
        console.log('✅ Frontend can connect to backend:', response.data);
        alert('✅ Connection successful! Backend says: ' + JSON.stringify(response.data));
      } catch (error) {
        console.error('❌ Frontend cannot connect to backend:', error);
        alert('❌ Connection failed: ' + error.message);
      }
    }
    
    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Frontend-Backend Connection Test</h1>
      <p>Check the console and alert for connection status...</p>
      <button onClick={() => window.location.href = '/'}>Go to Home</button>
    </div>
  );
}

export default TestConnection;
