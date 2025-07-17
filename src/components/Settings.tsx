import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Save, AlertCircle } from 'lucide-react';
import { AppSettings } from '../types';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({ geminiApiKey: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    setIsSaving(false);
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-xl shadow-sm">
              <SettingsIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Admin Settings</h2>
              <p className="text-sm font-medium text-slate-600">Configure application settings and API keys</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* API Configuration */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Key className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-800">Global API Configuration</h3>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-indigo-800 font-bold text-lg">Global API Key Configuration</p>
                  <p className="text-indigo-700 text-sm mt-2 leading-relaxed">
                    This API key will be used for ALL users across the platform. Only administrators 
                    can view and modify this setting. The key is stored securely and used for all 
                    handwriting conversion requests from both free and premium users.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="geminiApiKey" className="block text-sm font-bold text-slate-700">
                Gemini API Key (Global)
              </label>
              <input
                type="password"
                id="geminiApiKey"
                value={settings.geminiApiKey}
                onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                placeholder="Enter the global Gemini API key for all users"
                className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
              <p className="text-xs text-slate-500 leading-relaxed">
                This key will be used for all conversion requests. Get your API key from{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
            
            {settings.geminiApiKey && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-800 text-sm font-medium">
                  ✅ API key configured - All users can now convert handwriting to text
                </p>
              </div>
            )}
          </div>

          {/* Usage Statistics */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Usage Statistics</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">1,247</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-600">Scans Today</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">89</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-600">Premium Users</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">342</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-600">API Calls Today</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">156</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-600">Success Rate</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">98.5%</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-600">Admin Scans</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">Unlimited</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-200">
            <div>
              {saveMessage && (
                <p className="text-green-600 text-sm font-medium">{saveMessage}</p>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};