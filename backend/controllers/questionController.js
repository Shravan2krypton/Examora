import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addQuestion = async (req, res) => {
  try {
    const { examId, questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    if (!examId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const validAnswers = ['a', 'b', 'c', 'd'];
    if (!validAnswers.includes(correctAnswer.toLowerCase())) {
      return res.status(400).json({ error: 'Correct answer must be a, b, c, or d.' });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId }
    });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    if (exam.createdById !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to add questions to this exam.' });
    }

    const question = await prisma.question.create({
      data: {
        examId,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer: correctAnswer.toLowerCase()
      }
    });

    res.status(201).json(question);
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export const addBulkQuestions = async (req, res) => {
  try {
    const { examId, questions } = req.body;

    if (!examId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Exam ID and questions array are required.' });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId }
    });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    if (exam.createdById !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to add questions to this exam.' });
    }

    const validAnswers = ['a', 'b', 'c', 'd'];
    const data = questions.map(q => {
      const correctAnswer = (q.correctAnswer || '').toLowerCase();
      if (!validAnswers.includes(correctAnswer)) {
        throw new Error(`Invalid correct answer: ${q.correctAnswer}`);
      }
      return {
        examId,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer
      };
    });

    const result = await prisma.question.createMany({
      data
    });

    res.status(201).json({ message: `${result.count} questions added successfully.` });
  } catch (error) {
    console.error('Add bulk questions error:', error);
    res.status(500).json({ error: error.message || 'Server error.' });
  }
};

export const getQuestionsByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const questions = await prisma.question.findMany({
      where: { examId }
    });

    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
