"use client";

import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { PDFList } from "@/components/PDFViewer";
import { DashboardLeaderboard } from "@/components/DashboardLeaderboard";
import { StudentQuestionBank } from "@/components/StudentQuestionBank";
import { StudentLeaderboard } from "@/components/StudentLeaderboard";
import { motion } from "framer-motion";
import { FileText, CheckCircle, TrendingUp, Clock, Award, Calendar, BookOpen, Target } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useState, useEffect } from "react";

import { DashboardStats } from "@/components/DashboardStats";

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "student") {
      // Simulate student dashboard data
      setData({
        totalExamsAvailable: 5,
        examsAttempted: 3,
        averageScore: 85
      });
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent relative">
        <AnimatedBackground />
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 bg-foreground/10 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== "student") {
    return null; // Will redirect in useEffect
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent relative">
        <AnimatedBackground />
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 bg-foreground/10 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative">
      <AnimatedBackground />
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar role="student" />
        <main className="flex-grow p-8 z-10">
          {/* Personalized Welcome */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-5xl font-black text-gradient mb-3 tracking-tight">
                      Welcome back, <span className="text-gradient-warm">{user?.name || 'Student'}</span>! 👋
                    </h1>
                    <p className="text-foreground/60 text-lg font-medium">
                      Ready to crush your next exam? You've got this! 🚀
                    </p>
                    
                    {/* Personalized greeting based on time */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-primary">
                        {new Date().getHours() < 12 ? 'Good morning!' : new Date().getHours() < 18 ? 'Good afternoon!' : 'Good evening!'}
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Achievement badge */}
                  <motion.div 
                    initial={{ opacity: 0, rotate: -10 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
                    className="hidden lg:block"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full flex items-center justify-center border-2 border-yellow-400/30">
                      <Award className="w-10 h-10 text-yellow-500" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            <DashboardStats title="Available Exams" value={data.totalExamsAvailable} icon={<FileText className="w-6 h-6 text-primary" />} index={0} />
            <DashboardStats title="Exams Attempted" value={data.examsAttempted} icon={<CheckCircle className="w-6 h-6 text-accent-cyan" />} index={1} />
            <DashboardStats title="Average Score" value={85} icon={<TrendingUp className="w-6 h-6 text-accent-purple" />} index={2} />
            <DashboardStats title="Study Streak" value={7} icon={<Target className="w-6 h-6 text-accent-pink" />} index={3} />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Exams */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Upcoming Exams Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="glass-panel p-8 rounded-3xl border border-white/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground">Upcoming Exams</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-foreground/60">3 Active</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Mathematics Final", subject: "Mathematics", time: "In 2 days", duration: "60 mins", progress: 65 },
                    { title: "Physics Midterm", subject: "Physics", time: "In 5 days", duration: "90 mins", progress: 45 },
                    { title: "Chemistry Quiz", subject: "Chemistry", time: "In 1 week", duration: "45 mins", progress: 30 },
                  ].map((exam, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-4 bg-foreground/5 rounded-2xl border border-foreground/10 hover:bg-foreground/10 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-foreground mb-1">{exam.title}</h4>
                          <div className="flex items-center space-x-3 text-sm text-foreground/60">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {exam.duration}
                            </span>
                            <span>•</span>
                            <span>{exam.subject}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-primary mb-1">{exam.time}</div>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold"
                          >
                            Start Exam
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Progress bar for preparation */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-foreground/50 mb-1">
                          <span>Preparation Progress</span>
                          <span>{exam.progress}%</span>
                        </div>
                        <div className="w-full bg-foreground/10 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${exam.progress}%` }}
                            transition={{ delay: 0.8, duration: 1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Question Bank Section */}
              <StudentQuestionBank />
            </motion.div>

            {/* Right Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-8"
            >
              {/* Recent Achievements */}
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-gradient mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {[
                    { icon: Award, title: "Top Scorer", desc: "Physics Quiz", color: "text-yellow-500" },
                    { icon: Target, title: "Perfect Score", desc: "Math Test", color: "text-green-500" },
                    { icon: TrendingUp, title: "7 Day Streak", desc: "Daily Practice", color: "text-primary" },
                  ].map((achievement, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-foreground/5 rounded-xl"
                    >
                      <div className={`w-10 h-10 bg-foreground/10 rounded-xl flex items-center justify-center`}>
                        <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-foreground text-sm">{achievement.title}</div>
                        <div className="text-xs text-foreground/50">{achievement.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Enhanced Leaderboard */}
              <StudentLeaderboard />
              
              {/* Quick Actions */}
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-gradient mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 hover:border-primary/40 transition-all text-left"
                  >
                    <div className="font-medium text-foreground">View All Exams</div>
                    <div className="text-xs text-foreground/50">Browse available tests</div>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-3 bg-gradient-to-r from-accent/10 to-accent-purple/10 rounded-xl border border-accent/20 hover:border-accent/40 transition-all text-left"
                  >
                    <div className="font-medium text-foreground">Study Materials</div>
                    <div className="text-xs text-foreground/50">Access resources</div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
