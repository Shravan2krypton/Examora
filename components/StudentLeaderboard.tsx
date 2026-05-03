"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Star, TrendingUp, Users, Award, Filter, Target, Zap } from "lucide-react";

export function StudentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFull, setShowFull] = useState(false);
  const [userRank, setUserRank] = useState<any>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Try to fetch real leaderboard data
        const response = await fetch('/api/leaderboard');
        const result = await response.json();
        
        if (result.success) {
          setLeaderboard(result.leaderboard);
          
          // Find current user's rank (mock for demo)
          const currentUserRank = {
            rank: 7,
            studentName: "You",
            score: 76,
            submissionTime: new Date(),
            examsAttempted: 4,
            averageScore: 75,
            isCurrentUser: true
          };
          setUserRank(currentUserRank);
        } else {
          // Fallback to demo data
          const mockLeaderboard = [
            { rank: 1, studentName: "Alice Johnson", score: 95, submissionTime: new Date(), examsAttempted: 8, averageScore: 94, trend: "up" },
            { rank: 2, studentName: "Bob Smith", score: 92, submissionTime: new Date(), examsAttempted: 7, averageScore: 91, trend: "up" },
            { rank: 3, studentName: "Carol Davis", score: 88, submissionTime: new Date(), examsAttempted: 6, averageScore: 87, trend: "down" },
            { rank: 4, studentName: "David Wilson", score: 85, submissionTime: new Date(), examsAttempted: 5, averageScore: 83, trend: "up" },
            { rank: 5, studentName: "Emma Brown", score: 82, submissionTime: new Date(), examsAttempted: 5, averageScore: 80, trend: "same" },
            { rank: 6, studentName: "Frank Miller", score: 79, submissionTime: new Date(), examsAttempted: 4, averageScore: 78, trend: "up" },
            { rank: 7, studentName: "You", score: 76, submissionTime: new Date(), examsAttempted: 4, averageScore: 75, trend: "up", isCurrentUser: true },
            { rank: 8, studentName: "Grace Lee", score: 73, submissionTime: new Date(), examsAttempted: 4, averageScore: 72, trend: "down" },
            { rank: 9, studentName: "Henry Taylor", score: 70, submissionTime: new Date(), examsAttempted: 3, averageScore: 68, trend: "up" },
            { rank: 10, studentName: "Ivy Chen", score: 67, submissionTime: new Date(), examsAttempted: 3, averageScore: 65, trend: "same" },
          ];
          setLeaderboard(mockLeaderboard);
          setUserRank(mockLeaderboard.find(entry => entry.isCurrentUser));
        }
      } catch (error) {
        console.log('Error fetching leaderboard:', error);
        // Use demo data as fallback
        const mockLeaderboard = [
          { rank: 1, studentName: "Alice Johnson", score: 95, submissionTime: new Date(), examsAttempted: 8, averageScore: 94, trend: "up" },
          { rank: 2, studentName: "Bob Smith", score: 92, submissionTime: new Date(), examsAttempted: 7, averageScore: 91, trend: "up" },
          { rank: 3, studentName: "Carol Davis", score: 88, submissionTime: new Date(), examsAttempted: 6, averageScore: 87, trend: "down" },
          { rank: 4, studentName: "David Wilson", score: 85, submissionTime: new Date(), examsAttempted: 5, averageScore: 83, trend: "up" },
          { rank: 5, studentName: "Emma Brown", score: 82, submissionTime: new Date(), examsAttempted: 5, averageScore: 80, trend: "same" },
          { rank: 6, studentName: "Frank Miller", score: 79, submissionTime: new Date(), examsAttempted: 4, averageScore: 78, trend: "up" },
          { rank: 7, studentName: "You", score: 76, submissionTime: new Date(), examsAttempted: 4, averageScore: 75, trend: "up", isCurrentUser: true },
        ];
        setLeaderboard(mockLeaderboard);
        setUserRank(mockLeaderboard.find(entry => entry.isCurrentUser));
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

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <Target className="w-4 h-4 text-foreground/40" />;
    }
  };

  const filteredLeaderboard = leaderboard.filter(entry => {
    if (selectedFilter === "top5") return entry.rank <= 5;
    if (selectedFilter === "top10") return entry.rank <= 10;
    if (selectedFilter === "around-you") return userRank && Math.abs(entry.rank - userRank.rank) <= 2;
    return true;
  });

  const displayLeaderboard = showFull ? filteredLeaderboard : filteredLeaderboard.slice(0, 5);

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Leaderboard</h3>
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
        <h3 className="text-xl font-bold text-foreground">Leaderboard</h3>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-foreground/60">{leaderboard.length} Students</span>
        </div>
      </div>

      {/* User's Rank Card */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(userRank.rank)}
              </div>
              <div>
                <div className="font-bold text-foreground">Your Rank: #{userRank.rank}</div>
                <div className="text-sm text-foreground/60">
                  Score: {userRank.score} • Exams: {userRank.examsAttempted}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(userRank.trend)}
              <div className="text-right">
                <div className="text-lg font-bold text-gradient">{userRank.score}</div>
                <div className="text-xs text-foreground/50">points</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Options */}
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={() => setSelectedFilter("all")}
          className={`px-3 py-1 rounded-xl text-sm transition-all ${
            selectedFilter === "all" 
              ? "bg-primary text-white" 
              : "bg-foreground/10 text-foreground/60 hover:bg-foreground/20"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedFilter("top5")}
          className={`px-3 py-1 rounded-xl text-sm transition-all ${
            selectedFilter === "top5" 
              ? "bg-primary text-white" 
              : "bg-foreground/10 text-foreground/60 hover:bg-foreground/20"
          }`}
        >
          Top 5
        </button>
        <button
          onClick={() => setSelectedFilter("around-you")}
          className={`px-3 py-1 rounded-xl text-sm transition-all ${
            selectedFilter === "around-you" 
              ? "bg-primary text-white" 
              : "bg-foreground/10 text-foreground/60 hover:bg-foreground/20"
          }`}
        >
          Around You
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {displayLeaderboard.map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 + index * 0.1 }}
            className={`flex items-center space-x-4 p-4 rounded-xl transition-all hover:bg-foreground/5 ${
              entry.rank <= 3 ? 'bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20' : 
              entry.isCurrentUser ? 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30' : 
              'bg-foreground/5'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8">
              {getRankIcon(entry.rank)}
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <span className={`font-medium text-foreground ${entry.isCurrentUser ? 'text-primary' : ''}`}>
                  {entry.studentName}
                </span>
                {entry.isCurrentUser && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">You</span>
                )}
                {entry.rank <= 3 && (
                  <div className="flex items-center space-x-1">
                    {[...Array(5 - entry.rank)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-foreground/60">
                <span>Score: {entry.score}</span>
                <span>•</span>
                <span>Exams: {entry.examsAttempted || 0}</span>
                <span>•</span>
                <span>Avg: {entry.averageScore || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getTrendIcon(entry.trend)}
              <div className="text-right">
                <div className="text-lg font-bold text-gradient">{entry.score}</div>
                <div className="text-xs text-foreground/50">points</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredLeaderboard.length > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => setShowFull(!showFull)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all mx-auto"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showFull ? 'Show Less' : `View All ${filteredLeaderboard.length} Students`}
            </span>
          </button>
        </motion.div>
      )}

      {/* Motivational Message */}
      {userRank && userRank.rank > 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="mt-6 p-4 bg-foreground/5 rounded-xl border border-foreground/10"
        >
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-sm font-medium text-foreground">Keep Going!</div>
              <div className="text-xs text-foreground/60">
                You're {userRank.rank > 1 ? userRank.rank - 1 : 0} points away from rank #{userRank.rank - 1}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
