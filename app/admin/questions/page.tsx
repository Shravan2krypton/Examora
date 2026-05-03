"use client";

import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { PDFUpload } from "@/components/PDFUpload";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Search, Filter, Plus, BookOpen, File, Eye, Download } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useState, useEffect } from "react";

export default function AdminQuestions() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [uploadedPDFs, setUploadedPDFs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "admin") {
      // Mock uploaded PDFs
      const mockPDFs = [
        {
          id: "1",
          title: "Mathematics Question Bank",
          fileName: "math_questions.pdf",
          uploadDate: "2024-01-15",
          size: "2.5 MB",
          pages: 45
        },
        {
          id: "2",
          title: "Physics Question Bank",
          fileName: "physics_questions.pdf", 
          uploadDate: "2024-01-14",
          size: "1.8 MB",
          pages: 38
        }
      ];
      setUploadedPDFs(mockPDFs);
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

  const handlePDFUpload = (file: File) => {
    const newPDF = {
      id: Date.now().toString(),
      title: file.name.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' '),
      fileName: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      pages: Math.floor(Math.random() * 50) + 20
    };
    setUploadedPDFs([newPDF, ...uploadedPDFs]);
  };

  const filteredPDFs = uploadedPDFs.filter(pdf => 
    pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative">
      <AnimatedBackground />
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar role="admin" />
        <main className="flex-grow p-8 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-black text-gradient mb-3 tracking-tight">Question Bank</h1>
                <p className="text-foreground/60 text-lg font-medium">Upload and manage PDF question banks for students.</p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-panel px-6 py-3 rounded-2xl flex items-center space-x-3"
              >
                <File className="w-5 h-5 text-primary" />
                <span className="font-bold text-gradient">{uploadedPDFs.length} PDFs</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Upload Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Upload Question Bank</h2>
            <PDFUpload onUpload={handlePDFUpload} />
          </motion.div>

          {/* Search and Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
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
          </motion.div>

          {/* Uploaded PDFs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="glass-panel p-8 rounded-3xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Uploaded Question Banks</h2>
            
            {filteredPDFs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/50 font-medium">
                  {searchTerm ? "No question banks found matching your search" : "No question banks uploaded yet"}
                </p>
                <p className="text-sm text-foreground/40 mt-2">
                  {searchTerm ? "Try a different search term" : "Upload your first PDF question bank to get started"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPDFs.map((pdf, index) => (
                  <motion.div
                    key={pdf.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="p-6 bg-foreground/5 rounded-2xl border border-foreground/10 hover:bg-foreground/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                          <File className="w-6 h-6 text-red-500" />
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-foreground mb-1">{pdf.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-foreground/60">
                            <span>{pdf.fileName}</span>
                            <span>•</span>
                            <span>{pdf.size}</span>
                            <span>•</span>
                            <span>{pdf.pages} pages</span>
                            <span>•</span>
                            <span>Uploaded {pdf.uploadDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-foreground/10 rounded-xl transition-colors">
                          <Eye className="w-5 h-5 text-foreground/60" />
                        </button>
                        <button className="p-2 hover:bg-foreground/10 rounded-xl transition-colors">
                          <Download className="w-5 h-5 text-foreground/60" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
