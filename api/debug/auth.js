import { pool } from '../../backend/config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Debug auth endpoint called');
    
    if (req.method === 'GET') {
      // Check database connection and users
      const dbResult = await pool.query('SELECT COUNT(*) as user_count FROM users');
      const usersResult = await pool.query('SELECT id, email, role, name FROM users LIMIT 5');
      
      return res.json({
        status: 'OK',
        database: {
          connected: true,
          user_count: parseInt(dbResult.rows[0].user_count),
          users: usersResult.rows
        },
        environment: {
          jwt_secret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
          database_url: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
        }
      });
    }
    
    if (req.method === 'POST') {
      // Test login with provided credentials
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      console.log('Testing login for:', email);
      
      // Find user
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return res.json({
          success: false,
          error: 'User not found',
          debug: {
            email_provided: email,
            users_in_db: await pool.query('SELECT email FROM users').then(r => r.rows.map(u => u.email))
          }
        });
      }
      
      const user = result.rows[0];
      
      // Test password comparison
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.json({
          success: false,
          error: 'Invalid password',
          debug: {
            email: user.email,
            role: user.role,
            password_hash_length: user.password.length
          }
        });
      }
      
      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'online_exam_system_2024_secure_key_for_authentication',
        { expiresIn: '24h' }
      );
      
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    }
    
  } catch (error) {
    console.error('Debug auth error:', error);
    res.status(500).json({ 
      error: 'Debug auth failed',
      details: error.message,
      stack: error.stack
    });
  }
}
