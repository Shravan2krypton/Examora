const express = require('express');
const { authenticate, requireStudent, requireFaculty } = require('../middleware/auth.js');
const {
  getResults,
  getResultById,
  getLeaderboard,
  getExamResults
} = require('../controllers/resultController.js');

const router = express.Router();

router.get('/', authenticate, getResults);
router.get('/:id', authenticate, getResultById);
router.get('/leaderboard/:examId', authenticate, getLeaderboard);
router.get('/exam/:examId', authenticate, requireFaculty, getExamResults);

module.exports = router;
