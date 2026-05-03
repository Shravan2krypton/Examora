"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Timer, AlertTriangle } from "lucide-react";

export function ExamTimer({ durationMins, submissionId }: { durationMins: number, submissionId: string }) {
  const [timeLeft, setTimeLeft] = useState(durationMins * 60);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      const form = document.getElementById("exam-form") as HTMLFormElement;
      if (form) form.requestSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        // Start pulsing when less than 5 minutes
        if (newTime <= 300 && newTime > 0 && !isPulsing) {
          setIsPulsing(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPulsing]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isLowTime = timeLeft > 0 && timeLeft < 300;
  const isCriticalTime = timeLeft > 0 && timeLeft < 60;

  return (
    <>
      {/* Main Timer */}
      <motion.div 
        initial={{ y: -100, opacity: 0, scale: 0.8 }}
        animate={{ 
          y: 0, 
          opacity: 1, 
          scale: isPulsing ? [1, 1.05, 1] : 1
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 20,
          scale: {
            repeat: isPulsing ? Infinity : 0,
            duration: 1,
            ease: "easeInOut"
          }
        }}
        className={`fixed top-24 right-8 z-50 glass-panel px-6 py-4 rounded-3xl flex items-center space-x-4 shadow-glass-lg border transition-all duration-300 ${
          isCriticalTime 
            ? 'border-red-500/50 bg-red-500/10 shadow-red-500/25' 
            : isLowTime 
            ? 'border-amber-500/50 bg-amber-500/10 shadow-amber-500/25' 
            : 'border-white/20'
        }`}
      >
        {/* Timer Icon */}
        <motion.div 
          animate={{
            rotate: isPulsing ? [0, 5, -5, 0] : 0,
            scale: isPulsing ? [1, 1.2, 1] : 1
          }}
          transition={{
            duration: isPulsing ? 0.5 : 0.3,
            repeat: isPulsing ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {isCriticalTime ? (
            <AlertTriangle className={`w-6 h-6 ${isCriticalTime ? 'text-red-500' : isLowTime ? 'text-amber-500' : 'text-primary'}`} />
          ) : (
            <Timer className={`w-6 h-6 ${isCriticalTime ? 'text-red-500' : isLowTime ? 'text-amber-500' : 'text-primary'}`} />
          )}
        </motion.div>
        
        {/* Time Display */}
        <div className="flex flex-col">
          <span className={`text-2xl font-black font-mono tracking-wider ${
            isCriticalTime 
              ? 'text-red-500' 
              : isLowTime 
              ? 'text-amber-500' 
              : 'text-foreground'
          }`}>
            {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
          </span>
          <span className={`text-xs font-medium ${
            isCriticalTime 
              ? 'text-red-400' 
              : isLowTime 
              ? 'text-amber-400' 
              : 'text-foreground/50'
          }`}>
            {isCriticalTime ? 'Time Critical!' : isLowTime ? 'Hurry Up!' : 'Time Remaining'}
          </span>
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-12 h-12">
          <svg className="transform -rotate-90 w-12 h-12">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-foreground/20"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - timeLeft / (durationMins * 60))}`}
              className={`${
                isCriticalTime 
                  ? 'text-red-500' 
                  : isLowTime 
                  ? 'text-amber-500' 
                  : 'text-primary'
              }`}
              animate={{
                strokeDashoffset: `${2 * Math.PI * 20 * (1 - timeLeft / (durationMins * 60))}`
              }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
        </div>
      </motion.div>
      
      {/* Warning Overlay for Critical Time */}
      {isCriticalTime && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 z-50"
        />
      )}
      
      {/* Low Time Warning Banner */}
      {isLowTime && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-0 left-0 right-0 z-40 p-4 text-center ${
            isCriticalTime 
              ? 'bg-red-500/10 border-b border-red-500/30' 
              : 'bg-amber-500/10 border-b border-amber-500/30'
          } backdrop-blur-sm`}
        >
          <div className="flex items-center justify-center space-x-3">
            {isCriticalTime ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : (
              <Timer className="w-5 h-5 text-amber-500" />
            )}
            <span className={`font-bold ${
              isCriticalTime ? 'text-red-500' : 'text-amber-500'
            }`}>
              {isCriticalTime 
                ? `Critical: Less than 1 minute remaining!` 
                : `Warning: Less than 5 minutes remaining!`
              }
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
}
