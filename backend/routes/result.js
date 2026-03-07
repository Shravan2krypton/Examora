import express from 'express';
import { authenticate, requireStudent, requireFaculty } from '../middleware/auth.js';
import {
  getResults,
  getResultDetail,
  getLeaderboard,
  getExamResults
} from '../controllers/resultController.js';

const router = express.Router();

router.get('/', authenticate, getResults);
router.get('/:id', authenticate, getResultDetail);
router.get('/leaderboard/:examId', authenticate, getLeaderboard);
router.get('/exam/:examId', authenticate, requireFaculty, getExamResults);

export default router;
