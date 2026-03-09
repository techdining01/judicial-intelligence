"use client";

import { useState } from 'react';
import MootCourtInterface from '@/components/moot-court/MootCourtInterface';
import MootCourtLeaderboard from '@/components/moot-court/MootCourtLeaderboard';

export default function MootCourtPage() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'leaderboard'>('simulation');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Moot Court</h1>
        <p className="text-slate-600 mb-8">
          Practice your advocacy skills against AI judges with different personas and specializations
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'simulation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Court Simulation
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'leaderboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Leaderboard
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'simulation' && <MootCourtInterface />}
      {activeTab === 'leaderboard' && <MootCourtLeaderboard />}
    </div>
  );
}