import { pool } from '../backend/config/database.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check if users already exist
    const existingUsers = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      return res.json({ message: 'Users already exist', count: existingUsers.rows[0].count });
    }

    // Create test faculty user
    const facultyPassword = await bcrypt.hash('test123456', 10);
    await pool.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4)
    `, ['Test Faculty', 'faculty@test.com', facultyPassword, 'faculty']);

    // Create test student user
    const studentPassword = await bcrypt.hash('test123456', 10);
    await pool.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4)
    `, ['Test Student', 'student@test.com', studentPassword, 'student']);

    res.json({ 
      message: 'Test users created successfully',
      users: [
        { email: 'faculty@test.com', role: 'faculty', password: 'test123456' },
        { email: 'student@test.com', role: 'student', password: 'test123456' }
      ]
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed users', details: error.message });
  }
}
