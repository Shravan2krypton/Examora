import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  HiAcademicCap, 
  HiUserGroup, 
  HiArrowRight,
  HiCheckCircle,
  HiClock,
  HiChartBar,
  HiShieldCheck,
  HiLightBulb,
  HiLightningBolt,
  HiSparkles,
  HiStar,
  HiDocumentText
} from 'react-icons/hi';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <HiSparkles className="w-4 h-4" />
                Modern Examination Platform
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Transform Your
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Learning Experience
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Experience the future of online examinations with AI-powered analytics, seamless performance, and beautiful design.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {user ? (
                  <Link 
                    to={user.role === 'student' ? '/student' : '/faculty'} 
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 group"
                  >
                    {user.role === 'student' ? 'Go to Dashboard' : 'Faculty Dashboard'}
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 group"
                    >
                      <HiUserGroup className="w-5 h-5" />
                      Get Started
                      <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/login" 
                      className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                      Faculty Login
                    </Link>
                  </>
                )}
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-8 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <HiStar className="w-5 h-5 text-amber-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">4.9 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiUserGroup className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">10K+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Secure</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Image/Illustration */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 lg:p-12 shadow-2xl">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl" />
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                      <HiDocumentText className="w-8 h-8 text-white mb-2" />
                      <p className="text-white font-semibold">500+</p>
                      <p className="text-white/70 text-sm">Exams</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                      <HiChartBar className="w-8 h-8 text-white mb-2" />
                      <p className="text-white font-semibold">98%</p>
                      <p className="text-white/70 text-sm">Success Rate</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                      <HiStar className="w-8 h-8 text-white mb-2" />
                      <p className="text-white font-semibold">24/7</p>
                      <p className="text-white/70 text-sm">Support</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                      <HiShieldCheck className="w-8 h-8 text-white mb-2" />
                      <p className="text-white font-semibold">100%</p>
                      <p className="text-white/70 text-sm">Secure</p>
                    </div>
                  </div>
                  
                  {user && (
                    <div className="mt-6 bg-white/30 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-white font-semibold mb-1">Welcome back, {user.name}!</p>
                      <p className="text-white/70 text-sm">{user.role} account</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <HiAcademicCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </motion.div>
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <HiSparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Powerful features designed to transform your examination experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: HiClock,
                title: "Real-time Monitoring",
                description: "Track exam progress with live updates and instant feedback",
                color: "bg-blue-500"
              },
              {
                icon: HiChartBar,
                title: "Advanced Analytics",
                description: "Comprehensive insights and performance metrics",
                color: "bg-green-500"
              },
              {
                icon: HiShieldCheck,
                title: "Secure Platform",
                description: "Enterprise-grade security for all examinations",
                color: "bg-purple-500"
              },
              {
                icon: HiLightBulb,
                title: "AI-Powered Insights",
                description: "Smart recommendations and personalized learning paths",
                color: "bg-amber-500"
              },
              {
                icon: HiLightningBolt,
                title: "Lightning Fast",
                description: "Optimized performance for seamless experience",
                color: "bg-red-500"
              },
              {
                icon: HiCheckCircle,
                title: "Easy to Use",
                description: "Intuitive interface designed for all users",
                color: "bg-indigo-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join thousands of students and educators already using Examora
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {user ? (
              <Link 
                to={user.role === 'student' ? '/student' : '/faculty'} 
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
              >
                Go to Dashboard
                <HiArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                >
                  Register Now
                  <HiArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
                >
                  Login
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}