'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface ShapFeature {
  feature: string;
  value: number; // SHAP value (positive = time-saving, negative = delay)
  baseValue: number;
}

interface ShapPlotProps {
  features: ShapFeature[];
  prediction: number;
}

export default function ShapPlot({ features, prediction }: ShapPlotProps) {
  // Calculate cumulative values for waterfall
  const cumulativeValues = [0];
  features.forEach((f) => {
    cumulativeValues.push(cumulativeValues[cumulativeValues.length - 1] + f.value);
  });

  const maxAbsValue = Math.max(
    ...features.map((f) => Math.abs(f.value)),
    Math.abs(prediction)
  );

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-[#00f5ff]" />
        <span>SHAP Waterfall Plot</span>
      </h3>
      
      <div className="space-y-3">
        {/* Base Value */}
        <div className="flex items-center space-x-4">
          <div className="w-32 text-sm text-gray-400">Base Value</div>
          <div className="flex-1 relative h-8 bg-[#0a0a0a] rounded">
            <div
              className="absolute top-0 left-0 h-full bg-gray-600 rounded"
              style={{ width: '20%' }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-mono">
              {features[0]?.baseValue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Feature Contributions */}
        {features.map((feature, index) => {
          const isPositive = feature.value >= 0;
          const widthPercent = (Math.abs(feature.value) / maxAbsValue) * 100;
          const cumulativeStart = cumulativeValues[index];
          const cumulativeEnd = cumulativeValues[index + 1];

          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-32 text-sm text-gray-300 truncate">{feature.feature}</div>
              <div className="flex-1 relative h-8">
                {/* Background bar showing cumulative position */}
                <div className="absolute inset-0 bg-[#0a0a0a] rounded" />
                
                {/* Contribution bar */}
                <div
                  className={`absolute top-0 h-full rounded ${
                    isPositive
                      ? 'bg-blue-600 text-blue-100'
                      : 'bg-[#ff3131] text-red-100'
                  }`}
                  style={{
                    left: `${((cumulativeStart + maxAbsValue) / (maxAbsValue * 2)) * 100}%`,
                    width: `${widthPercent}%`,
                  }}
                />
                
                {/* Value label */}
                <div
                  className={`absolute inset-0 flex items-center justify-center text-xs font-mono font-semibold ${
                    isPositive ? 'text-blue-100' : 'text-red-100'
                  }`}
                  style={{
                    left: `${((cumulativeStart + maxAbsValue) / (maxAbsValue * 2)) * 100}%`,
                    width: `${widthPercent}%`,
                  }}
                >
                  {isPositive ? '+' : ''}{feature.value.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Prediction Line */}
        <div className="pt-2 border-t border-[#2a2a2a]">
          <div className="flex items-center space-x-4">
            <div className="w-32 text-sm font-semibold text-[#00f5ff]">Prediction</div>
            <div className="flex-1 relative h-10">
              <div className="absolute inset-0 bg-[#0a0a0a] rounded" />
              <div
                className="absolute top-0 h-full bg-gradient-to-r from-[#00f5ff] to-[#00a8cc] rounded flex items-center justify-center"
                style={{
                  left: `${((prediction + maxAbsValue) / (maxAbsValue * 2)) * 100}%`,
                  width: '4px',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-sm font-mono font-bold text-[#00f5ff]">
                  {prediction.toFixed(2)} min
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-6 text-xs text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded" />
          <span>Time-saving features</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#ff3131] rounded" />
          <span>Delay features</span>
        </div>
      </div>
    </div>
  );
}
