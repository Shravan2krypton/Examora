import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken, authorizeFaculty, authorizeAny } from '../middleware/auth.js';

const router = express.Router();

// Get all exams (for faculty - their own exams, for students - available exams)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role, id } = req.user;
    
    let query;
    let params;

    if (role === 'faculty') {
      // Faculty sees their own exams
      query = `
        SELECT e.*, 
               COUNT(q.id) as question_count,
               COUNT(DISTINCT r.id) as attempt_count
        FROM exams e
        LEFT JOIN questions q ON e.id = q.exam_id
        LEFT JOIN results r ON e.id = r.exam_id
        WHERE e.created_by_id = $1
        GROUP BY e.id
        ORDER BY e.created_at DESC
      `;
      params = [id];
    } else {
      // Students see available exams (live or scheduled)
      query = `
        SELECT e.*, 
               COUNT(q.id) as question_count,
               u.name as created_by_name,
               CASE 
                 WHEN e.start_time > NOW() THEN 'upcoming'
                 WHEN e.end_time < NOW() THEN 'expired'
                 WHEN e.is_live = true THEN 'available'
                 ELSE 'draft'
               END as status
        FROM exams e
        JOIN users u ON e.created_by_id = u.id
        LEFT JOIN questions q ON e.id = q.exam_id
        WHERE e.is_live = true 
        AND (e.start_time IS NULL OR e.start_time <= NOW())
        AND (e.end_time IS NULL OR e.end_time >= NOW())
        GROUP BY e.id, u.name
        ORDER BY e.created_at DESC
      `;
      params = [];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// Get exam by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const examResult = await pool.query(
      'SELECT * FROM exams WHERE id = $1',
      [id]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const exam = examResult.rows[0];

    // Check permissions
    if (role === 'faculty' && exam.created_by_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get question count
    const questionCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM questions WHERE exam_id = $1',
      [id]
    );

    exam.question_count = parseInt(questionCountResult.rows[0].count);

    res.json(exam);
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
});

// Create new exam
router.post('/create', authenticateToken, authorizeFaculty, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('createdById').isInt({ min: 1 }).withMessage('Created by ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, duration, start_time, end_time, createdById } = req.body;
    const { id: facultyId } = req.user;

    // Verify the createdById matches the authenticated faculty
    if (createdById !== facultyId) {
      return res.status(403).json({ error: 'Cannot create exam for another user' });
    }

    const result = await pool.query(
      `INSERT INTO exams (title, description, duration, start_time, end_time, created_by_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, duration, start_time, end_time, createdById]
    );

    res.status(201).json({
      message: 'Exam created successfully',
      exam: result.rows[0]
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// Update exam
router.put('/:id', authenticateToken, authorizeFaculty, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: facultyId } = req.user;
    const { title, description, duration, start_time, end_time, is_live } = req.body;

    // Check if exam exists and belongs to faculty
    const examResult = await pool.query(
      'SELECT * FROM exams WHERE id = $1 AND created_by_id = $2',
      [id, facultyId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found or access denied' });
    }

    const result = await pool.query(
      `UPDATE exams 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           duration = COALESCE($3, duration),
           start_time = COALESCE($4, start_time),
           end_time = COALESCE($5, end_time),
           is_live = COALESCE($6, is_live),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, description, duration, start_time, end_time, is_live, id]
    );

    res.json({
      message: 'Exam updated successfully',
      exam: result.rows[0]
    });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ error: 'Failed to update exam' });
  }
});

// Delete exam
router.delete('/:id', authenticateToken, authorizeFaculty, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: facultyId } = req.user;

    // Check if exam exists and belongs to faculty
    const examResult = await pool.query(
      'SELECT * FROM exams WHERE id = $1 AND created_by_id = $2',
      [id, facultyId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found or access denied' });
    }

    await pool.query('DELETE FROM exams WHERE id = $1', [id]);

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

export default router;
