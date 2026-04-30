import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examAPI, questionAPI } from '../../services/api';
import { motion } from 'framer-motion';
import { HiPlus, HiTrash, HiClock, HiQuestionMarkCircle, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function CreateExam() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 30,
    startTime: '',
    endTime: '',
    isLive: false
  });
  const [questions, setQuestions] = useState([
    { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleExamDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExamData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    ));
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    }]);
  };

  const removeQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!examData.title || !examData.duration) {
        setError('Please fill in all required exam details');
        return false;
      }
    } else if (step === 2) {
      const validQuestions = questions.filter(q => 
        q.questionText && q.optionA && q.optionB && q.optionC && q.optionD
      );
      if (validQuestions.length < 1) {
        setError('Please add at least one complete question');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setError('');
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setLoading(true);
    setError('');
    try {
      // Debug user data
      console.log('User data:', user);
      if (!user || !user.id) {
        throw new Error('User not authenticated or user ID missing');
      }
      
      // Create exam first
      const examPayload = {
        title: examData.title,
        description: examData.description,
        duration: parseInt(examData.duration),
        start_time: examData.startTime || null,
        end_time: examData.endTime || null,
        createdById: user.id
      };
      
      console.log('Exam payload:', examPayload);
      const { data: exam } = await examAPI.create(examPayload);
      
      // Add questions
      const validQuestions = questions.filter(q => 
        q.questionText && q.optionA && q.optionB && q.optionC && q.optionD
      );
      
      for (const question of validQuestions) {
        await questionAPI.add({
          examId: exam.id,
          questionText: question.questionText,
          optionA: question.optionA,
          optionB: question.optionB,
          optionC: question.optionC,
          optionD: question.optionD,
          correctAnswer: question.correctAnswer
        });
      }
      
      alert('Exam created successfully with questions!');
      navigate('/faculty/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              s <= step 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`w-8 h-1 mx-2 ${
                s < step ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium mb-2">Exam Title *</label>
        <input
          type="text"
          name="title"
          value={examData.title}
          onChange={handleExamDataChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
          required
          placeholder="e.g. Midterm Exam - Mathematics"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={examData.description}
          onChange={handleExamDataChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
          rows="3"
          placeholder="Enter exam description"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Duration (minutes) *</label>
          <div className="relative">
            <HiClock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="number"
              name="duration"
              value={examData.duration}
              onChange={handleExamDataChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
              min="1"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Total Questions</label>
          <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {questions.filter(q => q.questionText).length} questions added
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Time (Optional)</label>
          <input
            type="datetime-local"
            name="startTime"
            value={examData.startTime}
            onChange={handleExamDataChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">End Time (Optional)</label>
          <input
            type="datetime-local"
            name="endTime"
            value={examData.endTime}
            onChange={handleExamDataChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isLive"
          checked={examData.isLive}
          onChange={handleExamDataChange}
          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
        <label className="ml-2 text-sm font-medium">
          Make exam live immediately for students
        </label>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Add Questions</h3>
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <HiPlus /> Add Question
        </button>
      </div>
      
      {questions.map((question, index) => (
        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Question {index + 1}</h4>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-red-500 hover:text-red-700"
              >
                <HiTrash />
              </button>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Question Text *</label>
            <textarea
              value={question.questionText}
              onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
              rows="2"
              placeholder="Enter your question here..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Option A *</label>
              <input
                type="text"
                value={question.optionA}
                onChange={(e) => handleQuestionChange(index, 'optionA', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                placeholder="Option A"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Option B *</label>
              <input
                type="text"
                value={question.optionB}
                onChange={(e) => handleQuestionChange(index, 'optionB', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                placeholder="Option B"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Option C *</label>
              <input
                type="text"
                value={question.optionC}
                onChange={(e) => handleQuestionChange(index, 'optionC', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                placeholder="Option C"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Option D *</label>
              <input
                type="text"
                value={question.optionD}
                onChange={(e) => handleQuestionChange(index, 'optionD', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                placeholder="Option D"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Correct Answer *</label>
            <select
              value={question.correctAnswer}
              onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
              required
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>
        </div>
      ))}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold">Review & Create Exam</h3>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-medium text-purple-600">Exam Details</h4>
          <div className="mt-2 space-y-1">
            <p><strong>Title:</strong> {examData.title}</p>
            <p><strong>Description:</strong> {examData.description || 'No description'}</p>
            <p><strong>Duration:</strong> {examData.duration} minutes</p>
            <p><strong>Questions:</strong> {questions.filter(q => q.questionText).length}</p>
            <p><strong>Status:</strong> {examData.isLive ? 'Live' : 'Draft'}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-purple-600">Questions Preview</h4>
          <div className="mt-2 space-y-2">
            {questions.filter(q => q.questionText).map((q, i) => (
              <div key={i} className="text-sm">
                <p><strong>Q{i + 1}:</strong> {q.questionText.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Create New Exam
        </motion.h1>
        
        {renderStepIndicator()}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 rounded-xl">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
              )}
              
              <div className="ml-auto">
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Creating Exam...' : 'Create Exam'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
