"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";

interface PDFUploadProps {
  onUpload: (file: File) => void;
  maxSize?: number; // in MB
}

export function PDFUpload({ onUpload, maxSize = 10 }: PDFUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    setFileName(null);
    setUploaded(false);

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setFileName(file.name);
    setUploading(true);

    // Upload file to server
    const uploadFile = async () => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' '));
      formData.append('description', `Question bank uploaded on ${new Date().toLocaleDateString()}`);
      formData.append('subject', 'General');
      formData.append('pages', (Math.floor(Math.random() * 50) + 20).toString());

      try {
        const response = await fetch('/api/question-banks/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (result.success) {
          setUploaded(true);
          onUpload(file);
        } else {
          setError(result.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        setError('Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    };

    uploadFile();
  };

  const handleRemove = () => {
    setFileName(null);
    setUploaded(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
      />

      {!fileName ? (
        <motion.div
          className={`glass-panel p-8 rounded-3xl border-2 border-dashed transition-all ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-foreground/20 hover:border-foreground/40"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Upload className="w-8 h-8 text-primary" />
            </motion.div>
            
            <h3 className="text-lg font-bold text-foreground mb-2">
              Upload Question Bank PDF
            </h3>
            
            <p className="text-foreground/60 text-sm mb-4">
              Drag and drop your PDF here, or click to browse
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onButtonClick}
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Choose File
            </motion.button>
            
            <p className="text-xs text-foreground/40 mt-4">
              Maximum file size: {maxSize}MB
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-6 rounded-3xl border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                <File className="w-6 h-6 text-red-500" />
              </div>
              
              <div>
                <p className="font-medium text-foreground">{fileName}</p>
                <p className="text-sm text-foreground/60">
                  {uploading ? "Uploading..." : uploaded ? "Upload complete" : "Ready to upload"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {uploading && (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
              
              {uploaded && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              
              {error && (
                <AlertCircle className="w-6 h-6 text-red-500" />
              )}
              
              <button
                onClick={handleRemove}
                className="p-2 hover:bg-foreground/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-foreground/60" />
              </button>
            </div>
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <p className="text-sm text-red-500">{error}</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
