"use client";

import { IQuestion } from "@/lib/models/interfaces";
import { Trash2, CheckCircle2, Edit, Eye, Copy } from "lucide-react";
import { deleteQuestionAction } from "@/app/actions/questions";
import { motion } from "framer-motion";
import { useState } from "react";

export function QuestionCard({ question, index = 0 }: { question: IQuestion, index?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteQuestionAction(question.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-600';
      case 'medium': return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-600';
      case 'hard': return 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-600';
      default: return 'from-primary/20 to-accent/10 border-primary/30 text-primary';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 20px 60px rgba(99, 102, 241, 0.15)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-panel p-8 rounded-3xl shadow-glass border border-white/20 flex flex-col relative group transition-all cursor-pointer"
    >
      {/* Background gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Action buttons */}
      <motion.div 
        className="absolute top-4 right-4 flex items-center space-x-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-primary/70 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-accent/70 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
        >
          <Edit className="w-4 h-4" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-accent-purple/70 hover:text-accent-purple hover:bg-accent-purple/10 rounded-xl transition-all"
        >
          <Copy className="w-4 h-4" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete} 
          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </motion.div>
      
      {/* Question header */}
      <div className="mb-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground/90 pr-12 leading-relaxed">
            {isExpanded ? question.text : `${question.text.slice(0, 100)}${question.text.length > 100 ? '...' : ''}`}
          </h3>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-foreground/5 rounded-lg border border-foreground/10 text-xs font-semibold text-foreground/70">
            {question.subject}
          </span>
          <span className={`px-3 py-1 rounded-lg border text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20 text-xs font-bold">
            {question.marks} marks
          </span>
        </div>
      </div>
      
      {/* Options */}
      <div className="space-y-3 relative z-10">
        {question.options.slice(0, isExpanded ? question.options.length : 3).map((opt, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className={`px-4 py-3 rounded-2xl border flex items-center justify-between transition-all group ${
              idx === question.correctAnswer 
                ? 'bg-gradient-to-r from-green-500/10 to-green-600/5 border-green-500/30' 
                : 'border-foreground/10 bg-foreground/5 hover:bg-foreground/10'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                idx === question.correctAnswer 
                  ? 'bg-green-500 text-white' 
                  : 'bg-foreground/10 text-foreground/60'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className={`font-medium ${
                idx === question.correctAnswer 
                  ? "text-green-700 dark:text-green-400" 
                  : "text-foreground/80"
              }`}>
                {opt}
              </span>
            </div>
            {idx === question.correctAnswer && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05, type: "spring", stiffness: 500 }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </motion.div>
            )}
          </motion.div>
        ))}
        
        {!isExpanded && question.options.length > 3 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(true)}
            className="w-full py-2 text-center text-sm text-primary font-medium hover:bg-primary/5 rounded-xl transition-all"
          >
            +{question.options.length - 3} more options
          </motion.button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-6 border-t border-foreground/10 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="text-xs text-foreground/50">
            ID: #{question.id}
          </div>
          <div className="w-px h-4 bg-foreground/20" />
          <div className="text-xs text-foreground/50">
            {new Date().toLocaleDateString()}
          </div>
        </div>
        
        <motion.div 
          className="flex items-center space-x-1"
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="w-2 h-2 bg-primary/30 rounded-full" />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
