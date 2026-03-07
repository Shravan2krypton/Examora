import express from 'express';
import { authenticate, requireFaculty } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadQuestionBank, getQuestionBanks } from '../controllers/questionBankController.js';

const router = express.Router();

router.post('/upload', authenticate, requireFaculty, upload.single('pdf'), uploadQuestionBank);
router.get('/', authenticate, getQuestionBanks);

export default router;
