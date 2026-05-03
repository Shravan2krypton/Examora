import { pool } from '../backend/config/database.js';
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
    console.log('🚀 Final authentication test...');

    if (req.method === 'GET') {
      // Test database connection and list users
      const dbResult = await pool.query('SELECT NOW() as current_time, COUNT(*) as user_count FROM users');
      const usersResult = await pool.query('SELECT id, email, role, name FROM users ORDER BY created_at DESC');
      
      return res.json({
        status: '✅ Final Authentication Test - GET',
        database: {
          connected: true,
          current_time: dbResult.rows[0].current_time,
          user_count: parseInt(dbResult.rows[0].user_count)
        },
        users: usersResult.rows,
        environment: {
          jwt_secret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
          database_url: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
          node_env: process.env.NODE_ENV || 'NOT SET'
        },
        test_credentials: [
          { email: 'faculty@test.com', password: 'test123456', role: 'faculty' },
          { email: 'student@test.com', password: 'test123456', role: 'student' }
        ],
        next_step: 'Use POST request to test complete authentication flow'
      });
    }

    if (req.method === 'POST') {
      // Test complete authentication flow
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          status: '❌ Test Failed',
          error: 'Email and password are required',
          test_credentials: [
            { email: 'faculty@test.com', password: 'test123456' },
            { email: 'student@test.com', password: 'test123456' }
          ]
        });
      }

      console.log(`🔍 Testing authentication for:`, email);

      // Step 1: Find user
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (userResult.rows.length === 0) {
        return res.json({
          status: '❌ Test Failed',
          step: 'User Lookup',
          error: 'User not found',
          available_users: await pool.query('SELECT email FROM users').then(r => r.rows)
        });
      }

      const user = userResult.rows[0];
      console.log('✅ User found:', user.email, user.role);

      // Step 2: Test password verification
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.json({
          status: '❌ Test Failed',
          step: 'Password Verification',
          error: 'Invalid password',
          user_info: {
            email: user.email,
            role: user.role,
            password_hash_length: user.password.length
          }
        });
      }

      console.log('✅ Password verified successfully');

      // Step 3: Test JWT token generation
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'online_exam_system_2024_secure_key_for_authentication',
        { expiresIn: '24h' }
      );

      console.log('✅ JWT token generated successfully');

      // Step 4: Test JWT token verification
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'online_exam_system_2024_secure_key_for_authentication');
        console.log('✅ JWT token verified successfully');
      } catch (tokenError) {
        return res.json({
          status: '❌ Test Failed',
          step: 'JWT Token Verification',
          error: 'Token verification failed',
          details: tokenError.message
        });
      }

      // Step 5: Return success with all test results
      return res.json({
        status: '🎉 AUTHENTICATION TEST SUCCESSFUL!',
        test_results: {
          step_1_user_lookup: '✅ PASSED',
          step_2_password_verification: '✅ PASSED',
          step_3_jwt_generation: '✅ PASSED',
          step_4_jwt_verification: '✅ PASSED'
        },
        authentication: {
          success: true,
          token: token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          decoded_token: decodedToken
        },
        frontend_ready: {
          login_endpoint: '/api/auth/login',
          register_endpoint: '/api/auth/register',
          use_this_token: 'Include in Authorization header: Bearer ' + token,
          redirect_to: `/${user.role}`
        }
      });
    }

  } catch (error) {
    console.error('❌ Final authentication test error:', error);
    res.status(500).json({ 
      status: '❌ Test Failed',
      error: 'Authentication test failed',
      details: error.message,
      stack: error.stack
    });
  }
}
