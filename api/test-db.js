export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🚀 Database test endpoint called');

    if (req.method === 'GET') {
      // Test database connection step by step
      const results = {
        status: 'Testing Database Connection',
        steps: {},
        environment: {
          database_url: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
          database_url_length: process.env.DATABASE_URL?.length || 0,
          jwt_secret: process.env.JWT_SECRET ? 'SET' : 'NOT SET'
        }
      };

      // Step 1: Try to import database module
      try {
        const { pool } = await import('../backend/config/database.js');
        results.steps.step1_import_db = '✅ SUCCESS';
        results.steps.pool_available = true;
      } catch (importError) {
        results.steps.step1_import_db = '❌ FAILED';
        results.steps.import_error = importError.message;
        return res.json(results);
      }

      // Step 2: Try to connect to database
      try {
        const { pool } = await import('../backend/config/database.js');
        const dbResult = await pool.query('SELECT NOW() as current_time');
        results.steps.step2_connect = '✅ SUCCESS';
        results.steps.current_time = dbResult.rows[0].current_time;
      } catch (connectError) {
        results.steps.step2_connect = '❌ FAILED';
        results.steps.connect_error = connectError.message;
        return res.json(results);
      }

      // Step 3: Try to query users table
      try {
        const { pool } = await import('../backend/config/database.js');
        const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
        results.steps.step3_query_users = '✅ SUCCESS';
        results.steps.user_count = parseInt(userCount.rows[0].count);
      } catch (queryError) {
        results.steps.step3_query_users = '❌ FAILED';
        results.steps.query_error = queryError.message;
        return res.json(results);
      }

      // Step 4: Try to list users
      try {
        const { pool } = await import('../backend/config/database.js');
        const users = await pool.query('SELECT id, email, role FROM users LIMIT 5');
        results.steps.step4_list_users = '✅ SUCCESS';
        results.steps.users = users.rows;
      } catch (listError) {
        results.steps.step4_list_users = '❌ FAILED';
        results.steps.list_error = listError.message;
        return res.json(results);
      }

      results.status = '🎉 All Database Tests Passed!';
      return res.json(results);
    }

  } catch (error) {
    console.error('❌ Database test error:', error);
    res.status(500).json({ 
      status: '❌ Database Test Failed',
      error: error.message,
      stack: error.stack
    });
  }
}
