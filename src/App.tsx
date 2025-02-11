import React from 'react';
import { FileUpload } from './components/FileUpload';
import { StatementRetrieval } from './components/StatementRetrieval';
import { Auth } from './components/Auth';
import { FilesIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { useEffect, useState } from 'react';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const handleUploadComplete = () => {
    console.log('Upload completed');
  };

  // Check if this is the retrieval page
  const isRetrievalPage = window.location.pathname === '/retrieve';

  // If it's the retrieval page, show only the retrieval component
  if (isRetrievalPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <StatementRetrieval />
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show the upload page with authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <h1 className="text-2xl font-bold text-center mb-8">Sign in to upload statements</h1>
          <Auth onSuccess={() => setIsAuthenticated(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <FilesIcon className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Upload Patient Statements
            </h1>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>
      </div>
    </div>
  );
}