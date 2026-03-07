import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiDocumentText, 
  HiChartBar, 
  HiBookOpen, 
  HiTrophy,
  HiClock,
  HiFire,
  HiAcademicCap
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const [stats, setStats] = useState({
    completedExams: 0,
    averageScore: 0,
    totalQuestions: 0,
    rank: 0
  });

  useEffect(() => {
    // Simulate stats loading - in real app, fetch from API
    setStats({
      completedExams: 5,
      averageScore: 85,
      totalQuestions: 120,
      rank: 3
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-8 md:py-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
          variants={itemVariants}
        >
          <div>
            <motion.div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <HiAcademicCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name || 'Student'}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Track your progress and excel in your exams
                </p>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-4 shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <HiFire className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Current Streak
                </p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  7 Days 🔥
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <HiDocumentText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedExams}</span>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Completed Exams</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Keep up the great work!</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <HiChartBar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageScore}%</span>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Average Score</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Above average performance</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <HiBookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuestions}</span>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Questions Answered</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total practice completed</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <HiTrophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">#{stats.rank}</span>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Current Rank</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Top performer!</p>
          </motion.div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-2 mb-8 shadow-lg"
          variants={itemVariants}
        >
          <div className="flex flex-wrap gap-2">
            {['overview', 'exams', 'results', 'resources'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab === 'overview' && '📊'}
                {tab === 'exams' && '📝'}
                {tab === 'results' && '📈'}
                {tab === 'resources' && '📚'}
                <span className="ml-2">{tab}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content based on active tab */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {activeTab === 'overview' && (
            <>
              <motion.div variants={itemVariants}>
                <Link 
                  to="/student/exams" 
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 block shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <HiDocumentText className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Available Exams</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Take timed exams and test your knowledge</p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 transition-colors">
                    Start Exam
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link 
                  to="/student/results" 
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 block shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <HiChartBar className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">My Results</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">View your scores and track your progress</p>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-medium group-hover:text-green-700 transition-colors">
                    View Results
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link 
                  to="/student/question-banks" 
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 block shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <HiBookOpen className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Question Banks</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Access PDF study materials and practice</p>
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 transition-colors">
                    Study Materials
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            </>
          )}

          {activeTab === 'exams' && (
            <motion.div variants={itemVariants} className="col-span-full">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-8 shadow-lg text-center">
                <HiDocumentText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Exam Management</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">View and take available exams, track your progress</p>
                <Link 
                  to="/student/exams" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  View All Exams
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'results' && (
            <motion.div variants={itemVariants} className="col-span-full">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-8 shadow-lg text-center">
                <HiChartBar className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Performance Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Detailed analysis of your exam results and progress</p>
                <Link 
                  to="/student/results" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  View Results
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div variants={itemVariants} className="col-span-full">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-8 shadow-lg text-center">
                <HiBookOpen className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Study Resources</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Access question banks, PDFs, and study materials</p>
                <Link 
                  to="/student/question-banks" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  Browse Resources
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
