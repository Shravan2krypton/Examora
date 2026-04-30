import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken, authorizeStudent } from '../middleware/auth.js';
import { io } from '../server.js';

const router = express.Router();

// Start exam attempt
router.post('/start', authenticateToken, authorizeStudent, [
  body('examId').isInt({ min: 1 }).withMessage('Valid exam ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { examId } = req.body;
    const { id: studentId } = req.user;

    // Check if exam is available
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

    const exam = examResult.rows[0];

    // Check if student already has an attempt
    const existingAttempt = await pool.query(
      'SELECT * FROM exam_attempts WHERE exam_id = $1 AND student_id = $2',
      [examId, studentId]
    );

    if (existingAttempt.rows.length > 0) {
      const attempt = existingAttempt.rows[0];
      if (attempt.status === 'submitted') {
        return res.status(400).json({ error: 'You have already submitted this exam' });
      }
      if (attempt.status === 'expired') {
        return res.status(400).json({ error: 'Your exam attempt has expired' });
      }
      // Return existing attempt
      return res.json({
        message: 'Exam attempt resumed',
        attempt: attempt,
        exam: exam
      });
    }

    // Create new attempt
    const attemptResult = await pool.query(
      `INSERT INTO exam_attempts (exam_id, student_id, started_at) 
       VALUES ($1, $2, NOW()) RETURNING *`,
      [examId, studentId]
    );

    // Notify faculty that student started exam
    io.emit('exam-started', {
      examId,
      studentId,
      startedAt: new Date()
    });

    res.status(201).json({
      message: 'Exam started successfully',
      attempt: attemptResult.rows[0],
      exam: exam
    });
  } catch (error) {
    console.error('Start exam error:', error);
    res.status(500).json({ error: 'Failed to start exam' });
  }
});

// Save answer
router.post('/save-answer', authenticateToken, authorizeStudent, [
  body('examId').isInt({ min: 1 }).withMessage('Valid exam ID required'),
  body('questionId').isInt({ min: 1 }).withMessage('Valid question ID required'),
  body('selectedOption').isIn(['A', 'B', 'C', 'D']).withMessage('Valid option required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { examId, questionId, selectedOption } = req.body;
    const { id: studentId } = req.user;

    // Get active attempt
    const attemptResult = await pool.query(
      `SELECT * FROM exam_attempts 
       WHERE exam_id = $1 AND student_id = $2 AND status = 'in_progress'`,
      [examId, studentId]
    );

    if (attemptResult.rows.length === 0) {
      return res.status(400).json({ error: 'No active exam attempt found' });
    }

    const attempt = attemptResult.rows[0];

    // Check if attempt has expired (based on exam duration)
    const examResult = await pool.query('SELECT duration FROM exams WHERE id = $1', [examId]);
    const examDuration = examResult.rows[0].duration * 60; // Convert to seconds
    
    // Use database time for consistent calculation
    const timeElapsedResult = await pool.query(
      'SELECT EXTRACT(EPOCH FROM (NOW() - $1)) as elapsed_seconds',
      [attempt.started_at]
    );
    const timeElapsed = Math.floor(parseFloat(timeElapsedResult.rows[0].elapsed_seconds));
    
    if (timeElapsed > examDuration) {
      // Mark attempt as expired
      await pool.query(
        'UPDATE exam_attempts SET status = $1 WHERE id = $2',
        ['expired', attempt.id]
      );
      return res.status(400).json({ error: 'Exam attempt has expired' });
    }

    // Save or update answer
    const answerResult = await pool.query(
      `INSERT INTO answers (attempt_id, question_id, selected_option, answered_at) 
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (attempt_id, question_id) 
       DO UPDATE SET 
         selected_option = EXCLUDED.selected_option,
         answered_at = EXCLUDED.answered_at
       RETURNING *`,
      [attempt.id, questionId, selectedOption]
    );

    res.json({
      message: 'Answer saved successfully',
      answer: answerResult.rows[0]
    });
  } catch (error) {
    console.error('Save answer error:', error);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

// Submit exam
router.post('/submit', authenticateToken, authorizeStudent, [
  body('examId').isInt({ min: 1 }).withMessage('Valid exam ID required'),
  body('answers').isArray().withMessage('Answers array is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { examId, answers } = req.body;
    const { id: studentId } = req.user;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get active attempt
      const attemptResult = await client.query(
        `SELECT * FROM exam_attempts 
         WHERE exam_id = $1 AND student_id = $2 AND status = 'in_progress'`,
        [examId, studentId]
      );

      if (attemptResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'No active exam attempt found' });
      }

      const attempt = attemptResult.rows[0];

      // Save all answers
      for (const answer of answers) {
        const { questionId, selectedOption } = answer;
        await client.query(
          `INSERT INTO answers (attempt_id, question_id, selected_option, answered_at) 
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (attempt_id, question_id) 
           DO UPDATE SET 
             selected_option = EXCLUDED.selected_option,
             answered_at = EXCLUDED.answered_at`,
          [attempt.id, questionId, selectedOption]
        );
      }

      // Calculate results
      const questionsResult = await client.query(
        `SELECT q.id, q.correct_answer, a.selected_option 
         FROM questions q
         LEFT JOIN answers a ON q.id = a.question_id AND a.attempt_id = $1
         WHERE q.exam_id = $2`,
        [attempt.id, examId]
      );

      const questions = questionsResult.rows;
      const totalQuestions = questions.length;
      let correctAnswers = 0;

      questions.forEach(q => {
        if (q.selected_option === q.correct_answer) {
          correctAnswers++;
        }
      });

      const score = correctAnswers;
      const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const timeTaken = Math.floor((new Date() - new Date(attempt.started_at)) / 1000);

      // Save result
      const resultResult = await client.query(
        `INSERT INTO results (exam_id, student_id, attempt_id, total_questions, correct_answers, score, percentage, time_taken, submitted_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
        [examId, studentId, attempt.id, totalQuestions, correctAnswers, score, percentage, timeTaken]
      );

      // Mark attempt as submitted
      await client.query(
        'UPDATE exam_attempts SET status = $1, submitted_at = NOW() WHERE id = $2',
        ['submitted', attempt.id]
      );

      await client.query('COMMIT');

      // Notify faculty about submission
      io.emit('exam-submitted', {
        examId,
        studentId,
        submittedAt: new Date(),
        score,
        percentage
      });

      res.json({
        message: 'Exam submitted successfully',
        result: resultResult.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({ error: 'Failed to submit exam' });
  }
});

// Get attempt status
router.get('/status/:examId', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const { examId } = req.params;
    const { id: studentId } = req.user;

    const attemptResult = await pool.query(
      `SELECT ea.*, e.duration, 
       CASE 
         WHEN ea.status = 'submitted' THEN 'submitted'
         WHEN ea.status = 'expired' THEN 'expired'
         WHEN (EXTRACT(EPOCH FROM (NOW() - ea.started_at)) > e.duration * 60) THEN 'expired'
         ELSE 'in_progress'
       END as current_status
       FROM exam_attempts ea
       JOIN exams e ON ea.exam_id = e.id
       WHERE ea.exam_id = $1 AND ea.student_id = $2`,
      [examId, studentId]
    );

    if (attemptResult.rows.length === 0) {
      return res.json({ status: 'not_started' });
    }

    const attempt = attemptResult.rows[0];

    // If expired but not marked, update status
    if (attempt.current_status === 'expired' && attempt.status !== 'expired') {
      await pool.query(
        'UPDATE exam_attempts SET status = $1 WHERE id = $2',
        ['expired', attempt.id]
      );
      attempt.status = 'expired';
    }

    res.json({
      status: attempt.status || attempt.current_status,
      attempt: {
        id: attempt.id,
        started_at: attempt.started_at,
        submitted_at: attempt.submitted_at,
        status: attempt.status || attempt.current_status
      }
    });
  } catch (error) {
    console.error('Get attempt status error:', error);
    res.status(500).json({ error: 'Failed to get attempt status' });
  }
});

export default router;
