export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🚀 Simple test endpoint called');

    if (req.method === 'GET') {
      return res.json({
        status: '✅ Simple Test Working',
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        environment: {
          node_env: process.env.NODE_ENV || 'NOT SET',
          database_url: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
          jwt_secret: process.env.JWT_SECRET ? 'SET' : 'NOT SET'
        },
        headers: req.headers,
        message: 'Serverless function is working correctly'
      });
    }

    if (req.method === 'POST') {
      const body = req.body;
      return res.json({
        status: '✅ POST Test Working',
        method: req.method,
        body_received: body,
        timestamp: new Date().toISOString(),
        message: 'POST requests are working correctly'
      });
    }

  } catch (error) {
    console.error('❌ Simple test error:', error);
    res.status(500).json({ 
      error: 'Simple test failed',
      details: error.message,
      stack: error.stack
    });
  }
}
