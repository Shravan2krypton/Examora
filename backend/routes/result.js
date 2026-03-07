import express from 'express';
import { authenticate, requireFaculty } from '../middleware/auth.js';
import {
  getResultsByStudent,
  getResultDetail,
  getLeaderboard,
  getExamResults
} from '../controllers/resultController.js';

const router = express.Router();

router.get('/student/:studentId?', authenticate, getResultsByStudent);
router.get('/detail/:examId', authenticate, getResultDetail);
router.get('/leaderboard/:examId', getLeaderboard); // Public for viewing
router.get('/exam/:examId', authenticate, requireFaculty, getExamResults);

export default router;
