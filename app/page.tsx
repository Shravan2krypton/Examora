"use client";

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Star, Users, Shield, Zap, Award } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      // Redirect to appropriate dashboard based on user role
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/student');
      }
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent relative">
        <AnimatedBackground />
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 bg-foreground/10 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-transparent relative">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-8 lg:p-12 text-center z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              className="inline-flex items-center px-4 py-2 glass-panel border border-white/20 rounded-full mb-6"
            >
              <Star className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm font-bold text-gradient">Trusted by 1000+ Institutions</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="text-gradient">Master Your</span><br/>
              <span className="text-gradient-warm">Exams</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-foreground/70 mb-10 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              The most advanced, secure, and intuitive online examination platform. 
              Designed for both educators and students with <span className="text-gradient font-bold">billion-dollar startup quality</span>.
            </motion.p>
          </div>
          
          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="group flex items-center px-8 py-4 gradient-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all hover:scale-105"
            >
              {user ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full mb-16"
        >
          <FeatureCard 
            icon={<Clock className="w-8 h-8 text-blue-500"/>} 
            title="Timed Exams" 
            description="Strict timers with auto-submission capabilities and real-time progress tracking." 
          />
          <FeatureCard 
            icon={<Award className="w-8 h-8 text-yellow-500"/>} 
            title="Live Leaderboards" 
            description="Instantly view results and rankings after exams with premium animations." 
          />
          <FeatureCard 
            icon={<BookOpen className="w-8 h-8 text-green-500"/>} 
            title="Randomized Questions" 
            description="Dynamic question selection to prevent cheating and ensure fairness." 
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-purple-500"/>} 
            title="Secure Platform" 
            description="Enterprise-grade security with encrypted data and privacy protection." 
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-orange-500"/>} 
            title="Multi-User Support" 
            description="Support for thousands of concurrent users with scalable architecture." 
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-pink-500"/>} 
            title="Lightning Fast" 
            description="Optimized performance with instant loading and smooth interactions." 
          />
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="glass-panel p-8 rounded-3xl border border-white/20 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-gradient mb-2">10K+</div>
              <div className="text-sm text-foreground/60 font-medium">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-gradient mb-2">500+</div>
              <div className="text-sm text-foreground/60 font-medium">Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-gradient mb-2">99.9%</div>
              <div className="text-sm text-foreground/60 font-medium">Uptime</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400 }}
      className="glass-panel p-8 rounded-3xl border border-white/20 hover:bg-foreground/5 group"
    >
      <div className="mb-6 flex justify-center">
        <div className="p-3 bg-foreground/10 rounded-2xl group-hover:bg-foreground/20 transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gradient mb-3">{title}</h3>
      <p className="text-foreground/60 leading-relaxed">{description}</p>
    </motion.div>
  );
}
