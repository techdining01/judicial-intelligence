/**
 * Moot Court Leaderboard Component
 * Displays top performers and rankings
 */

'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api';

interface LeaderboardEntry {
  id: string;
  rank: number;
  user_id: string;
  username: string;
  participant_name: string;
  participant_email: string;
  score: number;
  total_score: number;
  sessions_completed: number;
  average_score: number;
  last_session: string;
  completed_at: string;
  session_duration_minutes: number;
  judge_persona: string;
  case_type: string;
}

export default function MootCourtLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');

  // Mock data for development
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      rank: 1,
      user_id: 'user1',
      username: 'amina_bello',
      participant_name: 'Dr. Amina Bello',
      participant_email: 'amina.bello@judicial-ai.com',
      score: 95,
      total_score: 475,
      sessions_completed: 5,
      average_score: 95.0,
      last_session: '2024-01-15T10:30:00Z',
      completed_at: '2024-01-15T11:45:00Z',
      session_duration_minutes: 75,
      judge_persona: 'Justice Amina Bello',
      case_type: 'Constitutional Law'
    },
    {
      id: '2',
      rank: 2,
      user_id: 'user2',
      username: 'james_okoro',
      participant_name: 'Prof. James Okoro',
      participant_email: 'james.okoro@judicial-ai.com',
      score: 88,
      total_score: 352,
      sessions_completed: 4,
      average_score: 88.0,
      last_session: '2024-01-14T14:20:00Z',
      completed_at: '2024-01-14T15:30:00Z',
      session_duration_minutes: 70,
      judge_persona: 'Justice James Okoro',
      case_type: 'Civil Rights'
    },
    {
      id: '3',
      rank: 3,
      user_id: 'user3',
      username: 'sarah_johnson',
      participant_name: 'Sarah Johnson',
      participant_email: 'sarah.johnson@judicial-ai.com',
      score: 82,
      total_score: 328,
      sessions_completed: 4,
      average_score: 82.0,
      last_session: '2024-01-13T16:45:00Z',
      completed_at: '2024-01-13T18:15:00Z',
      session_duration_minutes: 90,
      judge_persona: 'Justice Sarah Johnson',
      case_type: 'Commercial Law'
    }
  ];

  useEffect(() => {
    loadLeaderboard();
  }, [timeFilter]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use mock data for now
      setTimeout(() => {
        setLeaderboard(mockLeaderboard);
        setLoading(false);
      }, 800);
      
      // Uncomment when API is ready
      // const response = await apiClient.getMootCourtLeaderboard(timeFilter);
      // if (response.status === 'success' && response.data) {
      //   setLeaderboard((response.data as any).leaderboard || []);
      // } else {
      //   setError('Failed to load leaderboard');
      // }
    } catch (err) {
      setError('Error loading leaderboard');
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-purple-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Moot Court Leaderboard</h1>
        <p className="text-slate-600 mb-6">
          Top performers in AI moot court simulations
        </p>
      </div>

      {/* Time Filter */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              timeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              timeFilter === 'week'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              timeFilter === 'month'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Leaderboard Table */}
      {leaderboard.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-slate-500">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">No Sessions Yet</h3>
            <p>Be the first to complete a moot court session and appear on the leaderboard!</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Start a Session
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Judge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg font-bold">
                          {getRankBadge(entry.rank)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{entry.participant_name}</div>
                        <div className="text-sm text-slate-500">{entry.participant_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-slate-600">
                            {entry.judge_persona.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="ml-2 text-sm text-slate-600">{entry.judge_persona}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-2xl font-bold ${getScoreColor(entry.total_score)}`}>
                          {entry.total_score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(entry.completed_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {entry.session_duration_minutes} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {leaderboard.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{leaderboard.length}</div>
              <div className="text-sm text-slate-600">Total Sessions</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(leaderboard.reduce((sum, entry) => sum + entry.total_score, 0) / leaderboard.length)}
              </div>
              <div className="text-sm text-slate-600">Average Score</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.max(...leaderboard.map(entry => entry.total_score), 0)}
              </div>
              <div className="text-sm text-slate-600">Highest Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
