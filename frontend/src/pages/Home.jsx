import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { HiAcademicCap, HiUserGroup, HiArrowRight } from 'react-icons/hi';

export default function Home() {
  const { user } = useAuth();
  
  console.log('Home component is rendering, user:', user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <HiAcademicCap className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Online Examination System
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Experience modern examinations with beautiful UI and seamless performance
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {user ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div className="text-left">
                    <p className="text-green-600 font-semibold">Welcome back!</p>
                    <p className="text-gray-700">{user.name} ({user.role})</p>
                  </div>
                </div>
                <Link 
                  to={user.role === 'student' ? '/student/exams' : '/faculty'} 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  {user.role === 'student' ? 'Student Dashboard' : 'Faculty Dashboard'}
                  <HiArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 group"
                >
                  <HiUserGroup className="w-5 h-5" />
                  Register as Student
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-medium border-2 border-indigo-200 hover:bg-indigo-50 transition-all duration-200"
                >
                  Faculty Login
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}