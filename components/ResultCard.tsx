"use client";

import { CheckCircle, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

interface ResultData {
  id: string;
  score: number;
  totalMarks: number;
  passed: boolean;
  examTitle: string;
  date: Date;
}

export function ResultCard({ result }: { result: ResultData }) {
  const [animateScore, setAnimateScore] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const percentage = Math.round((result.score / result.totalMarks) * 100);
  const passed = percentage >= 40;

  useEffect(() => {
    // Trigger score animation after component mounts
    setTimeout(() => setAnimateScore(true), 300);
    
    if (passed) {
      setShowConfetti(true);
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }, [passed]);

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="max-w-2xl mx-auto glass-panel p-10 rounded-[3rem] shadow-glass-lg border border-white/20 text-center relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 rounded-full blur-xl" />
      
      {/* Status bar */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.5, duration: 1 }}
        className={`absolute top-0 left-0 h-3 ${passed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`} 
      />
      
      <div className="relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-gradient mb-4"
        >
          {passed ? '🎉 Excellent Work!' : '💪 Keep Practicing!'}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-foreground/60 font-medium mb-8"
        >
          Here's your performance breakdown for <span className="font-bold text-foreground">{result.examTitle}</span>
        </motion.p>

        {/* Animated Score Circle */}
        <div className="relative w-56 h-56 mx-auto mb-10">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-foreground/10" strokeWidth="8" />
            <motion.circle 
              cx="50" cy="50" r="45" fill="none" stroke="currentColor" 
              className={passed ? "text-green-500" : "text-red-500"} strokeWidth="8" 
              strokeDasharray={`${2 * Math.PI * 45}`} 
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: animateScore ? 2 * Math.PI * 45 * (1 - percentage / 100) : 2 * Math.PI * 45 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: animateScore ? 1 : 0, opacity: animateScore ? 1 : 0 }}
              transition={{ delay: animateScore ? 0.5 : 0, type: "spring", stiffness: 400 }}
              className="text-6xl font-black text-gradient"
            >
              {percentage}%
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: animateScore ? 0.8 : 0 }}
              className={`text-sm font-bold ${passed ? 'text-green-500' : 'text-red-500'}`}
            >
              {passed ? 'PASSED' : 'FAILED'}
            </motion.span>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="glass-panel p-4 rounded-2xl border border-foreground/10">
            <p className="text-xs font-bold text-foreground/50 uppercase mb-2">Score</p>
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: animateScore ? 1 : 0 }}
              transition={{ delay: animateScore ? 0.7 : 0, type: "spring", stiffness: 500 }}
              className="text-2xl font-black text-gradient"
            >
              {result.score} / {result.totalMarks}
            </motion.p>
          </div>
          
          <div className="glass-panel p-4 rounded-2xl border border-green-500/20 bg-green-500/5">
            <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-1">Correct</p>
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: animateScore ? 1 : 0 }}
              transition={{ delay: animateScore ? 0.8 : 0, type: "spring", stiffness: 500 }}
              className="text-xl font-black text-green-600 dark:text-green-400"
            >
              {Math.round((result.score / result.totalMarks) * 10)}
            </motion.p>
          </div>
          
          <div className="glass-panel p-4 rounded-2xl border border-red-500/20 bg-red-500/5">
            <XCircle className="w-5 h-5 text-red-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase mb-1">Wrong</p>
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: animateScore ? 1 : 0 }}
              transition={{ delay: animateScore ? 0.9 : 0, type: "spring", stiffness: 500 }}
              className="text-xl font-black text-red-600 dark:text-red-400"
            >
              {10 - Math.round((result.score / result.totalMarks) * 10)}
            </motion.p>
          </div>
          
          <div className="glass-panel p-4 rounded-2xl border border-primary/20 bg-primary/5">
            <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs font-bold text-primary uppercase mb-1">Date</p>
            <p className="text-sm font-bold text-primary">
              {new Date(result.date).toLocaleDateString()}
            </p>
          </div>
        </motion.div>
        
        {/* Action buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-4 mt-8"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-6 py-3 gradient-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25"
          >
            View Details
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-6 py-3 glass-panel border border-foreground/20 rounded-2xl font-bold hover:bg-foreground/10"
          >
            Download Report
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
