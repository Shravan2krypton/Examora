import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken, authorizeFaculty, authorizeStudent } from '../middleware/auth.js';

const router = express.Router();

// Add single question to exam
router.post('/add', authenticateToken, authorizeFaculty, [
  body('examId').isInt({ min: 1 }).withMessage('Valid exam ID required'),
  body('questionText').trim().isLength({ min: 1 }).withMessage('Question text is required'),
  body('optionA').trim().isLength({ min: 1 }).withMessage('Option A is required'),
  body('optionB').trim().isLength({ min: 1 }).withMessage('Option B is required'),
  body('optionC').trim().isLength({ min: 1 }).withMessage('Option C is required'),
  body('optionD').trim().isLength({ min: 1 }).withMessage('Option D is required'),
  body('correctAnswer').isIn(['A', 'B', 'C', 'D']).withMessage('Correct answer must be A, B, C, or D')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { examId, questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
    const { id: facultyId } = req.user;

    // Verify exam belongs to faculty
    const examResult = await pool.query(
      'SELECT id FROM exams WHERE id = $1 AND created_by_id = $2',
      [examId, facultyId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found or access denied' });
    }

    const result = await pool.query(
      `INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [examId, questionText, optionA, optionB, optionC, optionD, correctAnswer]
    );

    res.status(201).json({
      message: 'Question added successfully',
      question: result.rows[0]
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Add multiple questions to exam
router.post('/add-bulk', authenticateToken, authorizeFaculty, [
  body('examId').isInt({ min: 1 }).withMessage('Valid exam ID required'),
  body('questions').isArray({ min: 1 }).withMessage('Questions array is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { examId, questions } = req.body;
    const { id: facultyId } = req.user;

    // Verify exam belongs to faculty
    const examResult = await pool.query(
      'SELECT id FROM exams WHERE id = $1 AND created_by_id = $2',
      [examId, facultyId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found or access denied' });
    }

    // Insert questions in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertedQuestions = [];
      for (const question of questions) {
        const { questionText, optionA, optionB, optionC, optionD, correctAnswer } = question;
        
        const result = await client.query(
          `INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [examId, questionText, optionA, optionB, optionC, optionD, correctAnswer]
        );
        
        insertedQuestions.push(result.rows[0]);
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: `${insertedQuestions.length} questions added successfully`,
        questions: insertedQuestions
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Add bulk questions error:', error);
    res.status(500).json({ error: 'Failed to add questions' });
  }
});

// Get questions for an exam (for faculty)
router.get('/:examId', authenticateToken, async (req, res) => {
  try {
    const { examId } = req.params;
    const { role, id: userId } = req.user;

    // First verify exam exists and user has access
    const examResult = await pool.query(
      'SELECT * FROM exams WHERE id = $1',
      [examId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const exam = examResult.rows[0];

    // Check permissions
    if (role === 'faculty' && exam.created_by_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get questions
    const questionsResult = await pool.query(
      'SELECT * FROM questions WHERE exam_id = $1 ORDER BY id',
      [examId]
    );

    res.json(questionsResult.rows);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get questions for exam attempt (for students - without correct answers)
router.get('/:examId/attempt', authenticateToken, authorizeStudent, async (req, res) => {
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

    // Get questions without correct answers
    const questionsResult = await pool.query(
      `SELECT id, question_text, option_a, option_b, option_c, option_d 
       FROM questions WHERE exam_id = $1 ORDER BY id`,
      [examId]
    );

    res.json(questionsResult.rows);
  } catch (error) {
    console.error('Get exam questions error:', error);
    res.status(500).json({ error: 'Failed to fetch exam questions' });
  }
});

// Update question
router.put('/:questionId', authenticateToken, authorizeFaculty, async (req, res) => {
  try {
    const { questionId } = req.params;
    const { id: facultyId } = req.user;
    const { questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    // Verify question belongs to faculty's exam
    const questionResult = await pool.query(
      `SELECT q.* FROM questions q
       JOIN exams e ON q.exam_id = e.id
       WHERE q.id = $1 AND e.created_by_id = $2`,
      [questionId, facultyId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found or access denied' });
    }

    const result = await pool.query(
      `UPDATE questions 
       SET question_text = COALESCE($1, question_text),
           option_a = COALESCE($2, option_a),
           option_b = COALESCE($3, option_b),
           option_c = COALESCE($4, option_c),
           option_d = COALESCE($5, option_d),
           correct_answer = COALESCE($6, correct_answer)
       WHERE id = $7
       RETURNING *`,
      [questionText, optionA, optionB, optionC, optionD, correctAnswer, questionId]
    );

    res.json({
      message: 'Question updated successfully',
      question: result.rows[0]
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete question
router.delete('/:questionId', authenticateToken, authorizeFaculty, async (req, res) => {
  try {
    const { questionId } = req.params;
    const { id: facultyId } = req.user;

    // Verify question belongs to faculty's exam
    const questionResult = await pool.query(
      `SELECT q.* FROM questions q
       JOIN exams e ON q.exam_id = e.id
       WHERE q.id = $1 AND e.created_by_id = $2`,
      [questionId, facultyId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found or access denied' });
    }

    await pool.query('DELETE FROM questions WHERE id = $1', [questionId]);

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

export default router;
