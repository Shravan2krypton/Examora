"use client";

import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Admin } from "@/lib/models/Admin";
import { useAuth } from "@/hooks/useAuth";
import { Users, FileText, CheckSquare, TrendingUp, Calendar, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useState, useEffect } from "react";

import { DashboardStats } from "@/components/DashboardStats";
import { AdminQuestionBank } from "@/components/AdminQuestionBank";
import { AdminLeaderboard } from "@/components/AdminLeaderboard";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "admin") {
      // Simulate admin dashboard data for demo mode
      const mockData = {
        totalStudents: 156,
        totalExams: 45,
        activeExams: 8,
        averageScore: 78.5,
        recentActivity: [
          { id: 1, type: "exam", title: "Mathematics Final", time: "2 hours ago" },
          { id: 2, type: "student", title: "New student registered", time: "5 hours ago" },
          { id: 3, type: "result", title: "Physics quiz results available", time: "1 day ago" }
        ]
      };
      setData(mockData);
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

  if (!user || user.role !== "admin") {
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
        <Sidebar role="admin" />
        <main className="flex-grow p-8 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-black text-gradient mb-3 tracking-tight">Admin Dashboard</h1>
                <p className="text-foreground/60 text-lg font-medium">Welcome back, <span className="text-gradient">{user?.name || 'Admin'}</span>. Here's what's happening.</p>
              </div>
              
              {/* Quick stats */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="hidden lg:flex items-center space-x-6"
              >
                <div className="text-center">
                  <div className="text-2xl font-black text-primary">+12%</div>
                  <div className="text-xs text-foreground/50 uppercase tracking-wider">Growth</div>
                </div>
                <div className="w-px h-12 bg-foreground/20" />
                <div className="text-center">
                  <div className="text-2xl font-black text-accent">98%</div>
                  <div className="text-xs text-foreground/50 uppercase tracking-wider">Uptime</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Main KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <DashboardStats title="Total Students" value={data.totalStudents} icon={<Users className="w-6 h-6 text-primary" />} index={0} />
            <DashboardStats title="Total Exams" value={data.totalExams} icon={<FileText className="w-6 h-6 text-accent-cyan" />} index={1} />
            <DashboardStats title="Active Exams" value={data.activeExams} icon={<CheckSquare className="w-6 h-6 text-accent-purple" />} index={2} />
          </div>

          {/* Additional Dashboard Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-panel p-8 rounded-3xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item, index) => (
                  <motion.div 
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-foreground/5 transition-colors"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <div className="flex-grow">
                      <div className="text-sm font-medium text-foreground">New exam created</div>
                      <div className="text-xs text-foreground/50">{index + 1} hours ago</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="glass-panel p-8 rounded-3xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Quick Actions</h3>
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all group"
                >
                  <FileText className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-foreground">Create Exam</div>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all group"
                >
                  <CheckSquare className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-foreground">Add Question</div>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-gradient-to-br from-accent-purple/10 to-accent-purple/5 rounded-2xl border border-accent-purple/20 hover:border-accent-purple/40 transition-all group"
                >
                  <Users className="w-6 h-6 text-accent-purple mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-foreground">Manage Users</div>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-gradient-to-br from-accent-pink/10 to-accent-pink/5 rounded-2xl border border-accent-pink/20 hover:border-accent-pink/40 transition-all group"
                >
                  <Award className="w-6 h-6 text-accent-pink mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-foreground">View Results</div>
                </motion.button>
              </div>
            </motion.div>
          </div>
          
          {/* Question Bank and Leaderboard Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AdminQuestionBank />
            <AdminLeaderboard />
          </div>
        </main>
      </div>
    </div>
  );
}
