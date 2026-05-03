"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown, Star, TrendingUp } from "lucide-react";

export function LeaderboardTable({ results }: { results: any[] }) {
  if (!results || results.length === 0) return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-16 glass-panel rounded-3xl"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Trophy className="w-10 h-10 text-primary" />
      </div>
      <p className="text-foreground/50 font-medium">No results available yet. Check back later!</p>
    </motion.div>
  );

  const top3 = results.slice(0, 3);
  const rest = results.slice(3);

  return (
    <div className="w-full max-w-5xl mx-auto relative">
      {/* Podium for Top 3 */}
      <div className="flex justify-center items-end h-80 mb-16 space-x-2 md:space-x-8">
        {/* 2nd Place */}
        {top3[1] && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            className="flex flex-col items-center w-1/3 max-w-xs"
          >
            {/* Floating particles */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-slate-400 rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{ left: `${i * 10 - 10}px` }}
                />
              ))}
            </div>
            
            <div className="text-center mb-6 relative z-10">
              <Medal className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xl font-black text-foreground truncate w-28 md:w-36">{top3[1].studentName}</p>
              <p className="text-2xl font-black text-gradient">{top3[1].score} pts</p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-full h-36 bg-gradient-to-t from-slate-400/20 to-slate-300/10 dark:from-slate-700/40 dark:to-slate-600/20 rounded-t-3xl border-t-4 border-slate-400 relative flex justify-center shadow-2xl shadow-slate-400/20"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-slate-400 rounded-full flex items-center justify-center border-4 border-background">
                <span className="text-2xl font-black text-white">2</span>
              </div>
              <span className="text-6xl font-black text-slate-400/20 mt-8">2</span>
            </motion.div>
          </motion.div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <motion.div 
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
            className="flex flex-col items-center w-1/3 max-w-xs z-10"
          >
            {/* Crown and particles */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-12 h-12 text-yellow-500" />
              </motion.div>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{ left: `${i * 8 - 16}px`, top: '20px' }}
                />
              ))}
            </div>
            
            <div className="text-center mb-6 relative z-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
              </motion.div>
              <p className="text-2xl font-black text-gradient truncate w-32 md:w-40">{top3[0].studentName}</p>
              <p className="text-3xl font-black text-gradient">{top3[0].score} pts</p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-full h-48 bg-gradient-to-t from-yellow-500/20 to-yellow-300/10 dark:from-yellow-900/40 dark:to-yellow-700/20 rounded-t-3xl border-t-4 border-yellow-500 relative flex justify-center shadow-2xl shadow-yellow-500/30"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-background shadow-lg shadow-yellow-500/50">
                <span className="text-3xl font-black text-white">1</span>
              </div>
              <span className="text-7xl font-black text-yellow-500/20 mt-10">1</span>
            </motion.div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0 }}
            className="flex flex-col items-center w-1/3 max-w-xs"
          >
            {/* Floating particles */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-amber-600 rounded-full"
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                  style={{ left: `${i * 12 - 6}px` }}
                />
              ))}
            </div>
            
            <div className="text-center mb-6 relative z-10">
              <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-xl font-black text-foreground truncate w-28 md:w-36">{top3[2].studentName}</p>
              <p className="text-2xl font-black text-gradient">{top3[2].score} pts</p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-full h-28 bg-gradient-to-t from-amber-600/20 to-amber-500/10 dark:from-amber-800/40 dark:to-amber-700/20 rounded-t-3xl border-t-4 border-amber-600 relative flex justify-center shadow-2xl shadow-amber-600/20"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center border-4 border-background">
                <span className="text-2xl font-black text-white">3</span>
              </div>
              <span className="text-5xl font-black text-amber-600/20 mt-6">3</span>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Rest of the List */}
      <div className="space-y-3">
        {rest.map((result, i) => (
          <motion.div 
            key={result.id} 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.6 + (i * 0.05) }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-white/10 hover:bg-foreground/5 transition-all group cursor-pointer"
          >
            <div className="flex items-center space-x-6">
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center border border-primary/30"
              >
                <span className="text-lg font-black text-gradient">{i + 4}</span>
              </motion.div>
              <div>
                <p className="font-bold text-foreground/90 text-lg">{result.studentName}</p>
                <p className="text-sm text-foreground/50">{result.examTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-right">
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + (i * 0.05), type: "spring", stiffness: 500 }}
                  className="font-black text-primary text-2xl"
                >
                  {result.score}
                </motion.p>
                <p className="text-xs text-foreground/50">Score</p>
              </div>
              
              <div className="text-right hidden sm:block w-24">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <p className="font-bold text-foreground/80">{Math.round(result.timeTaken / 60)}m</p>
                </div>
                <p className="text-xs text-foreground/50">Time</p>
              </div>
              
              {/* Trend indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + (i * 0.05) }}
                className="flex items-center space-x-1"
              >
                {i % 3 === 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : i % 3 === 1 ? (
                  <div className="w-4 h-4 bg-foreground/20 rounded-full" />
                ) : (
                  <Star className="w-4 h-4 text-accent-purple" />
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
