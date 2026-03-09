/**
 * Module Card Component
 * Displays learning modules with concept explanations and visualizations
 */

'use client';

import { Play, Check, Clock, Star, BookOpen, Target, Award } from 'lucide-react';
import { useState } from 'react';

interface ModuleCardProps {
  module: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: number;
    progress: number;
    isCompleted: boolean;
    isSaved: boolean;
    rating?: number;
    concepts: string[];
    examples: string[];
    miniQuiz: boolean;
    relatedModules: string[];
  };
  onStart?: (id: string) => void;
  onSave?: (id: string, saved: boolean) => void;
  onComplete?: (id: string) => void;
}

export default function ModuleCard({ module, onStart, onSave, onComplete }: ModuleCardProps) {
  const [isSaved, setIsSaved] = useState(module.isSaved);
  const [showDetails, setShowDetails] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    onSave?.(module.id, newSavedState);
  };

  const handleStart = () => {
    onStart?.(module.id);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
              {module.isCompleted && (
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              )}
            </div>
            <p className="text-slate-600 text-sm mb-3">{module.description}</p>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                {module.difficulty}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {module.duration} min
              </div>
              {module.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  {module.rating}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleSave}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <BookOpen className={`h-5 w-5 ${isSaved ? 'text-blue-600 fill-current' : 'text-slate-400'}`} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span>Progress</span>
            <span>{module.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${module.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Concepts Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Key Concepts:</h4>
          <div className="flex flex-wrap gap-1">
            {module.concepts.slice(0, 3).map((concept) => (
              <span key={concept} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {concept}
              </span>
            ))}
            {module.concepts.length > 3 && (
              <span className="text-xs text-slate-500">+{module.concepts.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleStart}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            {module.isCompleted ? 'Review' : 'Start'}
            <Play className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Details
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="space-y-4">
            {/* Examples */}
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Examples & Visualizations
              </h4>
              <ul className="text-sm text-slate-600 space-y-1">
                {module.examples.map((example, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    {example}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mini Quiz */}
            {module.miniQuiz && (
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Assessment
                </h4>
                <p className="text-sm text-slate-600">Includes mini quiz to test understanding</p>
              </div>
            )}

            {/* Related Modules */}
            {module.relatedModules.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-2">Related Modules</h4>
                <div className="flex flex-wrap gap-2">
                  {module.relatedModules.map((related) => (
                    <span key={related} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {related}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
