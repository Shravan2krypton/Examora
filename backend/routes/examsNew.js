import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken, authorizeFaculty } from '../middleware/auth.js';

const router = express.Router();

// Simplified exam creation with automatic question selection
router.post('/create-simple', authenticateToken, authorizeFaculty, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('subject').trim().isLength({ min: 1 }).withMessage('Subject is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('totalQuestions').isInt({ min: 1, max: 100 }).withMessage('Total questions must be between 1 and 100'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
  body('startTime').optional().isISO8601().withMessage('Start time must be a valid date'),
  body('endTime').optional().isISO8601().withMessage('End time must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
});

// Get available question counts by subject for faculty
router.get('/question-counts', authenticateToken, authorizeFaculty, async (req, res) => {
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
});

// Get exam with questions (for faculty)
router.get('/:examId/with-questions', authenticateToken, authorizeFaculty, async (req, res) => {
  try {
    const { examId } = req.params;
    const { id: facultyId } = req.user;

    // Verify exam belongs to faculty
    const examResult = await pool.query(
      'SELECT * FROM exams WHERE id = $1 AND created_by_id = $2',
      [examId, facultyId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found or access denied' });
    }

    const exam = examResult.rows[0];

    // Get questions for this exam
    const questionsResult = await pool.query(
      `SELECT q.*, eq.question_number
       FROM questions q
       JOIN exam_questions eq ON q.id = eq.question_id
       WHERE eq.exam_id = $1
       ORDER BY eq.question_number`,
      [examId]
    );

    res.json({
      exam: exam,
      questions: questionsResult.rows
    });
  } catch (error) {
    console.error('Get exam with questions error:', error);
    res.status(500).json({ error: 'Failed to fetch exam with questions' });
  }
});

// Publish exam (make it live)
router.post('/:examId/publish', authenticateToken, authorizeFaculty, async (req, res) => {
  try {
    const { examId } = req.params;
    const { id: facultyId } = req.user;

    // Verify exam belongs to faculty
    const examResult = await pool.query(
      'SELECT * FROM exams WHERE id = $1 AND created_by_id = $2',
      [examId, facultyId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found or access denied' });
    }

    // Check if exam has questions
    const questionsCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = $1',
      [examId]
    );

    if (parseInt(questionsCountResult.rows[0].count) === 0) {
      return res.status(400).json({ error: 'Cannot publish exam without questions' });
    }

    // Publish exam
    const result = await pool.query(
      'UPDATE exams SET is_live = true WHERE id = $1 RETURNING *',
      [examId]
    );

    res.json({
      message: 'Exam published successfully',
      exam: result.rows[0]
    });
  } catch (error) {
    console.error('Publish exam error:', error);
    res.status(500).json({ error: 'Failed to publish exam' });
  }
});

export default router;
