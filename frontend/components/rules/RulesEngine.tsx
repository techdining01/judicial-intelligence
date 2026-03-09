/**
 * Legal Rules Engine Component
 * Provides access to state-specific legal rules and procedures
 */

'use client';

import { useState } from 'react';
import { apiClient } from '@/utils/api';

interface RulesResult {
  result: any;
  status: string;
}

const STATES = [
  { value: 'lagos', label: 'Lagos State' },
  { value: 'kano', label: 'Kano State' },
  { value: 'rivers', label: 'Rivers State' },
  { value: 'abuja', label: 'Abuja (FCT)' },
];

const COURT_TYPES = [
  { value: 'magistrate_court', label: 'Magistrate Court' },
  { value: 'high_court', label: 'High Court' },
  { value: 'federal_high_court', label: 'Federal High Court' },
  { value: 'customary_court', label: 'Customary Court' },
];

const MAGISTRATE_GRADES = [
  { value: 'grade_a', label: 'Grade A' },
  { value: 'grade_b', label: 'Grade B' },
  { value: 'grade_c', label: 'Grade C' },
  { value: 'grade_d', label: 'Grade D' },
];

const CASE_CATEGORIES = [
  { value: 'civil_cases', label: 'Civil Cases' },
  { value: 'criminal_cases', label: 'Criminal Cases' },
  { value: 'family_law', label: 'Family Law' },
];

export default function RulesEngine() {
  const [activeTab, setActiveTab] = useState<'limits' | 'fees' | 'timeline' | 'comprehensive'>('limits');
  const [state, setState] = useState('lagos');
  const [courtType, setCourtType] = useState('magistrate_court');
  const [grade, setGrade] = useState('grade_a');
  const [claimAmount, setClaimAmount] = useState('');
  const [caseCategory, setCaseCategory] = useState('civil_cases');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RulesResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMonetaryLimit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getMonetaryLimit(state, courtType, grade);
      
      if (response.status === 'success' && response.data) {
        setResult({ result: response.data, status: 'success' });
      } else {
        setError(response.error || 'Failed to get monetary limit');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilingFee = async () => {
    if (!claimAmount || parseFloat(claimAmount) <= 0) {
      setError('Please enter a valid claim amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.calculateFilingFee(state, parseFloat(claimAmount));
      
      if (response.status === 'success' && response.data) {
        setResult({ result: response.data, status: 'success' });
      } else {
        setError(response.error || 'Failed to calculate filing fee');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleHearingTimeline = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getHearingTimeline(state, caseCategory);
      
      if (response.status === 'success' && response.data) {
        setResult({ result: response.data, status: 'success' });
      } else {
        setError(response.error || 'Failed to get hearing timeline');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleComprehensiveInfo = async () => {
    const caseDetails = {
      court_type: courtType,
      grade: courtType === 'magistrate_court' ? grade : undefined,
      case_type: 'contract_disputes',
      case_category: caseCategory,
      claim_amount: claimAmount ? parseFloat(claimAmount) : 0,
      incident_date: '2024-01-15',
    };

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getComprehensiveCaseInfo(state, caseDetails);
      
      if (response.status === 'success' && response.data) {
        setResult({ result: response.data, status: 'success' });
      } else {
        setError(response.error || 'Failed to get comprehensive information');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Result</h3>
        <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Legal Rules Engine
        </h2>
        <p className="text-gray-600">
          Access state-specific legal rules, monetary limits, filing procedures, and hearing timelines
        </p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-1 border-b border-gray-200">
          {[
            { id: 'limits', label: 'Monetary Limits' },
            { id: 'fees', label: 'Filing Fees' },
            { id: 'timeline', label: 'Hearing Timelines' },
            { id: 'comprehensive', label: 'Comprehensive Info' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              {STATES.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {(activeTab === 'limits' || activeTab === 'comprehensive') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Court Type *
                </label>
                <select
                  value={courtType}
                  onChange={(e) => setCourtType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  {COURT_TYPES.map(court => (
                    <option key={court.value} value={court.value}>
                      {court.label}
                    </option>
                  ))}
                </select>
              </div>

              {courtType === 'magistrate_court' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Magistrate Grade *
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    {MAGISTRATE_GRADES.map(g => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {(activeTab === 'fees' || activeTab === 'comprehensive') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Claim Amount {activeTab === 'fees' ? '*' : '(Optional)'}
              </label>
              <input
                type="number"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                placeholder="Enter amount in NGN"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          )}

          {(activeTab === 'timeline' || activeTab === 'comprehensive') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Category *
              </label>
              <select
                value={caseCategory}
                onChange={(e) => setCaseCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                {CASE_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          {activeTab === 'limits' && (
            <button
              onClick={handleMonetaryLimit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Getting Limits...' : 'Get Monetary Limit'}
            </button>
          )}

          {activeTab === 'fees' && (
            <button
              onClick={handleFilingFee}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Calculating...' : 'Calculate Filing Fee'}
            </button>
          )}

          {activeTab === 'timeline' && (
            <button
              onClick={handleHearingTimeline}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Getting Timeline...' : 'Get Hearing Timeline'}
            </button>
          )}

          {activeTab === 'comprehensive' && (
            <button
              onClick={handleComprehensiveInfo}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Getting Info...' : 'Get Comprehensive Info'}
            </button>
          )}
        </div>

        {renderResult()}
      </div>
    </div>
  );
}
