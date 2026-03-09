/**
 * AI Recommendations Component
 * Displays AI-powered learning recommendations
 */

'use client';

import { Lightbulb, TrendingUp, Target, Zap, BookOpen, Beaker } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'module' | 'simulation' | 'research' | 'practice';
  title: string;
  description: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
}

interface AIRecommendationsProps {
  recommendations?: Recommendation[];
}

const defaultRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'module',
    title: 'Advanced Contract Law',
    description: 'Deep dive into complex contract formations and clauses',
    reason: 'Based on your progress in Contract Formation Essentials',
    priority: 'high',
    estimatedTime: 90
  },
  {
    id: '2',
    type: 'simulation',
    title: 'Mock Trial Simulation',
    description: 'Practice courtroom arguments with AI judge',
    reason: 'Perfect for improving your advocacy skills',
    priority: 'medium',
    estimatedTime: 60
  },
  {
    id: '3',
    type: 'research',
    title: 'Recent Supreme Court Decisions',
    description: 'Analysis of landmark constitutional cases',
    reason: 'Complements your constitutional law studies',
    priority: 'medium',
    estimatedTime: 45
  }
];

export default function AIRecommendations({ recommendations = defaultRecommendations }: AIRecommendationsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'module': return <BookOpen className="h-5 w-5" />;
      case 'simulation': return <Beaker className="h-5 w-5" />;
      case 'research': return <TrendingUp className="h-5 w-5" />;
      case 'practice': return <Target className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-slate-200 bg-white';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">AI Recommendations</h3>
      </div>
      
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div 
            key={rec.id} 
            className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {getIcon(rec.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{rec.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 italic">{rec.reason}</p>
                  <span className="text-xs text-slate-500">{rec.estimatedTime} min</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-200">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Get More Recommendations
        </button>
      </div>
    </div>
  );
}
