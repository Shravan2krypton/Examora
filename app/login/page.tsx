"use client";

import { LoginForm } from "@/components/LoginForm";
import { Navbar } from "@/components/Navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent relative">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 lg:p-12 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-6xl flex overflow-hidden glass-panel rounded-[3rem] shadow-glass-lg border border-white/20"
        >
          
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/10 via-accent/5 to-accent-purple/10 p-16 flex-col justify-center relative overflow-hidden border-r border-foreground/5">
            {/* Animated floating elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl animate-float" />
            <div className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-full blur-lg animate-float" style={{ animationDelay: "1s" }} />
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="z-10 relative"
            >
              <h2 className="text-6xl font-black text-gradient mb-6 leading-tight tracking-tight">
                Master Your Exams <br/>With <span className="text-gradient-warm">Examora</span>
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed max-w-md font-medium">
                Experience the next generation of seamless, intelligent, and fair online assessments designed for top-tier institutions.
              </p>
              
              {/* Feature highlights */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm text-foreground/60 font-medium">AI-powered question generation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                  <span className="text-sm text-foreground/60 font-medium">Real-time collaboration tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
                  <span className="text-sm text-foreground/60 font-medium">Advanced analytics & insights</span>
                </div>
              </div>
            </motion.div>
            
            {/* Background gradient orbs */}
            <div className="absolute right-[-10%] bottom-[-10%] w-64 h-64 bg-primary/30 rounded-full blur-[80px]" />
            <div className="absolute left-[-10%] top-[-10%] w-64 h-64 bg-accent-cyan/30 rounded-full blur-[80px]" />
          </div>
          
          <div className="w-full lg:w-1/2 p-8 lg:p-16 flex items-center justify-center relative bg-background/30 backdrop-blur-sm">
            <LoginForm />
          </div>
          
        </motion.div>
      </main>
    </div>
  );
}
