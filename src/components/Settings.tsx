import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Save, AlertCircle, Plus, Trash2, Eye, EyeOff, Activity } from 'lucide-react';
import { getApiKeys, createApiKey, updateApiKey, deleteApiKey, ApiKey } from '../lib/supabase';

export const Settings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    setIsLoading(true);
    const keys = await getApiKeys();
    setApiKeys(keys);
    setIsLoading(false);
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      setSaveMessage('Please fill in both service name and API key');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setSaving(true);
    const { data, error } = await createApiKey(newKeyName.trim(), newKeyValue.trim());
    
    if (error) {
      setSaveMessage('Error creating API key: ' + error.message);
    } else {
      setSaveMessage('API key created successfully!');
      setNewKeyName('');
      setNewKeyValue('');
      await loadApiKeys();
    }
    
    setSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleToggleActive = async (key: ApiKey) => {
    const { error } = await updateApiKey(key.id, { is_active: !key.is_active });
    
    if (error) {
      setSaveMessage('Error updating API key: ' + error.message);
    } else {
      setSaveMessage(`API key ${key.is_active ? 'deactivated' : 'activated'} successfully!`);
      await loadApiKeys();
    }
    
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) {
      return;
    }

    const { error } = await deleteApiKey(keyId);
    
    if (error) {
      setSaveMessage('Error deleting API key: ' + error.message);
    } else {
      setSaveMessage('API key deleted successfully!');
      await loadApiKeys();
    }
    
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="space-y-8">
        {/* Header */}
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

          {/* API Key Management */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Key className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-800">API Key Management</h3>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-indigo-800 font-bold text-lg">Global API Key Configuration</p>
                    <p className="text-indigo-700 text-sm mt-2 leading-relaxed">
                      These API keys are used globally across the platform for all users. Only administrators 
                      can view and modify these settings. Keys are stored securely and used for all 
                      handwriting conversion requests.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add New API Key */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h4 className="text-lg font-bold text-slate-800 mb-4">Add New API Key</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., gemini, openai"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={newKeyValue}
                      onChange={(e) => setNewKeyValue(e.target.value)}
                      placeholder="Enter API key"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCreateKey}
                  disabled={isSaving}
                  className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSaving ? 'Adding...' : 'Add API Key'}</span>
                </button>
              </div>

              {/* Existing API Keys */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-800">Existing API Keys</h4>
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Key className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No API keys configured yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h5 className="text-lg font-bold text-slate-800 capitalize">{key.service_name}</h5>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                key.is_active 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {key.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <code className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                {showKeys[key.id] ? key.api_key : maskApiKey(key.api_key)}
                              </code>
                              <button
                                onClick={() => toggleKeyVisibility(key.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                {showKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Created {new Date(key.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleActive(key)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                key.is_active
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {key.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteKey(key.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-800">Usage Statistics</h3>
            </div>
          </div>
          <div className="p-8">
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
                <p className="text-sm font-medium text-slate-600">Active API Keys</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{apiKeys.filter(k => k.is_active).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-lg font-medium ${
            saveMessage.includes('Error') 
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
};