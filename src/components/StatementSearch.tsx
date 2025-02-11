import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { searchStatements } from '../lib/database';
import type { Statement } from '../lib/types';
import toast from 'react-hot-toast';

export function StatementSearch() {
  const [lastname, setLastname] = useState('');
  const [dob, setDob] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Statement[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastname || !dob) {
      toast.error('Please enter both last name and date of birth');
      return;
    }

    setIsSearching(true);
    try {
      const statements = await searchStatements({ lastname, dob });
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

  const handleDownload = (statement: Statement) => {
    if (!statement.content) {
      toast.error('Statement content not available');
      return;
    }

    const blob = new Blob([statement.content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = statement.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDateForInput = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
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
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
              Date of Birth (MM-DD-YYYY)
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSearching}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? 'Searching...' : 'Search Statements'}
        </button>
      </form>

      {results.length > 0 && (
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
                <tr key={statement.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {statement.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(statement.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateForDisplay(statement.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDownload(statement)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}