"use client";

import { useState } from "react";
import { submitExamAction } from "@/app/actions/student";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

export function ExamSubmissionForm({ submissionId, questions }: { submissionId: string, questions: any[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleSelect = (qId: string, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const formattedAnswers = questions.map(q => ({
      questionId: q.id,
      selectedOption: answers[q.id] !== undefined ? answers[q.id] : -1,
      isCorrect: false
    }));
    await submitExamAction(submissionId, formattedAnswers);
  };

  if (questions.length === 0) return <div>No questions.</div>;

  const q = questions[currentIdx];

  return (
    <form id="exam-form" onSubmit={handleSubmit} className="space-y-8 w-full max-w-3xl mx-auto z-10 relative">
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-bold text-foreground/60 mb-2">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Math.round((Object.keys(answers).length / questions.length) * 100)}% Answered</span>
        </div>
        <div className="w-full bg-foreground/10 h-3 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-accent-purple" />
          
          <h3 className="text-2xl md:text-3xl font-extrabold mb-8 text-foreground/90 leading-tight">
            <span className="text-primary mr-3">Q{currentIdx + 1}.</span> 
            {q.text}
            <span className="block text-sm font-semibold text-foreground/40 mt-3">[{q.marks} Marks]</span>
          </h3>
          
          <div className="space-y-4">
            {q.options.map((opt: string, optIdx: number) => {
              const isSelected = answers[q.id] === optIdx;
              return (
                <label 
                  key={optIdx} 
                  className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${isSelected ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-[1.02]' : 'border-foreground/10 bg-foreground/5 hover:bg-foreground/10 hover:scale-[1.01]'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${isSelected ? 'border-primary bg-primary text-white' : 'border-foreground/30'}`}>
                    {isSelected && <motion.div initial={{scale:0}} animate={{scale:1}}><CheckCircle2 className="w-4 h-4"/></motion.div>}
                  </div>
                  <input 
                    type="radio" 
                    name={`q-${q.id}`} 
                    value={optIdx}
                    checked={isSelected}
                    onChange={() => handleSelect(q.id, optIdx)}
                    className="hidden"
                  />
                  <span className="text-lg font-medium text-foreground/80">{opt}</span>
                </label>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-8">
        <button 
          type="button" 
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className={`px-6 py-4 rounded-xl font-bold flex items-center transition-all ${currentIdx === 0 ? 'opacity-50 cursor-not-allowed text-foreground/40' : 'text-foreground/80 hover:bg-foreground/10'}`}
        >
          <ChevronLeft className="w-5 h-5 mr-2" /> Previous
        </button>

        {currentIdx === questions.length - 1 ? (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-xl shadow-xl shadow-green-500/30 text-lg"
          >
            Submit Exam
          </motion.button>
        ) : (
          <button 
            type="button" 
            onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
            className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center shadow-lg shadow-primary/20"
          >
            Next <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </form>
  );
}
