import React, { useState } from 'react';
import { FileText, LogOut, Settings, User, CreditCard, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (view: string) => {
    onViewChange(view);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

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
              <p className="text-sm text-slate-600 hidden sm:block">Professional handwriting conversion</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-1">
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

            {/* Desktop User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
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
                  <span>Upgrade</span>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user?.subscription === 'free' && (
              <button
                onClick={() => handleNavClick('upgrade')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:from-yellow-600 hover:to-orange-600 flex items-center space-x-1"
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">Pro</span>
              </button>
            )}
            <button
              onClick={toggleMobileMenu}
              className="bg-slate-100 text-slate-700 p-2 rounded-lg transition-all duration-200 hover:bg-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
            <div className="pt-4 space-y-2">
              {/* Mobile User Info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{user?.name}</p>
                    <p className="text-sm text-slate-600">{user?.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user?.subscription === 'premium'
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user?.subscription === 'premium' ? '✨ Premium' : 'Free'}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {user?.scansUsed}/{user?.isAdmin || user?.maxScans === Infinity ? '∞' : user?.maxScans} scans
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <button
                onClick={() => handleNavClick('scanner')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'scanner'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Scanner
              </button>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </button>
              {user?.isAdmin && (
                <button
                  onClick={() => handleNavClick('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentView === 'settings'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Admin Settings
                </button>
              )}

              {/* Mobile Logout */}
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};