import { pool } from '../backend/config/database.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Test endpoint called');
    
    // Test database connection
    const dbResult = await pool.query('SELECT NOW() as current_time, COUNT(*) as user_count FROM users');
    
    res.json({ 
      message: 'Test endpoint is working',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        current_time: dbResult.rows[0].current_time,
        user_count: parseInt(dbResult.rows[0].user_count)
      }
    });
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({ 
      error: 'Test API failed',
      details: error.message,
      database: {
        connected: false
      }
    });
  }
}
