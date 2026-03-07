import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { examAttemptAPI } from '../../services/api';
import { 
  HiClock, 
  HiChevronLeft, 
  HiChevronRight,
  HiCheckCircle,
  HiXCircle,
  HiArrowPath
} from 'react-icons/hi2';

const OPTIONS = ['a', 'b', 'c', 'd'];

const questionVariants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 }
};

const optionVariants = {
  hover: { scale: 1.02, y: -2 },
  tap: { scale: 0.98 }
};

export default function AttemptExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [warning, setWarning] = useState(false);
  const [direction, setDirection] = useState(0); // for slide animation

  const loadExam = useCallback(async () => {
    try {
      const { data } = await examAttemptAPI.start(examId);
      setExam(data.exam);
      setQuestions(data.questions);
      setTimeLeft(data.exam.timeLimit * 60);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to load exam');
      navigate('/student/exams');
    } finally {
      setLoading(false);
    }
  }, [examId, navigate]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await examAttemptAPI.submit(examId);
      navigate(`/student/results/${examId}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }, [examId, navigate]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    if (timeLeft <= 60) setWarning(true);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  const saveAnswer = useCallback(
    async (questionId, option) => {
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
      
      // Add haptic feedback simulation
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      try {
        await examAttemptAPI.saveAnswer(examId, questionId, option);
      } catch (e) {
        console.error('Failed to save answer', e);
      }
    },
    [examId]
  );

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleQuestionClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!exam || !questions.length) return null;

  const current = questions[currentIndex];
  const progress = ((Object.keys(answers).length / questions.length) * 100).toFixed(0);

  const totalSeconds = exam.timeLimit * 60;
  const timeRatio = totalSeconds > 0 && timeLeft !== null ? timeLeft / totalSeconds : 1;
  const timePercent = Math.max(
    0,
    Math.min(100, Number.isFinite(timeRatio) ? (timeRatio * 100).toFixed(0) : 100)
  );
  let timeBarColor = 'bg-emerald-500';
  if (timeRatio <= 0.5 && timeRatio > 0.2) timeBarColor = 'bg-amber-500';
  if (timeRatio <= 0.2) timeBarColor = 'bg-red-500';

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <motion.div 
          className="flex flex-col lg:flex-row gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Exam Content */}
          <div className="flex-1">
            {/* Header */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 mb-6 shadow-lg"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <motion.div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{exam?.subject?.charAt(0) || 'E'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {exam?.subject || 'Exam'}
                      </p>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{exam?.title}</h1>
                    </div>
                  </motion.div>
                </div>
                
                {/* Animated Timer */}
                <motion.div
                  className={`px-6 py-3 rounded-2xl font-mono text-lg font-bold transition-all duration-300 ${
                    warning 
                      ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 animate-pulse shadow-lg shadow-red-500/20' 
                      : timeRatio <= 0.5 
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
                        : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                  }`}
                  animate={{ scale: warning ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: warning ? Infinity : 0 }}
                >
                  <div className="flex items-center gap-2">
                    <HiClock className="w-5 h-5" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Progress Bars */}
            <div className="space-y-4 mb-6">
              {/* Timer Progress */}
              <motion.div 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-4 shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-gray-600 dark:text-gray-400">Time Remaining</span>
                  <span className={`${
                    timeRatio <= 0.2 ? 'text-red-600 dark:text-red-400' : 
                    timeRatio <= 0.5 ? 'text-amber-600 dark:text-amber-400' : 
                    'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {timePercent}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full transition-all duration-1000 ease-linear ${
                      timeRatio <= 0.2 ? 'bg-red-500' : 
                      timeRatio <= 0.5 ? 'bg-amber-500' : 
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${timePercent}%` }}
                    animate={{ width: `${timePercent}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </motion.div>

              {/* Questions Progress */}
              <motion.div 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-4 shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-blue-600 dark:text-blue-400">{progress}%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Question Card with Animation */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-8 shadow-lg mb-6"
              key={currentIndex}
              custom={direction}
              variants={questionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Question {currentIndex + 1} of {questions.length}
                  </p>
                  <motion.div 
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentIndex + 1}/{questions.length}
                  </motion.div>
                </div>
                
                <motion.h2 
                  className="text-xl font-bold text-gray-900 dark:text-white mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {current.questionText}
                </motion.h2>
                
                <div className="space-y-3">
                  {OPTIONS.map((opt, index) => (
                    <motion.label
                      key={opt}
                      variants={optionVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        answers[current.id] === opt
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="answer"
                          checked={answers[current.id] === opt}
                          onChange={() => saveAnswer(current.id, opt)}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          answers[current.id] === opt
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {answers[current.id] === opt && (
                            <motion.div 
                              className="w-2 h-2 bg-white rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {current[`option${opt.toUpperCase()}`]}
                        </span>
                      </div>
                      {answers[current.id] === opt && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <HiCheckCircle className="w-5 h-5 text-blue-500" />
                        </motion.div>
                      )}
                    </motion.label>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <motion.button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: currentIndex === 0 ? 1 : 1.05 }}
                whileTap={{ scale: currentIndex === 0 ? 1 : 0.95 }}
              >
                <HiChevronLeft className="w-5 h-5" />
                Previous
              </motion.button>
              
              {currentIndex < questions.length - 1 ? (
                <motion.button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                  <HiChevronRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  whileHover={{ scale: submitting ? 1 : 1.05 }}
                  whileTap={{ scale: submitting ? 1 : 0.95 }}
                >
                  {submitting ? (
                    <>
                      <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <HiCheckCircle className="w-5 h-5" />
                      Submit Exam
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:w-80 flex-shrink-0">
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <HiArrowPath className="w-5 h-5 text-blue-500" />
                Question Navigator
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => (
                  <motion.button
                    key={q.id}
                    onClick={() => handleQuestionClick(i)}
                    className={`w-12 h-12 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentIndex === i
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                        : answers[q.id]
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Current</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-900/30 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Answered</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Not Answered</span>
                </div>
              </div>
              
              <motion.div 
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                  Progress Update
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-500">
                  {Object.keys(answers).length} of {questions.length} questions answered
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
