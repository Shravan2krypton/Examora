import { pool } from '../../backend/config/database.js';
import bcrypt from 'bcryptjs';
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
  if (req.method !== 'POST') {
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
    const { 
      title, 
      subject, 
      duration, 
      totalQuestions, 
      difficulty = 'medium',
      startTime, 
      endTime 
    } = req.body;
    const { id: facultyId } = req.user;

    // Validation
    if (!title || !subject || !duration || !totalQuestions) {
      return res.status(400).json({ error: 'Title, subject, duration, and totalQuestions are required' });
    }

    if (totalQuestions < 1 || totalQuestions > 100) {
      return res.status(400).json({ error: 'Total questions must be between 1 and 100' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Step 1: Create the exam
      const examResult = await client.query(
        `INSERT INTO exams (title, description, duration, start_time, end_time, is_live, created_by_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, `Exam for ${subject}`, duration, startTime, endTime, false, facultyId]
      );

      const exam = examResult.rows[0];

      // Step 2: Get available questions from question banks for this subject
      const questionsQuery = `
        SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.difficulty
        FROM questions q
        JOIN question_banks qb ON q.question_bank_id = qb.id
        WHERE q.subject = $1 AND qb.uploaded_by = $2
        ${difficulty !== 'all' ? 'AND q.difficulty = $3' : ''}
        ORDER BY RANDOM()
        LIMIT $${difficulty !== 'all' ? 4 : 3}
      `;

      const questionsResult = await client.query(
        questionsQuery,
        difficulty !== 'all' ? [subject, facultyId, difficulty, totalQuestions] : [subject, facultyId, totalQuestions]
      );

      if (questionsResult.rows.length < totalQuestions) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: `Not enough questions available. Found ${questionsResult.rows.length} questions, but need ${totalQuestions}` 
        });
      }

      // Step 3: Link questions to exam
      const selectedQuestions = questionsResult.rows.slice(0, totalQuestions);
      for (let i = 0; i < selectedQuestions.length; i++) {
        await client.query(
          `INSERT INTO exam_questions (exam_id, question_id, question_number) 
           VALUES ($1, $2, $3)`,
          [exam.id, selectedQuestions[i].id, i + 1]
        );
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Exam created successfully with auto-selected questions',
        exam: {
          id: exam.id,
          title: exam.title,
          subject: subject,
          duration: exam.duration,
          totalQuestions: selectedQuestions.length,
          startTime: exam.start_time,
          endTime: exam.end_time,
          isLive: exam.is_live
        },
        questionsCount: selectedQuestions.length
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create simple exam error:', error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
}
