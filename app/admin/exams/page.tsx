"use client";

import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Calendar, Clock, BookOpen, Award, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useState, useEffect } from "react";

export default function AdminExams() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "admin") {
      // Mock exam data
      const mockExams = [
        { id: "1", title: "Mathematics Final", subject: "Mathematics", duration: 120, totalMarks: 100 },
        { id: "2", title: "Physics Midterm", subject: "Physics", duration: 90, totalMarks: 80 },
      ];
      setExams(mockExams);
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

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative">
      <AnimatedBackground />
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar role="admin" />
        <main className="flex-grow p-8 max-w-7xl mx-auto w-full z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-black text-gradient mb-3 tracking-tight">Manage Exams</h1>
                <p className="text-foreground/60 text-lg font-medium">Create and manage examinations for students.</p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-panel px-6 py-3 rounded-2xl flex items-center space-x-3"
              >
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-bold text-gradient">{exams.length} Active</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
          >
            <div className="glass-panel p-6 rounded-3xl flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">{exams.length}</div>
                <div className="text-sm text-foreground/60">Total Exams</div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">
                  {exams.reduce((acc, exam) => acc + exam.duration, 0)}
                </div>
                <div className="text-sm text-foreground/60">Total Minutes</div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-accent-purple/20 to-accent-purple/10 rounded-2xl">
                <Award className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">
                  {exams.reduce((acc, exam) => acc + exam.totalMarks, 0)}
                </div>
                <div className="text-sm text-foreground/60">Total Marks</div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-accent-pink/20 to-accent-pink/10 rounded-2xl">
                <Plus className="w-6 h-6 text-accent-pink" />
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">+</div>
                <div className="text-sm text-foreground/60">Create New</div>
              </div>
            </div>
          </motion.div>

          {/* Exams List */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass-panel p-8 rounded-3xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Existing Exams</h2>
            <div className="space-y-4">
              {exams.length === 0 ? (
                <div className="text-center py-12 text-foreground/50">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No exams created yet</p>
                  <p className="text-sm mt-2">Create your first exam to get started</p>
                </div>
              ) : (
                exams.map((exam, index) => (
                  <motion.div 
                    key={exam.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-6 bg-foreground/5 rounded-2xl border border-foreground/10 hover:bg-foreground/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{exam.title}</h3>
                        <div className="flex items-center space-x-6 text-sm text-foreground/60">
                          <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary" /> {exam.subject}</span>
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-accent-cyan" /> {exam.duration} mins</span>
                          <span className="flex items-center"><Award className="w-4 h-4 mr-2 text-accent-purple" /> {exam.totalMarks} marks</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
