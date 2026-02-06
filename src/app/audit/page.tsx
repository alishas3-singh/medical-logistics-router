'use client';

import { useState } from 'react';
import ShapPlot from '@/components/ShapPlot';
import DecisionTree from '@/components/DecisionTree';
import { Brain, TrendingUp, Activity } from 'lucide-react';

export default function AuditPage() {
  // Sample SHAP features data
  const [shapFeatures] = useState([
    { feature: 'High Severity', value: -8.5, baseValue: 25.0 },
    { feature: 'Traffic Congestion', value: 5.2, baseValue: 25.0 },
    { feature: 'Weather Conditions', value: 3.1, baseValue: 25.0 },
    { feature: 'Route Optimization', value: -2.8, baseValue: 25.0 },
    { feature: 'Time of Day', value: 1.5, baseValue: 25.0 },
    { feature: 'Distance', value: 4.2, baseValue: 25.0 },
  ]);

  const prediction = shapFeatures.reduce((sum, f) => sum + f.value, shapFeatures[0].baseValue);

  // Sample Decision Tree structure
  const [decisionTree] = useState({
    id: 'root',
    condition: 'Severity > 7?',
    value: 0,
    isLeaf: false,
    children: [
      {
        id: 'high-severity',
        condition: 'Yes → Traffic > 30%?',
        value: -5.0,
        isLeaf: false,
        children: [
          {
            id: 'high-sev-high-traffic',
            condition: 'Yes → Weather Factor > 0.6?',
            value: -8.5,
            isLeaf: true,
          },
          {
            id: 'high-sev-low-traffic',
            condition: 'No → Route Optimized?',
            value: -2.8,
            isLeaf: true,
          },
        ],
      },
      {
        id: 'low-severity',
        condition: 'No → Distance > 10km?',
        value: 3.0,
        isLeaf: false,
        children: [
          {
            id: 'low-sev-far',
            condition: 'Yes → Standard Route',
            value: 4.2,
            isLeaf: true,
          },
          {
            id: 'low-sev-near',
            condition: 'No → Quick Delivery',
            value: 1.5,
            isLeaf: true,
          },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="w-8 h-8 text-[#00f5ff]" />
            <h1 className="text-3xl font-bold text-white">Clinical XAI Audit</h1>
          </div>
          <p className="text-gray-400">
            Interpretable AI Panel for Emergency Medical Logistics Decision Analysis
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Model Accuracy</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">94.2%</div>
            <div className="text-xs text-gray-500 mt-1">±2.1% confidence</div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Avg. Time Saved</span>
              <Activity className="w-5 h-5 text-[#00f5ff]" />
            </div>
            <div className="text-3xl font-bold text-[#00f5ff]">-12.3 min</div>
            <div className="text-xs text-gray-500 mt-1">per critical delivery</div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Decisions</span>
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">1,247</div>
            <div className="text-xs text-gray-500 mt-1">last 24 hours</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SHAP Waterfall Plot */}
          <div>
            <ShapPlot features={shapFeatures} prediction={prediction} />
          </div>

          {/* Decision Tree */}
          <div>
            <DecisionTree tree={decisionTree} />
          </div>
        </div>

        {/* Feature Importance Summary */}
        <div className="mt-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Feature Importance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shapFeatures
              .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
              .map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a]"
                >
                  <span className="text-sm text-gray-300">{feature.feature}</span>
                  <span
                    className={`text-sm font-mono font-semibold ${
                      feature.value >= 0 ? 'text-blue-400' : 'text-[#ff3131]'
                    }`}
                  >
                    {feature.value >= 0 ? '+' : ''}
                    {feature.value.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
