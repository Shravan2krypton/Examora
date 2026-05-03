"use client";

import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { ExamService } from "@/lib/services/ExamService";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Calendar, Clock, PlayCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useState, useEffect } from "react";

export default function StudentExams() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "student") {
      // Simulate fetching exams data
      const mockExams = [
        {
          id: "1",
          title: "Mathematics Final",
          subject: "Mathematics",
          duration: 120,
          totalMarks: 100
        },
        {
          id: "2",
          title: "Physics Midterm",
          subject: "Physics",
          duration: 90,
          totalMarks: 80
        },
        {
          id: "3",
          title: "Chemistry Quiz",
          subject: "Chemistry",
          duration: 60,
          totalMarks: 50
        }
      ];
      setExams(mockExams);
    }
  }, [user, loading, router]);

  if (loading) {
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

  const handleStartExam = (examId: string) => {
    // Navigate to exam attempt page
    router.push(`/student/exams/${examId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative">
      <AnimatedBackground />
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar role="student" />
        <main className="flex-grow p-8 max-w-7xl mx-auto w-full z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-extrabold text-gradient tracking-tight">Available Exams</h1>
            <p className="text-foreground/60 mt-1 font-medium">Select an exam to begin your assessment.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {exams.length === 0 ? (
              <div className="col-span-full glass-panel p-16 rounded-3xl text-center border border-white/20">
                <BookOpen className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <p className="text-xl text-foreground/50 font-semibold">No exams available at the moment.</p>
              </div>
            ) : (
              exams.map((exam, i) => (
                <motion.div 
                  key={exam.id} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="glass-panel p-8 rounded-3xl shadow-xl border border-white/20 flex flex-col group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-primary/30 to-accent-cyan/30 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors" />
                  
                  <h3 className="text-2xl font-black text-foreground/90 mb-4 z-10">{exam.title}</h3>
                  <div className="space-y-3 text-sm text-foreground/60 font-semibold mb-8 z-10">
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary"/> {exam.subject}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-accent-cyan"/> {exam.duration} mins</span>
                    <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary rounded-xl mt-3">Total Marks: {exam.totalMarks}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleStartExam(exam.id)}
                    className="mt-auto z-10 w-full py-4 bg-gradient-to-r from-primary to-accent-cyan text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex justify-center items-center hover:scale-[1.02] active:scale-95"
                  >
                    <PlayCircle className="w-6 h-6 mr-2" /> Start Exam
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
