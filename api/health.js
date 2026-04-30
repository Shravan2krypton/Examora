export default async function handler(req, res) {
  try {
    // Basic health check without database dependency
    res.json({
      status: 'OK',
      message: 'Serverless function is working',
      method: req.method,
      timestamp: new Date().toISOString(),
      headers: req.headers
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      error: 'Health check failed',
      details: error.message 
    });
  }
}
