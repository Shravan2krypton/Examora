import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken, authorizeFaculty, authorizeStudent } from '../middleware/auth.js';

const router = express.Router();

// Add questions to question bank
router.post('/add-to-bank', authenticateToken, authorizeFaculty, [
  body('questionBankId').isInt({ min: 1 }).withMessage('Valid question bank ID required'),
  body('questions').isArray({ min: 1 }).withMessage('Questions array is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { questionBankId, questions } = req.body;
    const { id: facultyId } = req.user;

    // Verify question bank belongs to faculty
    const qbResult = await pool.query(
      'SELECT * FROM question_banks WHERE id = $1 AND uploaded_by = $2',
      [questionBankId, facultyId]
    );

    if (qbResult.rows.length === 0) {
      return res.status(404).json({ error: 'Question bank not found or access denied' });
    }

    const questionBank = qbResult.rows[0];

    // Insert questions in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertedQuestions = [];
      for (const question of questions) {
        const { questionText, optionA, optionB, optionC, optionD, correctAnswer, subject, difficulty } = question;
        
        const result = await client.query(
          `INSERT INTO questions (question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, created_by) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
          [questionBankId, questionText, optionA, optionB, optionC, optionD, correctAnswer, subject || questionBank.subject, difficulty || 'medium', facultyId]
        );
        
        insertedQuestions.push(result.rows[0]);
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: `${insertedQuestions.length} questions added to question bank successfully`,
        questions: insertedQuestions
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Add questions to bank error:', error);
    res.status(500).json({ error: 'Failed to add questions to question bank' });
  }
});

// Get questions from question bank
router.get('/bank/:questionBankId', authenticateToken, async (req, res) => {
  try {
    const { questionBankId } = req.params;
    const { role, id: userId } = req.user;

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

    res.json(questionsResult.rows);
  } catch (error) {
    console.error('Get questions from bank error:', error);
    res.status(500).json({ error: 'Failed to fetch questions from question bank' });
  }
});

// Get questions for exam attempt (for students - without correct answers)
router.get('/exam/:examId/attempt', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const { examId } = req.params;
    const { id: studentId } = req.user;

    // Verify exam is available for students
    const examResult = await pool.query(
      `SELECT * FROM exams 
       WHERE id = $1 AND is_live = true 
       AND (start_time IS NULL OR start_time <= NOW())
       AND (end_time IS NULL OR end_time >= NOW())`,
      [examId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not available' });
    }

    // Get questions for this exam (without correct answers)
    const questionsResult = await pool.query(
      `SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, eq.question_number
       FROM questions q
       JOIN exam_questions eq ON q.id = eq.question_id
       WHERE eq.exam_id = $1
       ORDER BY eq.question_number`,
      [examId]
    );

    res.json(questionsResult.rows);
  } catch (error) {
    console.error('Get exam questions error:', error);
    res.status(500).json({ error: 'Failed to fetch exam questions' });
  }
});

// Get questions by subject (for exam creation)
router.get('/subject/:subject', authenticateToken, authorizeFaculty, async (req, res) => {
  try {
    const { subject } = req.params;
    const { id: facultyId } = req.user;

    // Get questions from all question banks by this faculty for the subject
    const questionsResult = await pool.query(
      `SELECT q.*, qb.title as question_bank_title
       FROM questions q
       JOIN question_banks qb ON q.question_bank_id = qb.id
       WHERE q.subject = $1 AND qb.uploaded_by = $2
       ORDER BY q.difficulty, q.id
       LIMIT 100`,
      [subject, facultyId]
    );

    res.json(questionsResult.rows);
  } catch (error) {
    console.error('Get questions by subject error:', error);
    res.status(500).json({ error: 'Failed to fetch questions by subject' });
  }
});

export default router;
