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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply middleware
  await new Promise((resolve, reject) => {
    authenticateToken(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  try {
    const { questionBankId } = req.query;
    const { role, id: userId } = req.user;

    if (!questionBankId) {
      return res.status(400).json({ error: 'Question bank ID is required' });
    }

    // Verify question bank exists and user has access
    const qbResult = await pool.query(
      'SELECT * FROM question_banks WHERE id = $1',
      [questionBankId]
    );

    if (qbResult.rows.length === 0) {
      return res.status(404).json({ error: 'Question bank not found' });
    }

    const questionBank = qbResult.rows[0];

    // Check permissions
    if (role === 'faculty' && questionBank.uploaded_by !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get questions
    let query;
    if (role === 'faculty') {
      // Faculty can see all questions including correct answers
      query = 'SELECT * FROM questions WHERE question_bank_id = $1 ORDER BY id';
    } else {
      // Students cannot see correct answers
      query = 'SELECT id, question_text, option_a, option_b, option_c, option_d, subject, difficulty FROM questions WHERE question_bank_id = $1 ORDER BY id';
    }

    const questionsResult = await pool.query(query, [questionBankId]);

    res.json({
      questionBank: {
        id: questionBank.id,
        title: questionBank.title,
        subject: questionBank.subject,
        description: questionBank.description
      },
      questions: questionsResult.rows,
      totalQuestions: questionsResult.rows.length
    });
  } catch (error) {
    console.error('Get questions from bank error:', error);
    res.status(500).json({ error: 'Failed to fetch questions from question bank' });
  }
}
