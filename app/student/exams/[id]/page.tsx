import { Navbar } from "@/components/Navbar";
import { db } from "@/lib/db";
import { exams, submissions, examQuestions, questions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ExamTimer } from "@/components/ExamTimer";
import { ExamSubmissionForm } from "@/components/ExamSubmissionForm";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BookOpen, Clock, Target, AlertTriangle } from "lucide-react";

export default async function ExamAttemptPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");

  const submissionId = params.id;
  
  const submissionRecord = await db.select().from(submissions).where(and(eq(submissions.id, submissionId), eq(submissions.studentId, session.id as string))).limit(1);
  if (submissionRecord.length === 0 || submissionRecord[0].status === "completed") {
    redirect("/student/results");
  }

  const submission = submissionRecord[0];
  const examRecord = await db.select().from(exams).where(eq(exams.id, submission.examId)).limit(1);
  const exam = examRecord[0];

  const examQs = await db.select({
    id: questions.id,
    text: questions.text,
    options: questions.options,
    marks: questions.marks
  })
  .from(examQuestions)
  .innerJoin(questions, eq(examQuestions.questionId, questions.id))
  .where(eq(examQuestions.examId, exam.id));

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative">
      <AnimatedBackground />
      <Navbar />
      
      {/* Floating Timer */}
      <ExamTimer durationMins={exam.duration} submissionId={submission.id} />
      
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full relative z-10">
        {/* Exam Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-8 rounded-3xl mb-8 sticky top-24 z-40 shadow-glass-lg border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30"
              >
                <BookOpen className="w-8 h-8 text-primary" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-black text-gradient mb-2">{exam.title}</h1>
                <div className="flex items-center space-x-4 text-foreground/60">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-medium">{exam.subject}</span>
                  </div>
                  <div className="w-px h-4 bg-foreground/20" />
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="font-medium">{exam.duration} minutes</span>
                  </div>
                  <div className="w-px h-4 bg-foreground/20" />
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-accent-purple" />
                    <span className="font-medium">{exam.totalMarks} marks</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress indicator */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-right"
            >
              <div className="text-sm text-foreground/50 mb-1">Progress</div>
              <div className="text-2xl font-black text-gradient">0/{examQs.length}</div>
            </motion.div>
          </div>
          
          {/* Warning message */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center space-x-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Important:</strong> Make sure you have a stable internet connection. Your progress is automatically saved.
            </div>
          </motion.div>
        </motion.div>

        {/* Questions Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-panel p-8 rounded-3xl shadow-glass border border-white/20"
        >
          <ExamSubmissionForm submissionId={submission.id} questions={examQs} />
        </motion.div>
      </main>
    </div>
  );
}
