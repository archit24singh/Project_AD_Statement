import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploadFormProps {
  onSubmit: (files: FileList) => Promise<void>;
  isUploading: boolean;
  progress: { current: number; total: number };
}

export function FileUploadForm({ onSubmit, isUploading, progress }: FileUploadFormProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    await onSubmit(files);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed rounded-lg cursor-pointer ${
            isUploading ? 'bg-gray-100 border-gray-300' : 'border-blue-300 hover:border-blue-400'
          }`}
        >
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="text-sm text-gray-600">
            {isUploading 
              ? `Uploading ${progress.current}/${progress.total} files...`
              : 'Click to upload PDF statements (multiple files allowed)'}
          </div>
        </label>

        {isUploading && progress.total > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {Math.round((progress.current / progress.total) * 100)}% complete
            </p>
          </div>
        )}
      </div>

      <div className="flex items-start space-x-2 text-sm text-gray-500">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>Multiple PDF files can be uploaded at once</p>
      </div>
    </div>
  );
}