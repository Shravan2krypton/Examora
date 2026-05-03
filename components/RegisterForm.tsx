"use client";

import { useFormState } from "react-dom";
import { registerAction } from "@/app/actions/auth";
import { motion } from "framer-motion";

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, null);

  return (
    <motion.form 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      action={formAction} 
      className="flex flex-col space-y-5 w-full max-w-md"
    >
      <div className="text-center mb-4">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Create Account</h2>
        <p className="text-sm text-foreground/60 mt-2">Join Examora to get started</p>
      </div>
      
      {state?.error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm text-center font-medium">
          {state.error}
        </motion.div>
      )}

      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground/80">Full Name</label>
        <input 
          type="text" 
          name="name"
          required 
          className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all placeholder-foreground/30 backdrop-blur-sm"
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground/80">Email</label>
        <input 
          type="email" 
          name="email"
          required 
          className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all placeholder-foreground/30 backdrop-blur-sm"
          placeholder="john@example.com"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground/80">Password</label>
        <input 
          type="password" 
          name="password"
          required 
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all placeholder-foreground/30 backdrop-blur-sm"
          placeholder="••••••••"
        />
      </div>

      <div className="space-y-2 pt-2">
        <label className="block text-sm font-medium text-foreground/80 mb-2">I am a...</label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center justify-center p-3 border border-foreground/10 bg-foreground/5 rounded-xl cursor-pointer hover:bg-foreground/10 transition group">
            <input type="radio" name="role" value="student" defaultChecked className="text-primary focus:ring-primary w-4 h-4 hidden peer" />
            <div className="w-4 h-4 rounded-full border-2 border-foreground/30 peer-checked:border-[5px] peer-checked:border-primary mr-2 transition-all"></div>
            <span className="font-medium text-sm">Student</span>
          </label>
          <label className="flex items-center justify-center p-3 border border-foreground/10 bg-foreground/5 rounded-xl cursor-pointer hover:bg-foreground/10 transition group">
            <input type="radio" name="role" value="admin" className="text-primary focus:ring-primary w-4 h-4 hidden peer" />
            <div className="w-4 h-4 rounded-full border-2 border-foreground/30 peer-checked:border-[5px] peer-checked:border-primary mr-2 transition-all"></div>
            <span className="font-medium text-sm">Faculty</span>
          </label>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        className="w-full py-3.5 bg-gradient-to-r from-primary to-accent-cyan text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all mt-6"
      >
        Sign Up
      </motion.button>
    </motion.form>
  );
}
