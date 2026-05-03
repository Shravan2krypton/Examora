"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Star, TrendingUp, Eye } from "lucide-react";

export function DashboardLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Try to fetch real leaderboard data
        const response = await fetch('/api/leaderboard');
        const result = await response.json();
        
        if (result.success) {
          setLeaderboard(result.leaderboard);
        } else {
          // Fallback to demo data
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
        }
      } catch (error) {
        console.log('Error fetching leaderboard:', error);
        // Use demo data as fallback
        const mockLeaderboard = [
          { rank: 1, studentName: "Alice Johnson", score: 95, submissionTime: new Date() },
          { rank: 2, studentName: "Bob Smith", score: 92, submissionTime: new Date() },
          { rank: 3, studentName: "Carol Davis", score: 88, submissionTime: new Date() },
          { rank: 4, studentName: "David Wilson", score: 85, submissionTime: new Date() },
          { rank: 5, studentName: "Emma Brown", score: 82, submissionTime: new Date() },
        ];
        setLeaderboard(mockLeaderboard);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-foreground/60">{rank}</span>;
    }
  };

  const displayLeaderboard = showFull ? leaderboard : leaderboard.slice(0, 5);

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Top Performers</h3>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-foreground/5 rounded-xl">
              <div className="w-8 h-8 bg-foreground/10 rounded-full animate-pulse" />
              <div className="flex-grow">
                <div className="h-4 bg-foreground/10 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-foreground/10 rounded w-1/2 animate-pulse" />
              </div>
              <div className="w-12 h-6 bg-foreground/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="glass-panel p-8 rounded-3xl border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Top Performers</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-foreground/60">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {displayLeaderboard.map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 + index * 0.1 }}
            className={`flex items-center space-x-4 p-4 rounded-xl transition-all hover:bg-foreground/5 ${
              entry.rank <= 3 ? 'bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20' : 'bg-foreground/5'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8">
              {getRankIcon(entry.rank)}
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">{entry.studentName}</span>
                {entry.rank <= 3 && (
                  <div className="flex items-center space-x-1">
                    {[...Array(5 - entry.rank)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                )}
              </div>
              <div className="text-sm text-foreground/60">
                Score: {entry.score} points
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gradient">{entry.score}</div>
              <div className="text-xs text-foreground/50">points</div>
            </div>
          </motion.div>
        ))}
      </div>

      {leaderboard.length > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => setShowFull(!showFull)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all mx-auto"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showFull ? 'Show Less' : `View All ${leaderboard.length} Students`}
            </span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
