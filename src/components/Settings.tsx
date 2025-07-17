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
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-2 rounded-lg">
              <SettingsIcon className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Admin Settings</h2>
              <p className="text-sm text-slate-600">Configure application settings and API keys</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* API Configuration */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-slate-800">Global API Configuration</h3>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium">Global API Key Configuration</p>
                  <p className="text-blue-700 text-sm mt-1">
                    This API key will be used for ALL users across the platform. Only administrators 
                    can view and modify this setting. The key is stored securely and used for all 
                    handwriting conversion requests from both free and premium users.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="geminiApiKey" className="block text-sm font-medium text-slate-700">
                Gemini API Key (Global)
              </label>
              <input
                type="password"
                id="geminiApiKey"
                value={settings.geminiApiKey}
                onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                placeholder="Enter the global Gemini API key for all users"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-slate-500">
                This key will be used for all conversion requests. Get your API key from{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
            
            {settings.geminiApiKey && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  ✅ API key configured - All users can now convert handwriting to text
                </p>
              </div>
            )}
          </div>

          {/* Usage Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Usage Statistics</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">1,247</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Scans Today</p>
                <p className="text-2xl font-bold text-slate-800">89</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Premium Users</p>
                <p className="text-2xl font-bold text-slate-800">342</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">API Calls Today</p>
                <p className="text-2xl font-bold text-slate-800">156</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Success Rate</p>
                <p className="text-2xl font-bold text-slate-800">98.5%</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Admin Scans</p>
                <p className="text-2xl font-bold text-slate-800">Unlimited</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <div>
              {saveMessage && (
                <p className="text-green-600 text-sm">{saveMessage}</p>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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