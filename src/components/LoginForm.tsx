import React, { useState } from 'react';
import { Mail, Lock, Loader2, FileText, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { 
      email: 'user@demo.com', 
      type: 'Free User', 
      scans: '0/1',
      icon: Users,
      color: 'text-slate-600'
    },
    { 
      email: 'premium@demo.com', 
      type: 'Premium User', 
      scans: '5/1000',
      icon: Zap,
      color: 'text-amber-600'
    },
    { 
      email: 'admin@handscript.ai', 
      type: 'Admin', 
      scans: '∞/∞',
      icon: Shield,
      color: 'text-indigo-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl inline-block mb-6 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            HandScript AI
          </h1>
          <p className="text-slate-600 text-lg font-medium">Professional OCR Solutions</p>
          <p className="text-slate-500 text-sm mt-1">Convert handwriting to digital text with AI precision</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Demo Accounts</h3>
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                onClick={() => {
                  setEmail(account.email);
                  setPassword('demo123');
                }}
                className="flex items-center justify-between p-4 bg-white/60 rounded-xl cursor-pointer hover:bg-white/80 transition-all duration-200 hover:shadow-md border border-slate-100"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-slate-100 ${account.color}`}>
                    <account.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{account.type}</p>
                    <p className="text-sm text-slate-500">{account.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-600">Scans: {account.scans}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-5 text-center font-medium">
            Click any account to auto-fill credentials
          </p>
        </div>
      </div>
    </div>
  );
};