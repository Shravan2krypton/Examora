import express from 'express';
import { authenticate, requireFaculty, requireStudent } from '../middleware/auth.js';
import {
  createExam,
  getExams,
  getExamById,
  getExamForAttempt
} from '../controllers/examController.js';

const router = express.Router();

router.post('/create', authenticate, requireFaculty, createExam);
router.get('/', authenticate, getExams);
router.get('/:id', authenticate, getExamById);

// For students to get exam for attempt (questions without correct answers)
router.get('/:id/attempt', authenticate, requireStudent, getExamForAttempt);

export default router;
