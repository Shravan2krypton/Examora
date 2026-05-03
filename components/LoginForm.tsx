"use client";

import { useFormState } from "react-dom";
import { loginAction } from "@/app/actions/auth";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState("");

  return (
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      action={formAction} 
      className="flex flex-col space-y-6 w-full max-w-md relative"
    >
      {/* Floating background decoration */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 rounded-full blur-2xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6 relative z-10"
      >
        <h2 className="text-4xl font-black text-gradient mb-3 tracking-tight">Welcome Back</h2>
        <p className="text-sm text-foreground/60 font-medium">Enter your credentials to continue</p>
      </motion.div>
      
      {state?.error && (
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm text-center font-medium backdrop-blur-sm relative z-10"
        >
          {state.error}
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2 relative z-10"
      >
        <label className="block text-sm font-semibold text-foreground/80 uppercase tracking-wider">Email</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className={`h-5 w-5 transition-colors ${isFocused === 'email' ? 'text-primary' : 'text-foreground/40'}`} />
          </div>
          <input 
            type="email" 
            name="email"
            required 
            onFocus={() => setIsFocused('email')}
            onBlur={() => setIsFocused('')}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-foreground/30 backdrop-blur-sm group-hover:border-foreground/20"
            placeholder="admin@example.com"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2 relative z-10"
      >
        <label className="block text-sm font-semibold text-foreground/80 uppercase tracking-wider">Password</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className={`h-5 w-5 transition-colors ${isFocused === 'password' ? 'text-primary' : 'text-foreground/40'}`} />
          </div>
          <input 
            type={showPassword ? "text" : "password"}
            name="password"
            required 
            onFocus={() => setIsFocused('password')}
            onBlur={() => setIsFocused('')}
            className="w-full pl-12 pr-12 py-4 rounded-2xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-foreground/30 backdrop-blur-sm group-hover:border-foreground/20"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(99, 102, 241, 0.3)" }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        className="w-full py-4 gradient-primary text-white font-black rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all mt-8 relative overflow-hidden group"
      >
        <span className="relative z-10">Sign In</span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </motion.button>
    </motion.form>
  );
}
