import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, authorizeAny, authorizeFaculty } from '../middleware/auth.js';

const router = express.Router();

// Get results for a student
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { role, id: userId } = req.user;

    // Students can only see their own results
    if (role === 'student' && studentId !== userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `SELECT r.*, e.title as exam_title, e.description as exam_description,
              u.name as student_name, ea.started_at, ea.submitted_at
       FROM results r
       JOIN exams e ON r.exam_id = e.id
       JOIN users u ON r.student_id = u.id
       JOIN exam_attempts ea ON r.attempt_id = ea.id
       WHERE r.student_id = $1
       ORDER BY r.submitted_at DESC`,
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get student results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get detailed result for a specific exam
router.get('/detail/:examId', authenticateToken, async (req, res) => {
  try {
    const { examId } = req.params;
    const { role, id: userId } = req.user;

    let query;
    let params;

    if (role === 'student') {
      // Students can only see their own detailed results
      query = `
        SELECT r.*, e.title as exam_title, e.description as exam_description,
               u.name as student_name, ea.started_at, ea.submitted_at
        FROM results r
        JOIN exams e ON r.exam_id = e.id
        JOIN users u ON r.student_id = u.id
        JOIN exam_attempts ea ON r.attempt_id = ea.id
        WHERE r.exam_id = $1 AND r.student_id = $2
      `;
      params = [examId, userId];
    } else {
      // Faculty can see detailed results for their exams
      query = `
        SELECT r.*, e.title as exam_title, e.description as exam_description,
               u.name as student_name, ea.started_at, ea.submitted_at
        FROM results r
        JOIN exams e ON r.exam_id = e.id
        JOIN users u ON r.student_id = u.id
        JOIN exam_attempts ea ON r.attempt_id = ea.id
        WHERE r.exam_id = $1 AND e.created_by_id = $2
      `;
      params = [examId, userId];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }

    // Get detailed answers for this attempt
    const attemptId = result.rows[0].attempt_id;
    const answersResult = await pool.query(
      `SELECT a.selected_option, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer,
              CASE WHEN a.selected_option = q.correct_answer THEN true ELSE false END as is_correct
       FROM answers a
       JOIN questions q ON a.question_id = q.id
       WHERE a.attempt_id = $1
       ORDER BY q.id`,
      [attemptId]
    );

    const resultData = result.rows[0];
    resultData.answers = answersResult.rows;

    res.json(resultData);
  } catch (error) {
    console.error('Get detailed result error:', error);
    res.status(500).json({ error: 'Failed to fetch detailed result' });
  }
});

// Get leaderboard for an exam
router.get('/leaderboard/:examId', authenticateToken, async (req, res) => {
  try {
    const { examId } = req.params;
    const { role, id: userId } = req.user;

    // Verify exam exists and user has access
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

    const leaderboardResult = await pool.query(
      `SELECT r.*, u.name as student_name, u.email as student_email,
              ea.started_at, ea.submitted_at,
              ROW_NUMBER() OVER (ORDER BY r.score DESC, r.submitted_at ASC) as rank
       FROM results r
       JOIN users u ON r.student_id = u.id
       JOIN exam_attempts ea ON r.attempt_id = ea.id
       WHERE r.exam_id = $1
       ORDER BY r.score DESC, r.submitted_at ASC
       LIMIT 100`,
      [examId]
    );

    // Find current user's rank if they're a student
    let userRank = null;
    if (role === 'student') {
      const userRankResult = await pool.query(
        `SELECT COUNT(*) + 1 as rank
         FROM results r
         WHERE r.exam_id = $1 AND (
           r.score > (SELECT score FROM results WHERE exam_id = $1 AND student_id = $2)
           OR (r.score = (SELECT score FROM results WHERE exam_id = $1 AND student_id = $2) 
               AND r.submitted_at < (SELECT submitted_at FROM results WHERE exam_id = $1 AND student_id = $2))
         )`,
        [examId, userId]
      );
      
      const userResult = await pool.query(
        'SELECT * FROM results WHERE exam_id = $1 AND student_id = $2',
        [examId, userId]
      );

      if (userResult.rows.length > 0) {
        userRank = {
          rank: userRankResult.rows[0].rank,
          ...userResult.rows[0]
        };
      }
    }

    res.json({
      leaderboard: leaderboardResult.rows,
      userRank: userRank
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get exam results for faculty
router.get('/exam/:examId', authenticateToken, authorizeFaculty, async (req, res) => {
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

    const resultsResult = await pool.query(
      `SELECT r.*, u.name as student_name, u.email as student_email,
              ea.started_at, ea.submitted_at,
              ROW_NUMBER() OVER (ORDER BY r.score DESC, r.submitted_at ASC) as rank
       FROM results r
       JOIN users u ON r.student_id = u.id
       JOIN exam_attempts ea ON r.attempt_id = ea.id
       WHERE r.exam_id = $1
       ORDER BY r.score DESC, r.submitted_at ASC`,
      [examId]
    );

    // Get exam statistics
    const statsResult = await pool.query(
      `SELECT 
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN r.status = 'submitted' THEN 1 END) as submitted_attempts,
        AVG(r.score) as average_score,
        MAX(r.score) as highest_score,
        MIN(r.score) as lowest_score,
        AVG(r.percentage) as average_percentage
       FROM exam_attempts ea
       LEFT JOIN results r ON ea.id = r.attempt_id
       WHERE ea.exam_id = $1`,
      [examId]
    );

    res.json({
      results: resultsResult.rows,
      statistics: statsResult.rows[0]
    });
  } catch (error) {
    console.error('Get exam results error:', error);
    res.status(500).json({ error: 'Failed to fetch exam results' });
  }
});

// Get performance analytics for faculty
router.get('/analytics/:examId', authenticateToken, authorizeFaculty, async (req, res) => {
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

    // Question-wise analytics
    const questionAnalyticsResult = await pool.query(
      `SELECT q.id, q.question_text,
              COUNT(a.id) as total_attempts,
              COUNT(CASE WHEN a.selected_option = q.correct_answer THEN 1 END) as correct_attempts,
              ROUND(
                (COUNT(CASE WHEN a.selected_option = q.correct_answer THEN 1 END) * 100.0 / 
                 NULLIF(COUNT(a.id), 0)), 2
              ) as accuracy_percentage,
              COUNT(CASE WHEN a.selected_option = 'A' THEN 1 END) as option_a_count,
              COUNT(CASE WHEN a.selected_option = 'B' THEN 1 END) as option_b_count,
              COUNT(CASE WHEN a.selected_option = 'C' THEN 1 END) as option_c_count,
              COUNT(CASE WHEN a.selected_option = 'D' THEN 1 END) as option_d_count
       FROM questions q
       LEFT JOIN answers a ON q.id = a.question_id
       LEFT JOIN exam_attempts ea ON a.attempt_id = ea.id
       WHERE q.exam_id = $1 AND ea.status = 'submitted'
       GROUP BY q.id, q.question_text
       ORDER BY q.id`,
      [examId]
    );

    // Score distribution
    const scoreDistributionResult = await pool.query(
      `SELECT 
        CASE 
          WHEN r.percentage >= 90 THEN 'Excellent (90-100%)'
          WHEN r.percentage >= 75 THEN 'Good (75-89%)'
          WHEN r.percentage >= 60 THEN 'Average (60-74%)'
          WHEN r.percentage >= 40 THEN 'Below Average (40-59%)'
          ELSE 'Poor (0-39%)'
        END as performance_range,
        COUNT(*) as student_count
       FROM results r
       WHERE r.exam_id = $1
       GROUP BY performance_range
       ORDER BY MIN(r.percentage) DESC`,
      [examId]
    );

    res.json({
      questionAnalytics: questionAnalyticsResult.rows,
      scoreDistribution: scoreDistributionResult.rows
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
