import React, { useState, useRef } from 'react';
import { Upload, FileText, Copy, CheckCircle, AlertCircle, Image as ImageIcon, Loader2, Lock, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ConversionResult, Document } from '../types';

interface ScannerProps {
  onViewChange: (view: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onViewChange }) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canScan = user && user.scansUsed < user.maxScans;
  const isAtLimit = user && user.scansUsed >= user.maxScans && user.subscription === 'free' && !user.isAdmin;
  
  // Ensure admin users can always scan
  const canActuallyScan = user && (user.isAdmin || user.scansUsed < user.maxScans);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setError(null);
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
    });
  };

  const convertHandwriting = async () => {
    if (!selectedFile || !canActuallyScan) {
      setError('Unable to process scan');
      return;
    }

    // Check if admin has configured the API key
    const appSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    if (!appSettings.geminiApiKey) {
      setError('Service temporarily unavailable. Please contact support.');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      // Convert image to base64
      const base64Image = await convertToBase64(selectedFile);
      
      // Make request to Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${appSettings.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: "Extract all text from this handwritten image. Return only the extracted text, nothing else. If no text is found, return 'No text detected'."
              },
              {
                inline_data: {
                  mime_type: selectedFile.type,
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('No text could be extracted from the image');
      }

      const extractedText = data.candidates[0].content.parts[0].text.trim();
      
      if (!extractedText || extractedText.toLowerCase() === 'no text detected') {
        throw new Error('No readable text found in the image');
      }

      setResult({ text: extractedText });

      // Save to user's documents (mock)
      const newDocument: Document = {
        id: Date.now().toString(),
        userId: user!.id,
        title: selectedFile.name,
        originalText: extractedText,
        imageUrl: previewUrl || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update user's scan count (mock)
      const updatedUser = { ...user!, scansUsed: user!.scansUsed + 1 };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Save document (mock)
      const existingDocs = JSON.parse(localStorage.getItem('documents') || '[]');
      existingDocs.push(newDocument);
      localStorage.setItem('documents', JSON.stringify(existingDocs));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert handwriting');
    } finally {
      setIsConverting(false);
    }
  };

  const copyToClipboard = async () => {
    if (result?.text) {
      try {
        await navigator.clipboard.writeText(result.text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        setError('Failed to copy text to clipboard');
      }
    }
  };

  const resetApp = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setIsCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isAtLimit) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Lock className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Scan Limit Reached</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
            You've used your free scan. Upgrade to Premium for unlimited scans, advanced AI processing, and professional features.
          </p>
          <button
            onClick={() => onViewChange('upgrade')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg shadow-md flex items-center space-x-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            <span>Upgrade to Premium</span>
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-xl shadow-sm">
                    <Upload className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Upload Document</h2>
                </div>
                <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                  {user?.scansUsed}/{user?.maxScans === 1000 ? '∞' : user?.maxScans} scans used
                </div>
              </div>
            </div>

            <div className="p-8">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  selectedFile 
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-inner' 
                    : 'border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50 hover:border-indigo-400 hover:from-indigo-50 hover:to-purple-50 hover:shadow-md'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="space-y-3">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto drop-shadow-sm" />
                    <div>
                      <p className="text-xl font-bold text-green-800">{selectedFile.name}</p>
                      <p className="text-sm font-medium text-green-600 mt-1">Ready for AI processing</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ImageIcon className="w-16 h-16 text-slate-400 mx-auto drop-shadow-sm" />
                    <div>
                      <p className="text-xl font-bold text-slate-700">Drop your document here</p>
                      <p className="text-sm font-medium text-slate-500 mt-1">or click to browse files</p>
                      <p className="text-xs text-slate-400 mt-2">Supports JPG, PNG, HEIC, and more</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="mt-8 space-y-4">
                  <button
                    onClick={convertHandwriting}
                    disabled={isConverting || !canActuallyScan}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Extract Text with AI</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={resetApp}
                    className="w-full bg-slate-100 text-slate-700 py-4 px-6 rounded-xl font-semibold transition-all duration-200 hover:bg-slate-200 hover:shadow-sm"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
                <h3 className="font-bold text-slate-800">Document Preview</h3>
              </div>
              <div className="p-6">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-xl shadow-md border border-slate-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 min-h-[500px] flex flex-col">
            <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-3 rounded-xl shadow-sm">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Extracted Text</h2>
                </div>
                {result && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 hover:shadow-sm font-medium"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600 font-semibold">Copy Text</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-8">
              {error && (
                <div className="flex items-center space-x-3 p-5 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {isConverting && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-2 border-indigo-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-700">AI Processing Document...</p>
                    <p className="text-sm text-slate-500 mt-1">Analyzing handwriting patterns</p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>This usually takes 5-10 seconds</span>
                  </div>
                </div>
              )}

              {result && !isConverting && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-6 shadow-inner">
                    <div className="whitespace-pre-wrap text-slate-800 leading-relaxed font-medium">
                      {result.text}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Text extracted successfully</span>
                    </div>
                    <span>Document saved to dashboard</span>
                  </div>
                </div>
              )}

              {!result && !isConverting && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <FileText className="w-16 h-16 text-slate-300 drop-shadow-sm" />
                  <div>
                    <p className="text-lg font-semibold text-slate-500">Ready for Processing</p>
                    <p className="text-sm text-slate-400 mt-1">Upload a document to extract text with AI</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};