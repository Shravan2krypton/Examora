import { pool } from '../../backend/config/database.js';
import jwt from 'jsonwebtoken';

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'online_exam_system_2024_secure_key_for_authentication', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware for faculty authorization
const authorizeFaculty = (req, res, next) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ error: 'Access denied. Faculty role required.' });
  }
  next();
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply middleware
  await new Promise((resolve, reject) => {
    authenticateToken(req, res, (err) => {
      if (err) return reject(err);
      authorizeFaculty(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });

  try {
    const { id: facultyId } = req.user;

    const result = await pool.query(`
      SELECT q.subject, q.difficulty, COUNT(*) as count
      FROM questions q
      JOIN question_banks qb ON q.question_bank_id = qb.id
      WHERE qb.uploaded_by = $1
      GROUP BY q.subject, q.difficulty
      ORDER BY q.subject, q.difficulty
    `, [facultyId]);

    // Group by subject
    const subjectCounts = {};
    result.rows.forEach(row => {
      if (!subjectCounts[row.subject]) {
        subjectCounts[row.subject] = {
          easy: 0,
          medium: 0,
          hard: 0,
          total: 0
        };
      }
      subjectCounts[row.subject][row.difficulty] = row.count;
      subjectCounts[row.subject].total += row.count;
    });

    res.json(subjectCounts);
  } catch (error) {
    console.error('Get question counts error:', error);
    res.status(500).json({ error: 'Failed to fetch question counts' });
  }
}
