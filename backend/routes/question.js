import express from 'express';
import { authenticate, requireFaculty } from '../middleware/auth.js';
import {
  addQuestion,
  getQuestionsByExam,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionController.js';

const router = express.Router();

router.post('/create', authenticate, requireFaculty, addQuestion);
router.get('/', authenticate, getQuestionsByExam);
router.put('/:id', authenticate, requireFaculty, updateQuestion);
router.delete('/:id', authenticate, requireFaculty, deleteQuestion);

export default router;
