'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Key, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [tomtomKey, setTomtomKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!tomtomKey.trim()) {
      setError('TomTom API key is required');
      return;
    }
    
    // In a real app, this would save to backend or environment
    // For now, we'll just show success
    setSaved(true);
    setError(null);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-[#00f5ff]" />
            <h1 className="text-3xl font-bold text-white">API Configuration</h1>
          </div>
          <p className="text-gray-400">
            Manage API keys and external service integrations
          </p>
        </div>

        {/* API Keys Section */}
        <div className="space-y-6">
          {/* TomTom API Key */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Key className="w-5 h-5 text-[#00f5ff]" />
              <h2 className="text-xl font-semibold text-white">TomTom Routing API</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={tomtomKey}
                  onChange={(e) => {
                    setTomtomKey(e.target.value);
                    setSaved(false);
                    setError(null);
                  }}
                  placeholder="Enter your TomTom API key"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff] transition-colors"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Get your API key from{' '}
                  <a
                    href="https://developer.tomtom.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00f5ff] hover:underline"
                  >
                    TomTom Developer Portal
                  </a>
                </p>
              </div>

              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}

              {saved && (
                <div className="flex items-center space-x-2 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Settings saved successfully!</span>
                </div>
              )}

              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-3 bg-[#00f5ff] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#00d4e6] transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>

          {/* Other API Configurations */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <SettingsIcon className="w-5 h-5 text-[#00f5ff]" />
              <h2 className="text-xl font-semibold text-white">Other Services</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Open-Meteo API
                </label>
                <div className="px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
                  <span className="text-sm text-gray-400">No API key required (public API)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Weather Service Status
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-400">Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environment Variables Info */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Environment Variables</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>
                For production deployment (Vercel), set the following environment variable:
              </p>
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4 font-mono text-xs">
                <div className="text-[#00f5ff]">NEXT_PUBLIC_TOMTOM_KEY</div>
                <div className="text-gray-500 mt-1">= your_tomtom_api_key_here</div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Note: In development, use <code className="bg-[#0a0a0a] px-2 py-1 rounded">.env.local</code> file
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
