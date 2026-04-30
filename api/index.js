export default async function handler(req, res) {
  try {
    // Basic API handler test
    res.json({
      message: 'Main API handler is working',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
