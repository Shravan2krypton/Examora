import express from 'express';
import { authenticate, requireFaculty } from '../middleware/auth.js';
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionController.js';

const router = express.Router();

router.post('/create', authenticate, requireFaculty, createQuestion);
router.get('/', authenticate, getQuestions);
router.put('/:id', authenticate, requireFaculty, updateQuestion);
router.delete('/:id', authenticate, requireFaculty, deleteQuestion);

export default router;
