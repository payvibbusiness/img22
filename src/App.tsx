import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { Scanner } from './components/Scanner';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Upgrade } from './components/Upgrade';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('scanner');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-2 border-indigo-100 animate-pulse mx-auto"></div>
          </div>
          <p className="text-lg font-semibold text-slate-700">Loading HandScript AI...</p>
          <p className="text-sm text-slate-500 mt-1">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return user.isAdmin ? <Settings /> : <Scanner onViewChange={setCurrentView} />;
      case 'upgrade':
        return <Upgrade onViewChange={setCurrentView} />;
      default:
        return <Scanner onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;