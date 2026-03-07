import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiPlus, 
  HiDocumentArrowUp, 
  HiChartBar, 
  HiTrophy,
  HiAcademicCap,
  HiClock,
  HiQuestionMarkCircle,
  HiEye,
  HiPencil,
  HiTrash,
  HiUsers
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { examAPI } from '../../services/api';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    activeExams: 0,
    totalStudents: 0,
    avgScore: 0
  });
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    examAPI.getAll().then(({ data }) => {
      setExams(data);
      // Calculate stats
      setStats({
        totalExams: data.length,
        activeExams: data.filter(e => {
          const now = new Date();
          return new Date(e.startDate) <= now && new Date(e.endDate) >= now;
        }).length,
        totalStudents: 156, // Mock data - in real app, fetch from API
        avgScore: 78 // Mock data - in real app, calculate from results
      });
    });
  }, []);

  const myExams = exams.filter((e) => e.createdById === user?.id || e.createdBy?.id === user?.id);

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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        // Navigate to upload page with file
        window.location.href = '/faculty/upload-questionbank';
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
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
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <HiAcademicCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Welcome, Professor {user?.name || 'Faculty'}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Create engaging exams and monitor student progress
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                <HiUsers className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Active Students
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalStudents} Enrolled
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
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <HiDocumentArrowUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalExams}</span>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Exams</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Created by you</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <HiClock className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeExams}</span>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Active Exams</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Currently running</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <HiUsers className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</span>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Students</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enrolled in courses</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <HiChartBar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgScore}%</span>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Class Average</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overall performance</p>
          </motion.div>
        </motion.div>

        {/* Action Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link 
              to="/faculty/create-exam" 
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 block shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <HiPlus className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Create Exam</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Design comprehensive exams with custom questions</p>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium group-hover:text-emerald-700 transition-colors">
                Create New Exam
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Link 
              to="/faculty/upload-questionbank" 
              className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 block shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${
                dragActive ? 'ring-4 ring-emerald-500/50 bg-emerald-50/50' : ''
              }`}
            >
              {dragActive && (
                <motion.div 
                  className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center">
                    <HiDocumentArrowUp className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                    <p className="text-emerald-700 font-medium">Drop PDF here</p>
                  </div>
                </motion.div>
              )}
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <HiDocumentArrowUp className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Question Bank</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Drag & drop PDF files or browse to upload</p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 transition-colors">
                Upload PDF
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <HiChartBar className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">View detailed performance analytics</p>
              <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 transition-colors">
                View Analytics
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* My Exams Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HiDocumentArrowUp className="w-6 h-6 text-emerald-600" />
              My Exams
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              {myExams.length} exams created
            </div>
          </div>
          
          {myExams.length === 0 ? (
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-12 shadow-lg text-center"
              variants={itemVariants}
            >
              <HiDocumentArrowUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No exams yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first exam to get started</p>
              <Link 
                to="/faculty/create-exam" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                <HiPlus className="w-5 h-5 mr-2" />
                Create Your First Exam
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              className="grid gap-6"
              variants={containerVariants}
            >
              {myExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  variants={itemVariants}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{exam.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{exam.subject}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            new Date(exam.startDate) <= new Date() && new Date(exam.endDate) >= new Date()
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {new Date(exam.startDate) <= new Date() && new Date(exam.endDate) >= new Date() ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <HiQuestionMarkCircle className="w-4 h-4" />
                          <span>{exam._count?.questions || 0} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiClock className="w-4 h-4" />
                          <span>{exam.timeLimit} minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiUsers className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 50) + 10} students</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to={`/faculty/exam/${exam.id}/questions`}
                          className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                        >
                          <HiPencil className="w-4 h-4 mr-2" />
                          Edit Questions
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to={`/faculty/exam/${exam.id}/results`}
                          className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors duration-200"
                        >
                          <HiChartBar className="w-4 h-4 mr-2" />
                          View Results
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to={`/leaderboard/${exam.id}`}
                          className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200"
                        >
                          <HiTrophy className="w-4 h-4 mr-2" />
                          Leaderboard
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
