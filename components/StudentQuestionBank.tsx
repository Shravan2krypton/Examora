"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Eye, Download, Search, Filter, BookOpen, Clock, Star } from "lucide-react";
import { PDFViewer } from "./PDFViewer";

export function StudentQuestionBank() {
  const [questionBanks, setQuestionBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        const response = await fetch('/api/question-banks');
        const result = await response.json();
        
        if (result.success) {
          setQuestionBanks(result.questionBanks);
        } else {
          // Fallback to demo data
          const mockQuestionBanks = [
            {
              id: 'demo-1',
              title: 'Mathematics Question Bank',
              description: 'Complete set of mathematics questions for all levels',
              fileName: 'sample-math-questions.pdf',
              fileSize: '0.1 MB',
              filePath: '/uploads/question-banks/sample-math-questions.pdf',
              subject: 'Mathematics',
              pages: 45,
              uploadDate: '2024-01-15',
              uploader: {
                name: 'Demo Admin',
                email: 'admin@example.com',
              },
              difficulty: 'Intermediate',
              rating: 4.8,
              downloads: 156,
            },
            {
              id: 'demo-2',
              title: 'Physics Question Bank',
              description: 'Comprehensive physics questions with solutions',
              fileName: 'sample-physics-questions.pdf',
              fileSize: '0.1 MB',
              filePath: '/uploads/question-banks/sample-physics-questions.pdf',
              subject: 'Physics',
              pages: 38,
              uploadDate: '2024-01-14',
              uploader: {
                name: 'Demo Admin',
                email: 'admin@example.com',
              },
              difficulty: 'Advanced',
              rating: 4.9,
              downloads: 142,
            },
            {
              id: 'demo-3',
              title: 'Chemistry Question Bank',
              description: 'Chemistry questions covering all topics',
              fileName: 'chemistry_questions.pdf',
              fileSize: '3.2 MB',
              filePath: '/uploads/question-banks/demo-chemistry.pdf',
              subject: 'Chemistry',
              pages: 52,
              uploadDate: '2024-01-13',
              uploader: {
                name: 'Demo Admin',
                email: 'admin@example.com',
              },
              difficulty: 'Beginner',
              rating: 4.6,
              downloads: 98,
            },
          ];
          setQuestionBanks(mockQuestionBanks);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        // Use demo data as fallback
        const mockQuestionBanks = [
          {
            id: 'demo-1',
            title: 'Mathematics Question Bank',
            description: 'Complete set of mathematics questions for all levels',
            fileName: 'sample-math-questions.pdf',
            fileSize: '0.1 MB',
            filePath: '/uploads/question-banks/sample-math-questions.pdf',
            subject: 'Mathematics',
            pages: 45,
            uploadDate: '2024-01-15',
            uploader: {
              name: 'Demo Admin',
              email: 'admin@example.com',
            },
            difficulty: 'Intermediate',
            rating: 4.8,
            downloads: 156,
          },
        ];
        setQuestionBanks(mockQuestionBanks);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionBanks();
  }, []);

  const filteredQuestionBanks = questionBanks.filter(qb => {
    const matchesSearch = qb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qb.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qb.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === qb.subject) ||
                         (selectedFilter === qb.difficulty?.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const handleViewPDF = (filePath: string) => {
    setSelectedPDF(filePath);
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-foreground/60';
    }
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-foreground/20'}`} 
          />
        ))}
        <span className="text-xs text-foreground/60 ml-1">{rating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Question Bank</h3>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-foreground/5 rounded-xl">
              <div className="w-12 h-12 bg-foreground/10 rounded-xl animate-pulse" />
              <div className="flex-grow">
                <div className="h-4 bg-foreground/10 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-foreground/10 rounded w-1/2 animate-pulse" />
              </div>
              <div className="w-24 h-8 bg-foreground/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="glass-panel p-8 rounded-3xl border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Question Bank</h3>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-foreground/60">{questionBanks.length} Resources</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search question banks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-panel border border-white/20 rounded-2xl focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 glass-panel border border-white/20 rounded-2xl focus:outline-none focus:border-primary/50 transition-all bg-transparent"
            >
              <option value="all">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Question Banks Grid */}
        {filteredQuestionBanks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
            <p className="text-foreground/50 font-medium">
              {searchTerm ? "No question banks found matching your search" : "No question banks available yet"}
            </p>
            <p className="text-sm text-foreground/40 mt-2">
              {searchTerm ? "Try a different search term" : "Check back later for new resources"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuestionBanks.map((qb, index) => (
              <motion.div
                key={qb.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="p-6 bg-foreground/5 rounded-2xl border border-foreground/10 hover:bg-foreground/10 transition-all hover:scale-105 cursor-pointer group"
                onClick={() => handleViewPDF(qb.filePath)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getDifficultyColor(qb.difficulty)}`}>
                      {qb.difficulty || 'General'}
                    </div>
                    {getRatingStars(qb.rating || 4.5)}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {qb.title}
                  </h4>
                  <p className="text-sm text-foreground/60 mb-4 line-clamp-2">{qb.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-foreground/40 mb-3">
                    <span className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {qb.subject}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {qb.pages} pages
                    </span>
                    <span>•</span>
                    <span>{qb.fileSize}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-foreground/40">
                      <span>by {qb.uploader.name}</span>
                      <span>•</span>
                      <span>{qb.uploadDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-foreground/40">
                      <Download className="w-3 h-3" />
                      <span>{qb.downloads || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-foreground/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPDF(qb.filePath);
                    }}
                    className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(qb.filePath, qb.fileName);
                    }}
                    className="px-3 py-2 bg-foreground/10 text-foreground rounded-xl hover:bg-foreground/20 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* PDF Viewer Modal */}
      {selectedPDF && (
        <PDFViewer
          pdfUrl={selectedPDF}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </>
  );
}
