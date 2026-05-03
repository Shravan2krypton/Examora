"use client";

import { Navbar } from "@/components/Navbar";
import { LeaderboardService } from "@/lib/services/LeaderboardService";
import { Trophy, Crown, Star, TrendingUp } from "lucide-react";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useState, useEffect } from "react";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Try to fetch real leaderboard data
        const lbService = new LeaderboardService();
        const data = await lbService.generateLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.log('Database not available, using demo data:', err);
        setError('Database not available - showing demo data');
        
        // Fallback to demo data if database isn't set up
        const mockLeaderboard = [
          { rank: 1, studentName: "Alice Johnson", score: 95, submissionTime: new Date() },
          { rank: 2, studentName: "Bob Smith", score: 92, submissionTime: new Date() },
          { rank: 3, studentName: "Carol Davis", score: 88, submissionTime: new Date() },
          { rank: 4, studentName: "David Wilson", score: 85, submissionTime: new Date() },
          { rank: 5, studentName: "Emma Brown", score: 82, submissionTime: new Date() },
          { rank: 6, studentName: "Frank Miller", score: 79, submissionTime: new Date() },
          { rank: 7, studentName: "Grace Lee", score: 76, submissionTime: new Date() },
          { rank: 8, studentName: "Henry Taylor", score: 73, submissionTime: new Date() },
          { rank: 9, studentName: "Ivy Chen", score: 70, submissionTime: new Date() },
          { rank: 10, studentName: "Jack Wilson", score: 67, submissionTime: new Date() },
        ];
        setLeaderboard(mockLeaderboard);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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
      <main className="flex-grow p-8 max-w-6xl mx-auto w-full z-10">
        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-2xl"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{error}</span>
            </div>
          </motion.div>
        )}
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg shadow-yellow-500/30"
            >
              <Trophy className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gradient mb-4">
            Global Leaderboard
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Top performers across all exams. Rankings updated in real-time based on actual exam results.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="glass-panel p-6 rounded-3xl border border-white/20 text-center">
            <div className="text-3xl font-black text-gradient mb-2">{leaderboard.length}</div>
            <div className="text-sm text-foreground/60 font-medium">Total Participants</div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/20 text-center">
            <div className="text-3xl font-black text-gradient mb-2">
              {leaderboard.length > 0 ? Math.max(...leaderboard.map(l => l.score)) : 0}%
            </div>
            <div className="text-sm text-foreground/60 font-medium">Highest Score</div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/20 text-center">
            <div className="text-3xl font-black text-gradient mb-2">
              {leaderboard.length > 0 ? Math.round(leaderboard.reduce((acc, l) => acc + l.score, 0) / leaderboard.length) : 0}%
            </div>
            <div className="text-sm text-foreground/60 font-medium">Average Score</div>
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-panel p-8 rounded-3xl border border-white/20 overflow-hidden"
        >
          <LeaderboardTable results={leaderboard} />
        </motion.div>
      </main>
    </div>
  );
}
