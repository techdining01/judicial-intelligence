/**
 * Progress Widget Component
 * Displays user learning progress and statistics
 */

'use client';

import { BookOpen, Trophy, Target, Clock } from 'lucide-react';

interface ProgressWidgetProps {
  stats?: {
    modulesCompleted: number;
    totalModules: number;
    studyStreak: number;
    totalStudyTime: number;
    achievements: number;
  };
}

export default function ProgressWidget({ 
  stats = {
    modulesCompleted: 12,
    totalModules: 45,
    studyStreak: 7,
    totalStudyTime: 24,
    achievements: 5
  }
}: ProgressWidgetProps) {
  const completionPercentage = Math.round((stats.modulesCompleted / stats.totalModules) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Learning Progress</h3>
      
      {/* Progress Overview */}
      <div className="space-y-4">
        {/* Module Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-600">Modules</span>
          </div>
          <span className="text-sm font-medium text-slate-900">
            {stats.modulesCompleted}/{stats.totalModules}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.studyStreak}</p>
              <p className="text-xs text-slate-600">Day Streak</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalStudyTime}h</p>
              <p className="text-xs text-slate-600">Study Time</p>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-slate-600">Achievements</span>
          </div>
          <span className="text-sm font-medium text-slate-900">{stats.achievements} earned</span>
        </div>
      </div>
    </div>
  );
}
