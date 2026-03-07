import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

export const uploadQuestionBank = async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!subject) {
      return res.status(400).json({ error: 'Subject is required.' });
    }

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ error: 'PDF file is required.' });
    }

    const pdfUrl = `/uploads/${req.file.filename}`;

    const questionBank = await prisma.questionBank.create({
      data: {
        subject,
        description: description || '',
        pdfUrl,
        uploadedById: req.user.id
      }
    });

    res.status(201).json(questionBank);
  } catch (error) {
    console.error('Upload question bank error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export const getQuestionBanks = async (req, res) => {
  try {
    const questionBanks = await prisma.questionBank.findMany({
      include: {
        uploadedBy: {
          select: { id: true, name: true }
        }
      },
      orderBy: { uploadDate: 'desc' }
    });

    res.json(questionBanks);
  } catch (error) {
    console.error('Get question banks error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
