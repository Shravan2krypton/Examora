import express from 'express';
import { authenticate, requireFaculty } from '../middleware/auth.js';
import {
  addQuestion,
  addBulkQuestions,
  getQuestionsByExam
} from '../controllers/questionController.js';

const router = express.Router();

router.post('/create', authenticate, requireFaculty, addQuestion);
router.post('/bulk', authenticate, requireFaculty, addBulkQuestions);
router.get('/', authenticate, getQuestionsByExam);

export default router;
