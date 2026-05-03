"use client";

import { useRef, useState } from "react";
import { createExamAction } from "@/app/actions/exams";
import { IQuestion } from "@/lib/models/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

export function ExamForm({ availableQuestions }: { availableQuestions: IQuestion[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("questions", JSON.stringify(selectedQuestions));
    
    await createExamAction(null, formData);
    formRef.current?.reset();
    setSelectedQuestions([]);
    setStep(1);
  };

  const toggleQuestion = (id: string) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  return (
    <div className="glass-panel p-8 rounded-3xl shadow-2xl border border-white/20">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {['Basic Info', 'Settings', 'Questions'].map((label, i) => (
            <div key={i} className={`flex items-center space-x-2 ${step >= i + 1 ? 'text-primary' : 'text-foreground/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= i + 1 ? 'bg-primary/20 text-primary scale-110' : 'bg-foreground/5'}`}>
                {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className="font-semibold text-sm hidden md:block">{label}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent-cyan"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground/80 mb-2">Exam Title</label>
                <input type="text" name="title" required className="w-full px-5 py-4 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all text-lg" placeholder="e.g. Midterm Physics" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground/80 mb-2">Subject</label>
                <input type="text" name="subject" required className="w-full px-5 py-4 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all text-lg" placeholder="Physics" />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-2">Duration (mins)</label>
                  <input type="number" name="duration" required min="1" className="w-full px-5 py-4 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all text-lg" placeholder="60" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-2">Total Marks</label>
                  <input type="number" name="totalMarks" required min="1" className="w-full px-5 py-4 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all text-lg" placeholder="100" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground/80 mb-3">Select Questions ({selectedQuestions.length} selected)</label>
                <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                  {availableQuestions.map((q, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={q.id} 
                      className={`flex items-start space-x-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedQuestions.includes(q.id) ? 'bg-primary/10 border-primary/30' : 'bg-foreground/5 border-foreground/10 hover:bg-foreground/10'}`} 
                      onClick={() => toggleQuestion(q.id)}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 ${selectedQuestions.includes(q.id) ? 'bg-primary text-white' : 'border-2 border-foreground/30'}`}>
                        {selectedQuestions.includes(q.id) && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground/90">{q.text}</p>
                        <p className="text-xs text-foreground/50 mt-1 font-semibold">Marks: {q.marks} &bull; Level: <span className="capitalize">{q.difficulty}</span></p>
                      </div>
                    </motion.div>
                  ))}
                  {availableQuestions.length === 0 && <p className="text-center p-8 text-foreground/50 font-medium bg-foreground/5 rounded-xl">No questions available. Add some from the Question Bank first.</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-6 border-t border-foreground/10">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl font-bold text-foreground/70 hover:bg-foreground/5 transition-all flex items-center">
              <ChevronLeft className="w-5 h-5 mr-1" /> Back
            </button>
          ) : <div></div>}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="px-8 py-3 bg-gradient-to-r from-primary to-accent-cyan text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center"
          >
            {step === totalSteps ? 'Create Exam' : 'Next'} {step < totalSteps && <ChevronRight className="w-5 h-5 ml-1" />}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
