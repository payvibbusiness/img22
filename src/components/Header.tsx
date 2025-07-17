import React, { useState } from 'react';
import { FileText, LogOut, Settings, User, CreditCard, Menu, X, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { profile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (view: string) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                HandScript AI
              </h1>
              <p className="text-sm text-slate-500 hidden sm:block font-medium">Professional OCR Solutions</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => onViewChange('scanner')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'scanner'
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                Scanner
              </button>
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                Dashboard
              </button>
              {profile?.is_admin && (
                <button
                  onClick={() => onViewChange('settings')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    currentView === 'settings'
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  Admin Settings
                </button>
              )}
            </nav>

            {/* Desktop User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{profile?.full_name || profile?.email}</p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    profile?.subscription_type === 'premium'
                      ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {profile?.subscription_type === 'premium' ? (
                      <><Zap className="w-3 h-3 mr-1" />Premium</>
                    ) : (
                      'Free'
                    )}
                  </span>
                  <span className="text-xs text-slate-500">
                    {profile?.scans_used}/{profile?.is_admin ? '∞' : profile?.max_scans} scans
                  </span>
                </div>
              </div>

              {profile?.subscription_type === 'free' && !profile?.is_admin && (
                <button
                  onClick={() => onViewChange('upgrade')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg flex items-center space-x-2 shadow-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Upgrade</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="bg-slate-100 text-slate-700 p-2.5 rounded-lg transition-all duration-200 hover:bg-slate-200 hover:shadow-sm"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {profile?.subscription_type === 'free' && !profile?.is_admin && (
              <button
                onClick={() => handleNavClick('upgrade')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg flex items-center space-x-1 shadow-sm"
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">Pro</span>
              </button>
            )}
            <button
              onClick={toggleMobileMenu}
              className="bg-slate-100 text-slate-700 p-2.5 rounded-lg transition-all duration-200 hover:bg-slate-200 hover:shadow-sm"
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
                    <p className="font-semibold text-slate-800">{profile?.full_name || profile?.email}</p>
                    <p className="text-sm text-slate-500">{profile?.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      profile?.subscription_type === 'premium'
                        ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {profile?.subscription_type === 'premium' ? (
                        <><Zap className="w-3 h-3 mr-1" />Premium</>
                      ) : (
                        'Free'
                      )}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {profile?.scans_used}/{profile?.is_admin ? '∞' : profile?.max_scans} scans
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <button
                onClick={() => handleNavClick('scanner')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'scanner'
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                Scanner
              </button>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                Dashboard
              </button>
              {profile?.is_admin && (
                <button
                  onClick={() => handleNavClick('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentView === 'settings'
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  Admin Settings
                </button>
              )}

              {/* Mobile Logout */}
              <button
                onClick={handleLogout}
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