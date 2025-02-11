import React, { useState } from 'react';
import { uploadStatement } from '../lib/database';
import { FileUploadForm } from './FileUploadForm';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUploadComplete: () => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleUpload = async (files: FileList) => {
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast.error('Only PDF files are allowed');
      return;
    }

    setIsUploading(true);
    setProgress({ current: 0, total: pdfFiles.length });

    try {
      const BATCH_SIZE = 50;
      for (let i = 0; i < pdfFiles.length; i += BATCH_SIZE) {
        const batch = pdfFiles.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (file) => {
          const content = await file.arrayBuffer();
          return uploadStatement({
            name: file.name,
            content,
            size: file.size
          });
        });

        await Promise.all(promises);
        setProgress(prev => ({ ...prev, current: Math.min(prev.current + batch.length, prev.total) }));
      }

      toast.success(`Successfully uploaded ${pdfFiles.length} statements`);
      onUploadComplete();
    } catch (error: any) {
      toast.error(error.message || 'Error uploading statements');
    } finally {
      setIsUploading(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Upload PDF files named in the format: <code className="bg-blue-100 px-2 py-1 rounded">lastname_birthyear_lastfour.pdf</code>
              <br />
              Example: <code className="bg-blue-100 px-2 py-1 rounded">smith_1923_6778.pdf</code>
            </p>
          </div>
        </div>
      </div>

      <FileUploadForm 
        onSubmit={handleUpload}
        isUploading={isUploading}
        progress={progress}
      />
    </div>
  );
}