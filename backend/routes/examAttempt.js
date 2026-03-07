import express from 'express';
import { authenticate, requireStudent } from '../middleware/auth.js';
import {
  startExam,
  saveAnswer,
  submitExam
} from '../controllers/examAttemptController.js';

const router = express.Router();

router.post('/start', authenticate, requireStudent, startExam);
router.post('/save-answer', authenticate, requireStudent, saveAnswer);
router.post('/submit', authenticate, requireStudent, submitExam);

export default router;
