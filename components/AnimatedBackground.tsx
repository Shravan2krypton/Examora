"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Primary floating orb */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-secondary/15 blur-[120px]"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary floating orb */}
      <motion.div 
        className="absolute top-[20%] right-[-10%] w-96 h-96 rounded-full bg-gradient-to-br from-accent/20 to-accent-purple/15 blur-[120px]"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      {/* Tertiary floating orb */}
      <motion.div 
        className="absolute bottom-[-10%] left-[20%] w-96 h-96 rounded-full bg-gradient-to-br from-accent-pink/20 to-accent-purple/15 blur-[120px]"
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />
      
      {/* Additional small floating particles */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/10 blur-[60px]"
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -15, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div 
        className="absolute top-3/4 right-1/3 w-24 h-24 rounded-full bg-accent/10 blur-[40px]"
        animate={{
          x: [0, -15, 20, 0],
          y: [0, 10, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-background/30" />
    </div>
  );
}
