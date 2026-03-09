/**
 * Moot Court Page
 * Main page for moot court simulations
 */

'use client';

import MootCourtInterface from '@/components/moot-court/MootCourtInterface';
import MootCourtLeaderboard from '@/components/moot-court/MootCourtLeaderboard';

export default function MootCourtPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Moot Court</h1>
        <p className="text-slate-600">Practice your advocacy skills with AI-powered courtroom simulations</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Moot Court Interface */}
        <div className="lg:col-span-2">
          <MootCourtInterface />
        </div>

        {/* Leaderboard */}
        <div>
          <MootCourtLeaderboard />
        </div>
      </div>

      {/* Features */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Moot Court Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div>
            <h4 className="font-medium mb-2">🎭 AI Judge Personas</h4>
            <p>Practice with different judge personalities and questioning styles</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">⚖️ Real-time Feedback</h4>
            <p>Get instant analysis and scoring on your arguments</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">📊 Performance Tracking</h4>
            <p>Monitor your progress and compete on the leaderboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
