"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="glass-nav sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="bg-gradient-to-br from-primary to-accent-cyan p-3 rounded-2xl shadow-lg shadow-primary/30"
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-3xl font-black tracking-tight text-gradient">Examora</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <ThemeToggle />
          {!loading && user ? (
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 glass-panel px-4 py-2 rounded-2xl border border-white/20"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-foreground">{user.name}</div>
                  <div className="text-xs text-foreground/60 capitalize">{user.role}</div>
                </div>
              </motion.div>
              
              {/* Logout Button */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center px-6 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-2xl transition-all shadow-md"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </motion.button>
            </div>
          ) : !loading && !user ? (
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="px-6 py-3 text-sm font-semibold text-foreground hover:bg-foreground/10 rounded-2xl transition-all glass-panel border border-foreground/10"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-3 text-sm font-semibold gradient-primary text-white hover:scale-105 rounded-2xl transition-all shadow-lg shadow-primary/25"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="w-20 h-10 bg-foreground/10 rounded-2xl animate-pulse" />
          )}
        </div>
      </div>
    </nav>
  );
}
