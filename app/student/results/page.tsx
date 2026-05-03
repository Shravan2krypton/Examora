"use client";

import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Trophy, TrendingUp, Calendar, Award } from "lucide-react";
import { useState, useEffect } from "react";

import { ResultCard } from "@/components/ResultCard";

export default function StudentResults() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [myResults, setMyResults] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "student") {
      // Simulate fetching results - in production, this would be an API call
      const mockResults = [
        {
          id: "1",
          score: 85,
          totalMarks: 100,
          passed: true,
          examTitle: "Physics Midterm",
          date: new Date()
        },
        {
          id: "2",
          score: 92,
          totalMarks: 100,
          passed: true,
          examTitle: "Mathematics Final",
          date: new Date()
        }
      ];
      setMyResults(mockResults);
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

  // Calculate stats
  const averageScore = myResults.length > 0 
    ? Math.round(myResults.reduce((acc, r) => acc + (r.score / r.totalMarks) * 100, 0) / myResults.length)
    : 0;
  const passedCount = myResults.filter(r => r.passed).length;
  const totalExams = myResults.length;

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative">
      <AnimatedBackground />
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar role="student" />
        <main className="flex-grow p-8 max-w-6xl mx-auto w-full z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-black text-gradient mb-3 tracking-tight">My Results</h1>
                <p className="text-foreground/60 text-lg font-medium">Track your exam performance and progress over time.</p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-panel px-6 py-3 rounded-2xl flex items-center space-x-3"
              >
                <Trophy className="w-5 h-5 text-primary" />
                <span className="font-bold text-gradient">{totalExams} Exams</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <div className="glass-panel p-6 rounded-3xl flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">{averageScore}%</div>
                <div className="text-sm text-foreground/50 font-medium">Average Score</div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">{passedCount}/{totalExams}</div>
                <div className="text-sm text-foreground/50 font-medium">Exams Passed</div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">
                  {totalExams > 0 ? Math.round((passedCount / totalExams) * 100) : 0}%
                </div>
                <div className="text-sm text-foreground/50 font-medium">Success Rate</div>
              </div>
            </div>
          </motion.div>

          {/* Results Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gradient">Exam History</h2>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground/50">Most recent first</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {myResults.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full glass-panel p-16 rounded-3xl text-center border border-white/20"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gradient mb-3">No Results Yet</h3>
                  <p className="text-foreground/60 font-medium mb-6">Complete your first exam to see your results here.</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 gradient-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25"
                  >
                    Browse Available Exams
                  </motion.button>
                </motion.div>
              ) : (
                myResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                  >
                    <ResultCard result={result} />
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
