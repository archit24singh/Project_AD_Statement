import React, { useState } from 'react';
import { Search, Download, Eye, FileText } from 'lucide-react';
import { searchStatements } from '../lib/database';
import type { Statement } from '../lib/types';
import toast from 'react-hot-toast';

export function StatementRetrieval() {
  const [lastname, setLastname] = useState('');
  const [year, setYear] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Statement[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastname || !year) {
      toast.error('Please enter both last name and birth year');
      return;
    }

    if (!/^\d{4}$/.test(year)) {
      toast.error('Please enter a valid year (YYYY)');
      return;
    }

    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    setIsSearching(true);
    try {
      const statements = await searchStatements({ lastname, dob: year, phone_number: phoneNumber });
      setResults(statements);
      if (statements.length === 0) {
        toast.error('No statements found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error searching statements');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePreview = async (statement: Statement) => {
    if (!statement.file_url) {
      toast.error('Statement URL not available');
      return;
    }

    try {
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(statement.file_url)}&embedded=true`;
      window.open(viewerUrl, '_blank');
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to preview statement');
    }
  };

  const handleDownload = (statement: Statement) => {
    if (!statement.file_url) {
      toast.error('Statement URL not available');
      return;
    }

    window.open(statement.file_url, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDateForDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <FileText className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statement Retrieval</h1>
        <p className="text-gray-600">Search and access your patient statements</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter last name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Birth Year
              </label>
              <input
                type="text"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                maxLength={4}
                pattern="\d{4}"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="YYYY"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                pattern="\d{10}"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="8322288422"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSearching}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            <Search className="h-5 w-5 mr-2" />
            {isSearching ? 'Searching...' : 'Search Statements'}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((statement) => (
                  <tr key={statement.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {statement.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(statement.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateForDisplay(statement.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handlePreview(statement)}
                          className="text-blue-600 hover:text-blue-900 flex items-center transition-colors duration-150"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(statement)}
                          className="text-blue-600 hover:text-blue-900 flex items-center transition-colors duration-150"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}