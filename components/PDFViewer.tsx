"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { File, Download, Eye, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface PDFViewerProps {
  pdfUrl?: string;
  title?: string;
  onClose?: () => void;
}

// Mock PDF data for demo mode
const mockPDFs = [
  {
    id: "1",
    title: "Mathematics Question Bank",
    url: "/uploads/question-banks/sample-math-questions.pdf",
    description: "Complete set of mathematics questions for all levels",
    uploadDate: "2024-01-15",
    pages: 45
  },
  {
    id: "2", 
    title: "Physics Question Bank",
    url: "/uploads/question-banks/sample-physics-questions.pdf",
    description: "Comprehensive physics questions with solutions",
    uploadDate: "2024-01-14", 
    pages: 38
  },
  {
    id: "3",
    title: "Chemistry Question Bank", 
    url: "/uploads/question-banks/demo-chemistry.pdf",
    description: "Chemistry questions covering all topics",
    uploadDate: "2024-01-13",
    pages: 52
  }
];

export function PDFViewer({ pdfUrl, title, onClose }: PDFViewerProps) {
  const [currentPDF, setCurrentPDF] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pdfUrl) {
      // Find the PDF in mock data or create a mock entry
      const pdf = mockPDFs.find(p => p.url === pdfUrl) || {
        id: "custom",
        title: title || "Question Bank",
        url: pdfUrl,
        description: "Uploaded question bank",
        uploadDate: new Date().toISOString().split('T')[0],
        pages: 50
      };
      setCurrentPDF(pdf);
    }
  }, [pdfUrl, title]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPDF && currentPage < currentPDF.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDownload = () => {
    if (currentPDF) {
      // Simulate download
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert(`Downloading ${currentPDF.title}...`);
      }, 1000);
    }
  };

  if (!currentPDF) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-8 rounded-3xl border border-white/20 text-center"
      >
        <File className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
        <p className="text-foreground/50">PDF not found</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
              <File className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{currentPDF.title}</h3>
              <p className="text-sm text-foreground/60">
                {currentPDF.pages} pages • Uploaded {currentPDF.uploadDate}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-2 hover:bg-foreground/10 rounded-xl transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-foreground/60" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-foreground/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-foreground/60" />
            </motion.button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="relative bg-foreground/5" style={{ height: 'calc(90vh - 200px)' }}>
          {/* Real PDF Content */}
          <div 
            className="absolute inset-0 flex items-center justify-center overflow-auto"
            style={{ transform: `scale(${zoom})` }}
          >
            {currentPDF && (
              <div className="w-full h-full flex items-center justify-center">
                <iframe
                  src={currentPDF.url}
                  className="w-full h-full border-0 rounded-2xl"
                  title={currentPDF.title}
                  style={{ minHeight: '600px' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-t border-foreground/10">
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleZoomOut}
              className="p-2 hover:bg-foreground/10 rounded-xl transition-colors"
            >
              <ZoomOut className="w-5 h-5 text-foreground/60" />
            </motion.button>
            
            <span className="text-sm text-foreground/60 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleZoomIn}
              className="p-2 hover:bg-foreground/10 rounded-xl transition-colors"
            >
              <ZoomIn className="w-5 h-5 text-foreground/60" />
            </motion.button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-foreground/60">
              {currentPDF?.title || 'PDF Viewer'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// PDF List Component for Student Dashboard
export function PDFList() {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [questionBanks, setQuestionBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        const response = await fetch('/api/question-banks');
        const result = await response.json();
        
        if (result.success) {
          setQuestionBanks(result.questionBanks);
          if (result.message) {
            setError(result.message); // Show demo mode message
          }
        } else {
          setError('Failed to load question banks');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Network error - showing demo data');
        // Use mock data as fallback
        setQuestionBanks(mockPDFs);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionBanks();
  }, []);

  const handlePDFClick = (pdfUrl: string) => {
    setSelectedPDF(pdfUrl);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-foreground/10 animate-pulse" />
              <div className="flex-grow">
                <div className="h-4 bg-foreground/10 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-foreground/10 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {questionBanks.map((pdf, index) => (
          <motion.div
            key={pdf.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-3xl border border-white/20 hover:bg-foreground/5 transition-all cursor-pointer group"
            onClick={() => handlePDFClick(pdf.filePath)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <File className="w-6 h-6 text-red-500" />
                </div>
                
                <div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {pdf.title}
                  </h3>
                  <p className="text-sm text-foreground/60">{pdf.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-foreground/40">
                    <span>{pdf.pages} pages</span>
                    <span>•</span>
                    <span>{pdf.fileSize}</span>
                    <span>•</span>
                    <span>Uploaded {pdf.uploadDate}</span>
                    {pdf.subject && (
                      <>
                        <span>•</span>
                        <span>{pdf.subject}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePDFClick(pdf.filePath);
                  }}
                  className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-xl"
        >
          <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
        </motion.div>
      )}
      
      {selectedPDF && (
        <PDFViewer
          pdfUrl={selectedPDF}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </>
  );
}
