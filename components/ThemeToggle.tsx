"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference and localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Update DOM
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-full bg-foreground/10" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-12 h-12 rounded-full glass-panel border border-white/20 flex items-center justify-center overflow-hidden group"
    >
      {/* Background gradient that changes with theme */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br"
        animate={{
          background: isDark 
            ? "linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(139, 92, 246) 100%)"
            : "linear-gradient(135deg, rgb(251, 146, 60) 0%, rgb(254, 215, 170) 100%)"
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Icons */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative z-10"
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-white" />
        ) : (
          <Sun className="w-5 h-5 text-white" />
        )}
      </motion.div>
      
      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Theme indicator dots */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
        <motion.div
          animate={{ 
            scale: isDark ? 1 : 0.5,
            opacity: isDark ? 1 : 0.3
          }}
          transition={{ duration: 0.3 }}
          className="w-1 h-1 bg-primary rounded-full"
        />
        <motion.div
          animate={{ 
            scale: !isDark ? 1 : 0.5,
            opacity: !isDark ? 1 : 0.3
          }}
          transition={{ duration: 0.3 }}
          className="w-1 h-1 bg-accent rounded-full"
        />
      </div>
    </motion.button>
  );
}
