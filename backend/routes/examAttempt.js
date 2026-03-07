const express = require('express');
const { authenticate, requireStudent, requireFaculty } = require('../middleware/auth.js');
const {
  startExam,
  saveAnswer,
  submitExam
} = require('../controllers/examAttemptController.js');

const router = express.Router();

router.post('/start', authenticate, requireStudent, startExam);
router.post('/save-answer', authenticate, requireStudent, saveAnswer);
router.post('/submit', authenticate, requireStudent, submitExam);

module.exports = router;
