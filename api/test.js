export default async function handler(req, res) {
  try {
    res.json({ 
      message: 'Test endpoint is working',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({ error: 'Test API failed' });
  }
}
