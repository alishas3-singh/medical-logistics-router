'use client';

import { useState, useEffect } from 'react';
import { Save, ShieldCheck, Key, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    // Load existing key from local storage if available
    const savedKey = localStorage.getItem('tomtom_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSave = () => {
    setStatus('saving');
    localStorage.setItem('tomtom_api_key', apiKey);
    setTimeout(() => {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[#00f5ff] mb-2">System Settings</h1>
          <p className="text-gray-400">Configure mission control parameters and API integrations.</p>
        </header>

        <div className="space-y-6">
          {/* API Configuration Section */}
          <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-[#00f5ff]/10 rounded-lg">
                <Key className="w-5 h-5 text-[#00f5ff]" />
              </div>
              <h2 className="text-lg font-semibold">External API Integration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                  TomTom Traffic API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your TomTom API key"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5ff] transition-all"
                />
                <p className="mt-2 text-[10px] text-gray-500">
                  Required for real-time Seattle traffic flow and Life-Cost Indexing.
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={status === 'saving'}
                className="flex items-center justify-center space-x-2 w-full py-3 bg-[#00f5ff] hover:bg-[#00d8e0] text-[#0a0a0a] font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {status === 'saving' ? (
                  <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                ) : status === 'saved' ? (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Configuration Locked</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Configuration</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* System Status Section */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex items-center space-x-2 text-gray-400 mb-2">
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Region</span>
              </div>
              <div className="text-sm font-semibold">Seattle/Tacoma (US-West)</div>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex items-center space-x-2 text-green-400 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">Network</span>
              </div>
              <div className="text-sm font-semibold">Live Pipeline Active</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Add the missing Activity import used in the UI
function Activity({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  );
}