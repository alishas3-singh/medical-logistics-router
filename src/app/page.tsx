import Link from 'next/link';
import { MapPin, FileText, Settings, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#00f5ff] to-[#00a8cc] rounded-2xl mb-6">
            <MapPin className="w-10 h-10 text-[#0a0a0a]" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Mission Control
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Emergency Medical Logistics Dashboard
          </p>
          <p className="text-sm text-gray-500">
            High-fidelity real-time dispatch and clinical AI audit system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/dispatch"
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#00f5ff] transition-colors group"
          >
            <MapPin className="w-8 h-8 text-[#00f5ff] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Live Dispatch</h3>
            <p className="text-sm text-gray-400 mb-4">
              Real-time map view with weather and traffic integration
            </p>
            <div className="flex items-center justify-center text-[#00f5ff] text-sm font-medium">
              View Map <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/audit"
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#00f5ff] transition-colors group"
          >
            <FileText className="w-8 h-8 text-[#00f5ff] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Clinical Audit</h3>
            <p className="text-sm text-gray-400 mb-4">
              Interpretable AI with SHAP plots and decision trees
            </p>
            <div className="flex items-center justify-center text-[#00f5ff] text-sm font-medium">
              View Audit <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/settings"
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#00f5ff] transition-colors group"
          >
            <Settings className="w-8 h-8 text-[#00f5ff] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Settings</h3>
            <p className="text-sm text-gray-400 mb-4">
              Configure API keys and service integrations
            </p>
            <div className="flex items-center justify-center text-[#00f5ff] text-sm font-medium">
              Configure <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="text-xs text-gray-500">
          Built with Next.js, Tailwind CSS, and React-Leaflet
        </div>
      </div>
    </div>
  );
}
