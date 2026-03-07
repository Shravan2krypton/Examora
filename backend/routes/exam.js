const express = require('express');
const { authenticate, requireFaculty, requireStudent } = require('../middleware/auth.js');
const {
  createExam,
  getExams,
  getExamById,
  getExamForAttempt
} = require('../controllers/examController.js');

const router = express.Router();

router.post('/create', authenticate, requireFaculty, createExam);
router.get('/', authenticate, getExams);
router.get('/:id', authenticate, getExamById);

// For students to get exam for attempt (questions without correct answers)
router.get('/:id/attempt', authenticate, requireStudent, getExamForAttempt);

module.exports = router;
