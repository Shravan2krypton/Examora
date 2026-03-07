const express = require('express');
const { authenticate, requireFaculty } = require('../middleware/auth.js');
const {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController.js');

const router = express.Router();

router.post('/create', authenticate, requireFaculty, createQuestion);
router.get('/', authenticate, getQuestions);
router.put('/:id', authenticate, requireFaculty, updateQuestion);
router.delete('/:id', authenticate, requireFaculty, deleteQuestion);

module.exports = router;
