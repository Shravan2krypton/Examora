import { PrismaClient } from '@prisma/client';
import { getIO } from '../socket.js';

const prisma = new PrismaClient();

export const startExam = async (req, res) => {
  try {
    const { examId } = req.body;

    if (!examId) {
      return res.status(400).json({ error: 'Exam ID is required.' });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true }
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

    const existingResult = await prisma.result.findUnique({
      where: {
        studentId_examId: {
          studentId: req.user.id,
          examId
        }
      }
    });

    if (existingResult) {
      return res.status(400).json({ error: 'You have already submitted this exam.' });
    }

    const shuffledQuestions = [...exam.questions].sort(() => Math.random() - 0.5);

    res.json({
      exam: {
        id: exam.id,
        title: exam.title,
        subject: exam.subject,
        timeLimit: exam.timeLimit,
        totalQuestions: exam.totalQuestions
      },
      questions: shuffledQuestions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD
      }))
    });
  } catch (error) {
    console.error('Start exam error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export const saveAnswer = async (req, res) => {
  try {
    const { examId, questionId, selectedOption } = req.body;

    if (!examId || !questionId || !selectedOption) {
      return res.status(400).json({ error: 'Exam ID, question ID and selected option are required.' });
    }

    const validOptions = ['a', 'b', 'c', 'd'];
    if (!validOptions.includes(selectedOption.toLowerCase())) {
      return res.status(400).json({ error: 'Selected option must be a, b, c, or d.' });
    }

    const existingResult = await prisma.result.findUnique({
      where: {
        studentId_examId: {
          studentId: req.user.id,
          examId
        }
      }
    });

    if (existingResult) {
      return res.status(400).json({ error: 'Exam already submitted.' });
    }

    await prisma.studentResponse.upsert({
      where: {
        studentId_examId_questionId: {
          studentId: req.user.id,
          examId,
          questionId
        }
      },
      create: {
        studentId: req.user.id,
        examId,
        questionId,
        selectedOption: selectedOption.toLowerCase()
      },
      update: {
        selectedOption: selectedOption.toLowerCase()
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Save answer error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export const submitExam = async (req, res) => {
  try {
    const { examId } = req.body;

    if (!examId) {
      return res.status(400).json({ error: 'Exam ID is required.' });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true }
    });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    const existingResult = await prisma.result.findUnique({
      where: {
        studentId_examId: {
          studentId: req.user.id,
          examId
        }
      }
    });

    if (existingResult) {
      return res.status(400).json({ error: 'Exam already submitted.' });
    }

    const responses = await prisma.studentResponse.findMany({
      where: {
        studentId: req.user.id,
        examId
      }
    });

    let score = 0;
    const responseMap = new Map(responses.map(r => [r.questionId, r.selectedOption]));

    for (const question of exam.questions) {
      const selected = responseMap.get(question.id);
      if (selected === question.correctAnswer) {
        score++;
      }
    }

    const result = await prisma.result.create({
      data: {
        studentId: req.user.id,
        examId,
        score,
        totalQuestions: exam.questions.length
      }
    });

    // Emit leaderboard update via Socket.io
    const io = getIO();
    if (io) {
      const leaderboard = await prisma.result.findMany({
        where: { examId },
        include: {
          student: { select: { id: true, name: true } }
        },
        orderBy: [
          { score: 'desc' },
          { submissionTime: 'asc' }
        ]
      });

      io.to(`exam-${examId}`).emit('leaderboard-update', leaderboard.map((r, i) => ({
        rank: i + 1,
        studentId: r.student.id,
        studentName: r.student.name,
        score: r.score,
        totalQuestions: r.totalQuestions,
        submissionTime: r.submissionTime
      })));
    }

    res.json({
      result: {
        id: result.id,
        score,
        totalQuestions: exam.questions.length,
        submissionTime: result.submissionTime
      }
    });
  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
