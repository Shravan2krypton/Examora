import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getResultsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.id;

    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const results = await prisma.result.findMany({
      where: { studentId },
      include: {
        exam: {
          select: { id: true, title: true, subject: true }
        }
      },
      orderBy: { submissionTime: 'desc' }
    });

    res.json(results);
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export const getResultDetail = async (req, res) => {
  try {
    const { examId } = req.params;

    const result = await prisma.result.findUnique({
      where: {
        studentId_examId: {
          studentId: req.user.id,
          examId
        }
      },
      include: {
        exam: {
          include: {
            questions: true
          }
        }
      }
    });

    if (!result) {
      return res.status(404).json({ error: 'Result not found.' });
    }

    const responses = await prisma.studentResponse.findMany({
      where: {
        studentId: req.user.id,
        examId
      }
    });

    const responseMap = new Map(responses.map(r => [r.questionId, r.selectedOption]));

    const questionDetails = result.exam.questions.map(q => ({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      selectedAnswer: responseMap.get(q.id) || null,
      isCorrect: responseMap.get(q.id) === q.correctAnswer
    }));

    res.json({
      ...result,
      questionDetails
    });
  } catch (error) {
    console.error('Get result detail error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      select: { id: true, title: true }
    });

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

    res.json({
      exam,
      leaderboard: leaderboard.map((r, i) => ({
      rank: i + 1,
      studentId: r.student.id,
      studentName: r.student.name,
      score: r.score,
      totalQuestions: r.totalQuestions,
      submissionTime: r.submissionTime
    }))
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export const getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { id: examId }
    });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    if (exam.createdById !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view these results.' });
    }

    const results = await prisma.result.findMany({
      where: { examId },
      include: {
        student: { select: { id: true, name: true, email: true } }
      },
      orderBy: [
        { score: 'desc' },
        { submissionTime: 'asc' }
      ]
    });

    res.json(results);
  } catch (error) {
    console.error('Get exam results error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
