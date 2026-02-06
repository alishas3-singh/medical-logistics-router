'use client';

import { GitBranch, CheckCircle, XCircle } from 'lucide-react';

interface TreeNode {
  id: string;
  condition: string;
  value: number;
  children?: TreeNode[];
  isLeaf: boolean;
}

interface DecisionTreeProps {
  tree: TreeNode;
}

export default function DecisionTree({ tree }: DecisionTreeProps) {
  const renderNode = (node: TreeNode, depth: number = 0): JSX.Element => {
    const indent = depth * 40;
    const isPositive = node.value >= 0;

    return (
      <div key={node.id} className="relative">
        <div
          className="flex items-center space-x-3 mb-4"
          style={{ marginLeft: `${indent}px` }}
        >
          {node.isLeaf ? (
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isPositive
                ? 'bg-green-900/30 border border-green-700'
                : 'bg-red-900/30 border border-red-700'
            }`}>
              {isPositive ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm font-mono text-white">
                {node.condition}: {node.value.toFixed(2)} min
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <GitBranch className="w-4 h-4 text-[#00f5ff]" />
              <span className="text-sm text-gray-300">{node.condition}</span>
              <span className="text-xs text-gray-500 font-mono">
                → {node.value.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        
        {node.children && (
          <div className="ml-8">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <GitBranch className="w-5 h-5 text-[#00f5ff]" />
        <span>Decision Tree Visualization</span>
      </h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {renderNode(tree)}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-3 h-3" />
            <span>Decision node: evaluates condition</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span>Leaf node: final prediction (time-saving path)</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="w-3 h-3 text-red-400" />
            <span>Leaf node: final prediction (delay path)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
