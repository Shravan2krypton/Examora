import express from 'express';
import { authenticate, requireFaculty } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import {
  uploadQuestions,
  getQuestionBanks,
  getQuestionBankById,
  deleteQuestionBank
} from '../controllers/questionBankController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', authenticate, requireFaculty, upload.single('file'), uploadQuestions);
router.get('/', authenticate, getQuestionBanks);
router.get('/:id', authenticate, getQuestionBankById);
router.delete('/:id', authenticate, requireFaculty, deleteQuestionBank);

export default router;
