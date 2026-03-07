const express = require('express');
const { authenticate, requireFaculty } = require('../middleware/auth.js');
const multer = require('multer');
const path = require('path');
const {
  uploadQuestions,
  getQuestionBanks,
  getQuestionBankById,
  deleteQuestionBank
} = require('../controllers/questionBankController.js');

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

module.exports = router;
