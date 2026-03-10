/**
 * Learning Dashboard Page
 * Main dashboard for learning modules, progress, and AI recommendations
 */

'use client';

import { useRouter } from 'next/navigation';
import ProgressWidget from '@/src/components/Dashboard/ProgressWidget';
import AIRecommendations from '@/src/components/Dashboard/AIRecommendations';

export default function LearningDashboardPage() {
  const router = useRouter();

  const handleBrowseModules = () => {
    router.push('/dashboard/modules');
  };

  const handleStartSimulation = () => {
    router.push('/dashboard/simulations');
  };

  const handleAIAssistant = () => {
    router.push('/dashboard/ai-assistant');
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Learning Dashboard</h1>
          <p className="text-slate-600">Track your progress and get personalized recommendations</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Progress */}
          <div className="lg:col-span-2 space-y-6">
            <ProgressWidget />
          </div>

          {/* Right Column - AI Recommendations */}
          <div className="space-y-6">
            <AIRecommendations />
            
            {/* Quick Actions */}
            <div className="rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleBrowseModules}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Browse Modules
                </button>
                <button 
                  onClick={handleStartSimulation}
                  className="w-full bg-slate-100 text-slate-900 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Start Simulation
                </button>
                <button 
                  onClick={handleAIAssistant}
                  className="w-full bg-slate-100 text-slate-900 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
