import { pool } from '../backend/config/database.js';

export default async function handler(req, res) {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW()');
    
    // Check if users exist
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    
    res.json({
      status: 'OK',
      database: 'Connected',
      timestamp: result.rows[0].now,
      userCount: parseInt(userCount.rows[0].count)
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message 
    });
  }
}
