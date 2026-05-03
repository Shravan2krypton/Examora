"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function DashboardStats({ title, value, icon, index = 0 }: { title: string, value: number, icon: React.ReactNode, index?: number }) {
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ 
        y: -8, 
        scale: 1.03,
        boxShadow: "0 20px 60px rgba(99, 102, 241, 0.2)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-panel p-8 rounded-3xl shadow-glass border border-white/20 flex items-center space-x-6 cursor-pointer group relative overflow-hidden"
    >
      {/* Background gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Floating particles */}
      <motion.div 
        className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.2,
        }}
      />
      <motion.div 
        className="absolute bottom-4 left-4 w-2 h-2 bg-accent rounded-full"
        animate={{
          y: [0, -8, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.2 + 0.5,
        }}
      />
      
      {/* Icon container */}
      <motion.div 
        className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl shadow-inner relative z-10"
        whileHover={{ 
          scale: 1.15, 
          rotate: 5,
          boxShadow: "0 10px 30px rgba(99, 102, 241, 0.2)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {icon}
      </motion.div>
      
      {/* Content */}
      <div className="flex-grow relative z-10">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="text-sm font-black text-foreground/50 uppercase tracking-wider mb-2"
        >
          {title}
        </motion.p>
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70"
        >
          {count.toLocaleString()}
        </motion.h3>
        
        {/* Progress bar */}
        <motion.div 
          className="mt-3 h-1 bg-foreground/10 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (value / 100) * 100)}%` }}
            transition={{ delay: 0.6 + index * 0.1, duration: 1 }}
          />
        </motion.div>
      </div>
      
      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl" />
        </motion.div>
      )}
    </motion.div>
  );
}
