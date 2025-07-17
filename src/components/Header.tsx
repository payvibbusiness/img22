import React from 'react';
import { FileText, LogOut, Settings, User, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">HandScript AI</h1>
              <p className="text-sm text-slate-600">Professional handwriting conversion</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => onViewChange('scanner')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'scanner'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Scanner
              </button>
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </button>
              {user?.isAdmin && (
                <button
                  onClick={() => onViewChange('settings')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentView === 'settings'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Admin Settings
                </button>
              )}
            </nav>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user?.subscription === 'premium'
                      ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user?.subscription === 'premium' ? '✨ Premium' : 'Free'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {user?.scansUsed}/{user?.isAdmin || user?.maxScans === Infinity ? '∞' : user?.maxScans} scans
                  </span>
                </div>
              </div>

              {user?.subscription === 'free' && (
                <button
                  onClick={() => onViewChange('upgrade')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:from-yellow-600 hover:to-orange-600 flex items-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Upgrade</span>
                </button>
              )}

              <button
                onClick={logout}
                className="bg-slate-100 text-slate-700 p-2 rounded-lg transition-all duration-200 hover:bg-slate-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};