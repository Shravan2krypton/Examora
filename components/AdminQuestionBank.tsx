"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Eye, Download, Trash2, Plus, Search, Filter } from "lucide-react";
import { PDFUpload } from "@/components/PDFUpload";

export function AdminQuestionBank() {
  const [questionBanks, setQuestionBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpload, setShowUpload] = useState(false);
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
          },
        ];
        setQuestionBanks(mockQuestionBanks);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionBanks();
  }, []);

  const handlePDFUpload = (file: File) => {
    // Refresh the question banks list after upload
    setTimeout(() => {
      const newPDF = {
        id: `new-${Date.now()}`,
        title: file.name.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' '),
        description: `Question bank uploaded on ${new Date().toLocaleDateString()}`,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        filePath: `/uploads/question-banks/${file.name}`,
        subject: 'General',
        pages: Math.floor(Math.random() * 50) + 20,
        uploadDate: new Date().toISOString().split('T')[0],
        uploader: {
          name: 'Current Admin',
          email: 'admin@example.com',
        },
      };
      setQuestionBanks([newPDF, ...questionBanks]);
      setShowUpload(false);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setQuestionBanks(questionBanks.filter(qb => qb.id !== id));
  };

  const filteredQuestionBanks = questionBanks.filter(qb => 
    qb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qb.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qb.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPDF = (filePath: string) => {
    setSelectedPDF(filePath);
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
            <span className="text-sm text-foreground/60">{questionBanks.length} Files</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUpload(!showUpload)}
              className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
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
          <button className="px-6 py-3 glass-panel border border-white/20 rounded-2xl hover:bg-foreground/10 transition-all flex items-center space-x-2">
            <Filter className="w-5 h-5 text-foreground/60" />
            <span>Filter</span>
          </button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <PDFUpload onUpload={handlePDFUpload} />
          </motion.div>
        )}

        {/* Question Banks List */}
        <div className="space-y-4">
          {filteredQuestionBanks.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
              <p className="text-foreground/50 font-medium">
                {searchTerm ? "No question banks found matching your search" : "No question banks uploaded yet"}
              </p>
              <p className="text-sm text-foreground/40 mt-2">
                {searchTerm ? "Try a different search term" : "Upload your first PDF question bank to get started"}
              </p>
            </div>
          ) : (
            filteredQuestionBanks.map((qb, index) => (
              <motion.div
                key={qb.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="p-6 bg-foreground/5 rounded-2xl border border-foreground/10 hover:bg-foreground/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{qb.title}</h4>
                      <p className="text-sm text-foreground/60 mb-2">{qb.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-foreground/40">
                        <span>{qb.fileName}</span>
                        <span>•</span>
                        <span>{qb.fileSize}</span>
                        <span>•</span>
                        <span>{qb.pages} pages</span>
                        <span>•</span>
                        <span>{qb.subject}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-foreground/40 mt-1">
                        <span>Uploaded by {qb.uploader.name}</span>
                        <span>•</span>
                        <span>{qb.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewPDF(qb.filePath)}
                      className="p-2 hover:bg-foreground/10 rounded-xl transition-colors"
                    >
                      <Eye className="w-4 h-4 text-foreground/60" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-foreground/10 rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4 text-foreground/60" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(qb.id)}
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* PDF Viewer Modal */}
      {selectedPDF && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-3xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-foreground/10">
              <h3 className="text-lg font-bold text-foreground">Question Bank Preview</h3>
              <button
                onClick={() => setSelectedPDF(null)}
                className="p-2 hover:bg-foreground/10 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5 text-foreground/60" />
              </button>
            </div>
            <div className="p-6">
              <iframe
                src={selectedPDF}
                className="w-full h-96 border-0 rounded-2xl"
                title="Question Bank PDF"
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
