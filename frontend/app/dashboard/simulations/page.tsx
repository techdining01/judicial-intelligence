/**
 * Simulations Page
 * Main page for legal case simulations
 */

'use client';

import { useState, useEffect } from 'react';
import { Play, Clock, Users, Award, TrendingUp, Target } from 'lucide-react';

export default function SimulationsPage() {
  const [mounted, setMounted] = useState(false);
  const [simulations] = useState([
    {
      id: 'civil-contract',
      title: 'Civil Contract Dispute',
      description: 'Simulate a breach of contract case with negotiation and litigation phases',
      duration: '45-60 min',
      difficulty: 'Intermediate',
      participants: '2-4',
      category: 'Civil Law',
      status: 'available',
      rating: 4.5,
      completedBy: 234,
      icon: Target
    },
    {
      id: 'criminal-trial',
      title: 'Criminal Trial Simulation',
      description: 'Experience a complete criminal trial from arraignment to verdict',
      duration: '60-90 min',
      difficulty: 'Advanced',
      participants: '3-6',
      category: 'Criminal Law',
      status: 'available',
      rating: 4.8,
      completedBy: 189,
      icon: Users
    },
    {
      id: 'constitutional-appeal',
      title: 'Constitutional Appeal',
      description: 'Argue constitutional issues before an appellate court',
      duration: '30-45 min',
      difficulty: 'Advanced',
      participants: '2-3',
      category: 'Constitutional Law',
      status: 'available',
      rating: 4.7,
      completedBy: 156,
      icon: Award
    },
    {
      id: 'family-mediation',
      title: 'Family Law Mediation',
      description: 'Practice mediation techniques in family dispute resolution',
      duration: '30-45 min',
      difficulty: 'Intermediate',
      participants: '2-4',
      category: 'Family Law',
      status: 'available',
      rating: 4.2,
      completedBy: 98,
      icon: TrendingUp
    },
    {
      id: 'corporate-governance',
      title: 'Corporate Governance Hearing',
      description: 'Navigate corporate governance issues and board decisions',
      duration: '45-60 min',
      difficulty: 'Intermediate',
      participants: '3-5',
      category: 'Corporate Law',
      status: 'available',
      rating: 4.3,
      completedBy: 76,
      icon: Target
    },
    {
      id: 'international-trade',
      title: 'International Trade Dispute',
      description: 'Resolve international trade conflicts and treaty interpretations',
      duration: '60-90 min',
      difficulty: 'Advanced',
      participants: '4-6',
      category: 'International Law',
      status: 'available',
      rating: 4.6,
      completedBy: 45,
      icon: Users
    },
    {
      id: 'property-dispute',
      title: 'Property Dispute Resolution',
      description: 'Handle property ownership conflicts and boundary disputes',
      duration: '45-60 min',
      difficulty: 'Intermediate',
      participants: '2-4',
      category: 'Property Law',
      status: 'available',
      rating: 4.4,
      completedBy: 123,
      icon: Target
    },
    {
      id: 'employment-law',
      title: 'Employment Law Case',
      description: 'Practice employment contract disputes and termination cases',
      duration: '30-45 min',
      difficulty: 'Beginner',
      participants: '2-3',
      category: 'Employment Law',
      status: 'available',
      rating: 4.1,
      completedBy: 67,
      icon: Target
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Legal Simulations</h1>
          <p className="text-slate-600">Practice legal procedures and case handling in realistic scenarios</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Available</span>;
      case 'coming-soon':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Coming Soon</span>;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-50';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'Advanced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Legal Simulations</h1>
          <p className="text-slate-600">Practice legal procedures and case handling in realistic scenarios</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{simulations.filter(s => s.status === 'available').length}</p>
                <p className="text-sm text-slate-600">Available Simulations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {simulations.reduce((sum, s) => sum + s.completedBy, 0)}
                </p>
                <p className="text-sm text-slate-600">Total Completions</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">45m</p>
                <p className="text-sm text-slate-600">Avg. Duration</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">4.7</p>
                <p className="text-sm text-slate-600">Avg. Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simulations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((simulation) => (
            <div
              key={simulation.id}
              className={`bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <simulation.icon className="h-6 w-6 text-slate-600" />
                  </div>
                  {getStatusBadge(simulation.status)}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{simulation.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{simulation.description}</p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Duration:</span>
                    <span className="text-slate-700">{simulation.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Participants:</span>
                    <span className="text-slate-700">{simulation.participants}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Category:</span>
                    <span className="text-slate-700">{simulation.category}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(simulation.difficulty)}`}>
                      {simulation.difficulty}
                    </span>
                    {simulation.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-slate-600">{simulation.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  {simulation.status === 'available' ? (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Start Simulation
                    </button>
                  ) : (
                    <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium" disabled>
                      Coming Soon
                    </button>
                  )}
                </div>

                {/* Completion Stats */}
                {simulation.completedBy > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Completed by {simulation.completedBy} users</span>
                      <span>Most popular in {simulation.category}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Simulation Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-700">
            <div>
              <h4 className="font-medium mb-2">🎯 Realistic Scenarios</h4>
              <p>Based on actual Nigerian legal cases and procedures</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🤖 AI-Powered</h4>
              <p>Intelligent opponents and judges with realistic behavior</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">📊 Performance Tracking</h4>
              <p>Detailed feedback and scoring on your legal reasoning</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🏆 Competitive Element</h4>
              <p>Leaderboards and achievements for top performers</p>
            </div>
          </div>
        </div>
    </div>
  );
}
