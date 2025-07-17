import React, { useState, useRef } from 'react';
import { Upload, FileText, Copy, CheckCircle, AlertCircle, Image as ImageIcon, Loader2, Lock } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Scan Limit Reached</h2>
          <p className="text-slate-600 mb-6">
            You've used your free scan. Upgrade to Premium for unlimited scans and advanced features.
          </p>
          <button
            onClick={() => onViewChange('upgrade')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:from-yellow-600 hover:to-orange-600"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">Upload Image</h2>
                </div>
                <div className="text-sm text-slate-500">
                  {user?.scansUsed}/{user?.maxScans === 1000 ? '∞' : user?.maxScans} scans used
                </div>
              </div>
            </div>

            <div className="p-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  selectedFile 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
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
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-green-800">{selectedFile.name}</p>
                      <p className="text-sm text-green-600">Ready for conversion</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ImageIcon className="w-12 h-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-slate-700">Drop your image here</p>
                      <p className="text-sm text-slate-500">or click to browse files</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="mt-6 space-y-4">
                  <button
                    onClick={convertHandwriting}
                    disabled={isConverting || !canActuallyScan}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Converting...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        <span>Convert to Text</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={resetApp}
                    className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:bg-slate-200"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-medium text-slate-800">Image Preview</h3>
              </div>
              <div className="p-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">Converted Text</h2>
                </div>
                {result && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600 font-medium">Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-6">
              {error && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {isConverting && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-slate-600">Analyzing handwriting...</p>
                </div>
              )}

              {result && !isConverting && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                      {result.text}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Text extracted successfully. Document saved to your dashboard.
                  </div>
                </div>
              )}

              {!result && !isConverting && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <FileText className="w-12 h-12 text-slate-300" />
                  <p className="text-slate-500">Upload an image to see the converted text here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};