export default async function handler(req, res) {
  try {
    res.json({ 
      message: 'API is working',
      method: req.method,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({ error: 'Test API failed' });
  }
}
