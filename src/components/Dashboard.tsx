import React, { useState, useEffect } from 'react';
import { FileText, Search, Calendar, Copy, Trash2, Eye, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Document } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    // Load documents from localStorage (mock)
    const savedDocs = JSON.parse(localStorage.getItem('documents') || '[]');
    const userDocs = savedDocs.filter((doc: Document) => doc.userId === user?.id);
    setDocuments(userDocs);
  }, [user?.id]);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.originalText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteDocument = (docId: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== docId);
    setDocuments(updatedDocs);
    
    // Update localStorage
    const allDocs = JSON.parse(localStorage.getItem('documents') || '[]');
    const filteredAllDocs = allDocs.filter((doc: Document) => doc.id !== docId);
    localStorage.setItem('documents', JSON.stringify(filteredAllDocs));
    
    if (selectedDocument?.id === docId) {
      setSelectedDocument(null);
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Documents List */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Your Documents</h2>
                <div className="text-sm text-slate-500">
                  {documents.length} document{documents.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredDocuments.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">
                    {documents.length === 0 ? 'No documents yet' : 'No documents match your search'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className={`p-4 cursor-pointer transition-colors duration-200 ${
                        selectedDocument?.id === doc.id
                          ? 'bg-blue-50 border-r-4 border-blue-500'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-800 truncate">{doc.title}</h3>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {doc.originalText.substring(0, 100)}...
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">
                              {formatDate(doc.createdAt)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDocument(doc.id);
                          }}
                          className="ml-2 p-1 text-slate-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
            {selectedDocument ? (
              <>
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">{selectedDocument.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyText(selectedDocument.originalText)}
                        className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Export</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Created {formatDate(selectedDocument.createdAt)}
                  </p>
                </div>

                <div className="p-6">
                  {selectedDocument.imageUrl && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Original Image</h4>
                      <img
                        src={selectedDocument.imageUrl}
                        alt="Original"
                        className="w-full max-w-md h-auto rounded-lg border border-slate-200"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Extracted Text</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                        {selectedDocument.originalText}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Eye className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">Select a Document</h3>
                <p className="text-slate-500">Choose a document from the list to view its details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};