import express from 'express';
import { authenticate, requireFaculty } from '../middleware/auth.js';
import {
  addQuestion,
  addBulkQuestions,
  getQuestionsByExam
} from '../controllers/questionController.js';

const router = express.Router();

router.post('/add', authenticate, requireFaculty, addQuestion);
router.post('/add-bulk', authenticate, requireFaculty, addBulkQuestions);
router.get('/:examId', authenticate, requireFaculty, getQuestionsByExam);

export default router;
