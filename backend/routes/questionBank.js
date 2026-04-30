import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken, authorizeFaculty } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'questionbank-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Only allow PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// Upload question bank PDF
router.post('/upload', authenticateToken, authorizeFaculty, upload.single('pdf'), [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { title, description } = req.body;
    const { id: facultyId } = req.user;
    const filePath = req.file.filename;

    // Save to database
    const result = await pool.query(
      `INSERT INTO question_banks (title, description, file_path, uploaded_by) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, filePath, facultyId]
    );

    res.status(201).json({
      message: 'Question bank uploaded successfully',
      questionBank: result.rows[0]
    });
  } catch (error) {
    console.error('Upload question bank error:', error);
    
    // Delete uploaded file if database operation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Failed to upload question bank' });
  }
});

// Get all question banks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let query;
    let params;

    if (role === 'faculty') {
      // Faculty sees their own question banks
      query = `
        SELECT qb.*, u.name as uploaded_by_name
        FROM question_banks qb
        JOIN users u ON qb.uploaded_by = u.id
        WHERE qb.uploaded_by = $1
        ORDER BY qb.created_at DESC
      `;
      params = [userId];
    } else {
      // Students see all available question banks
      query = `
        SELECT qb.*, u.name as uploaded_by_name
        FROM question_banks qb
        JOIN users u ON qb.uploaded_by = u.id
        ORDER BY qb.created_at DESC
      `;
      params = [];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get question banks error:', error);
    res.status(500).json({ error: 'Failed to fetch question banks' });
  }
});

// Get single question bank
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const result = await pool.query(
      `SELECT qb.*, u.name as uploaded_by_name
       FROM question_banks qb
       JOIN users u ON qb.uploaded_by = u.id
       WHERE qb.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question bank not found' });
    }

    const questionBank = result.rows[0];

    // Check permissions
    if (role === 'faculty' && questionBank.uploaded_by !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(questionBank);
  } catch (error) {
    console.error('Get question bank error:', error);
    res.status(500).json({ error: 'Failed to fetch question bank' });
  }
});

// Update question bank
router.put('/:id', authenticateToken, authorizeFaculty, [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Title must be at least 1 character'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { id: facultyId } = req.user;
    const { title, description } = req.body;

    // Check if question bank exists and belongs to faculty
    const qbResult = await pool.query(
      'SELECT * FROM question_banks WHERE id = $1 AND uploaded_by = $2',
      [id, facultyId]
    );

    if (qbResult.rows.length === 0) {
      return res.status(404).json({ error: 'Question bank not found or access denied' });
    }

    const result = await pool.query(
      `UPDATE question_banks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description)
       WHERE id = $3
       RETURNING *`,
      [title, description, id]
    );

    res.json({
      message: 'Question bank updated successfully',
      questionBank: result.rows[0]
    });
  } catch (error) {
    console.error('Update question bank error:', error);
    res.status(500).json({ error: 'Failed to update question bank' });
  }
});

// Delete question bank
router.delete('/:id', authenticateToken, authorizeFaculty, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: facultyId } = req.user;

    // Check if question bank exists and belongs to faculty
    const qbResult = await pool.query(
      'SELECT * FROM question_banks WHERE id = $1 AND uploaded_by = $2',
      [id, facultyId]
    );

    if (qbResult.rows.length === 0) {
      return res.status(404).json({ error: 'Question bank not found or access denied' });
    }

    const questionBank = qbResult.rows[0];

    // Delete from database
    await pool.query('DELETE FROM question_banks WHERE id = $1', [id]);

    // Delete file from filesystem
    const filePath = path.join(uploadsDir, questionBank.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Question bank deleted successfully' });
  } catch (error) {
    console.error('Delete question bank error:', error);
    res.status(500).json({ error: 'Failed to delete question bank' });
  }
});

// Download question bank PDF
router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const result = await pool.query(
      'SELECT * FROM question_banks WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question bank not found' });
    }

    const questionBank = result.rows[0];

    // Check permissions
    if (role === 'faculty' && questionBank.uploaded_by !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filePath = path.join(uploadsDir, questionBank.file_path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'PDF file not found' });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${questionBank.title}.pdf"`);

    // Send file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download question bank error:', error);
    res.status(500).json({ error: 'Failed to download question bank' });
  }
});

export default router;
