import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createExam = async (req, res) => {
  try {
    const { title, subject, timeLimit, totalQuestions, startDate, endDate } = req.body;

    if (!title || !subject || !timeLimit || !totalQuestions || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        subject,
        timeLimit: parseInt(timeLimit),
        totalQuestions: parseInt(totalQuestions),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdById: req.user.id
      }
    });

    res.status(201).json(exam);
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export const getExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(exams);
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true }
        },
        questions: true,
        _count: {
          select: { questions: true }
        }
      }
    });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    res.json(exam);
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export const getExamForAttempt = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questions: true
      }
    });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    const now = new Date();
    if (now < exam.startDate) {
      return res.status(400).json({ error: 'Exam has not started yet.' });
    }
    if (now > exam.endDate) {
      return res.status(400).json({ error: 'Exam has ended.' });
    }

    // Check if student already submitted
    const existingResult = await prisma.result.findUnique({
      where: {
        studentId_examId: {
          studentId: req.user.id,
          examId: id
        }
      }
    });

    if (existingResult) {
      return res.status(400).json({ error: 'You have already submitted this exam.' });
    }

    // Shuffle questions for random order
    const shuffledQuestions = [...exam.questions].sort(() => Math.random() - 0.5);

    res.json({
      ...exam,
      questions: shuffledQuestions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD
        // correctAnswer excluded for student
      }))
    });
  } catch (error) {
    console.error('Get exam for attempt error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
