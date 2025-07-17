import React, { useState, useEffect } from 'react';
import { FileText, Search, Calendar, Copy, Trash2, Eye, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserDocuments, deleteDocument, Document } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      if (user) {
        setIsLoading(true);
        const userDocs = await getUserDocuments(user.id);
        setDocuments(userDocs);
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [user]);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.original_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteDocument = async (docId: string) => {
    const { error } = await deleteDocument(docId);
    if (!error) {
      setDocuments(documents.filter(doc => doc.id !== docId));
      if (selectedDocument?.id === docId) {
        setSelectedDocument(null);
      }
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your documents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Documents List */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Your Documents</h2>
                <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                  {documents.length} document{documents.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredDocuments.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-6 drop-shadow-sm" />
                  <p className="text-lg font-semibold text-slate-500 mb-2">
                    {documents.length === 0 ? 'No documents yet' : 'No documents match your search'}
                  </p>
                  <p className="text-sm text-slate-400">
                    {documents.length === 0 ? 'Upload your first document to get started' : 'Try adjusting your search terms'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className={`p-6 cursor-pointer transition-all duration-200 ${
                        selectedDocument?.id === doc.id
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-r-4 border-indigo-500 shadow-sm'
                          : 'hover:bg-slate-50 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 truncate text-lg">{doc.title}</h3>
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                            {doc.original_text.substring(0, 100)}...
                          </p>
                          <div className="flex items-center space-x-2 mt-3">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-medium text-slate-500">
                              {formatDate(doc.created_at)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(doc.id);
                          }}
                          className="ml-3 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 min-h-[600px]">
            {selectedDocument ? (
              <>
                <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800">{selectedDocument.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyText(selectedDocument.original_text)}
                        className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 hover:shadow-sm font-medium"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl transition-all duration-200 hover:shadow-sm font-medium">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Export</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-2">
                    Created {formatDate(selectedDocument.created_at)}
                  </p>
                </div>

                <div className="p-8">
                  {selectedDocument.image_url && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-slate-700 mb-3">Original Document</h4>
                      <img
                        src={selectedDocument.image_url}
                        alt="Original"
                        className="w-full max-w-md h-auto rounded-xl border border-slate-200 shadow-md"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Extracted Text</h4>
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-6 shadow-inner">
                      <div className="whitespace-pre-wrap text-slate-800 leading-relaxed font-medium">
                        {selectedDocument.original_text}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Eye className="w-16 h-16 text-slate-300 mb-6 drop-shadow-sm" />
                <h3 className="text-xl font-bold text-slate-700 mb-3">Select a Document</h3>
                <p className="text-slate-500 text-lg">Choose a document from the list to view its details</p>
                <p className="text-slate-400 text-sm mt-2">All your processed documents appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};