"use client";

import { useRef } from "react";
import { createQuestionAction } from "@/app/actions/questions";
import { motion } from "framer-motion";

export function QuestionForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const options = [
      formData.get("opt0"),
      formData.get("opt1"),
      formData.get("opt2"),
      formData.get("opt3")
    ];
    formData.append("options", JSON.stringify(options));
    
    await createQuestionAction(null, formData);
    formRef.current?.reset();
  };

  return (
    <motion.form 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      ref={formRef} 
      onSubmit={handleSubmit} 
      className="glass-panel p-6 rounded-2xl shadow-lg border border-white/20 space-y-5 sticky top-24"
    >
      <div>
        <label className="block text-sm font-semibold text-foreground/80 mb-1.5">Question Text</label>
        <textarea name="text" required className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all placeholder-foreground/30 backdrop-blur-sm resize-none" rows={3} placeholder="What is the capital of France?"></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground/80 mb-1.5">Subject</label>
          <input type="text" name="subject" required className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Geography" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground/80 mb-1.5">Difficulty</label>
          <select name="difficulty" className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
            <option value="easy" className="bg-background">Easy</option>
            <option value="medium" className="bg-background">Medium</option>
            <option value="hard" className="bg-background">Hard</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground/80">Options</label>
        {[0, 1, 2, 3].map((i) => (
          <input key={i} type="text" name={`opt${i}`} required placeholder={`Option ${i + 1}`} className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground/80 mb-1.5">Correct Option</label>
          <select name="correctAnswer" className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none cursor-pointer">
            <option value="0" className="bg-background">Option 1</option>
            <option value="1" className="bg-background">Option 2</option>
            <option value="2" className="bg-background">Option 3</option>
            <option value="3" className="bg-background">Option 4</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground/80 mb-1.5">Marks</label>
          <input type="number" name="marks" defaultValue="1" required min="1" className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 focus:bg-foreground/10 focus:ring-2 focus:ring-primary outline-none transition-all" />
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        className="w-full py-3.5 bg-gradient-to-r from-primary to-accent-cyan text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all mt-4"
      >
        Save Question
      </motion.button>
    </motion.form>
  );
}
