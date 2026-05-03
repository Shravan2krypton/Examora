export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🚀 Testing login endpoint directly...');

    if (req.method === 'GET') {
      return res.json({
        status: '✅ Login Test Endpoint Working',
        method: req.method,
        url: req.url,
        message: 'This endpoint simulates /api/auth/login',
        test_post: 'Use POST with {email, password} to test login flow'
      });
    }

    if (req.method === 'POST') {
      const { email, password } = req.body;
      
      return res.json({
        status: '✅ Login POST Test Working',
        received: {
          email,
          password_provided: !!password
        },
        message: 'Login endpoint is receiving requests correctly',
        next_step: 'This confirms the routing works, backend authentication should work'
      });
    }

  } catch (error) {
    console.error('❌ Login test error:', error);
    res.status(500).json({ 
      error: 'Login test failed',
      details: error.message
    });
  }
}
