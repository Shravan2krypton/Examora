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
    console.log('Health check endpoint called');
    
    // Test database connection
    const dbResult = await pool.query('SELECT NOW() as current_time, COUNT(*) as user_count FROM users');
    
    res.json({
      status: 'OK',
      message: 'Serverless functions are working',
      database: {
        connected: true,
        current_time: dbResult.rows[0].current_time,
        user_count: parseInt(dbResult.rows[0].user_count)
      },
      method: req.method,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'ERROR',
      error: 'Database connection failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
