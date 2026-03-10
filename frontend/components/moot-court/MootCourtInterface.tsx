/**
 * Moot Court Interface Component
 * Complete AI-powered courtroom simulation with judge personas
 */

'use client';

import { useState, useEffect } from 'react';
import { Award, Clock, Users, Play, TrendingUp, Target } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Notification, { useNotification } from '@/components/ui/Notification';
import { apiClient } from '@/utils/api';

interface Persona {
  type: string;
  name: string;
  specialization: string;
  temperament: string;
  questioning_style: string;
}

interface Session {
  id: string;
  case_type: string;
  persona_type: string;
  case_facts: string;
  status: string;
  created_at: string;
}

interface Argument {
  role: 'user' | 'judge';
  message: string;
  argument_type: string;
  timestamp: string;
}

interface MootCourtSession {
  session: Session;
  persona: Persona;
  arguments: Argument[];
  isComplete: boolean;
  currentScore?: number;
}

export default function MootCourtInterface() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [caseType, setCaseType] = useState('');
  const [caseFacts, setCaseFacts] = useState('');
  const [userArgument, setUserArgument] = useState('');
  const [argumentType, setArgumentType] = useState('legal_argument');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<MootCourtSession | null>(null);
  const { notification, showNotification, closeNotification } = useNotification();

  useEffect(() => {
    loadPersonas();
  }, []);

  // Mock data for development
  const mockPersonas: Persona[] = [
    {
      type: 'conservative',
      name: 'Justice Amina Bello',
      specialization: 'Constitutional Law',
      temperament: 'Methodical and thorough',
      questioning_style: 'Follows strict procedure'
    },
    {
      type: 'progressive',
      name: 'Justice James Okoro',
      specialization: 'Civil Rights',
      temperament: 'Innovative and forward-thinking',
      questioning_style: 'Encourages creative arguments'
    },
    {
      type: 'moderate',
      name: 'Justice Sarah Johnson',
      specialization: 'Commercial Law',
      temperament: 'Balanced and practical',
      questioning_style: 'Focuses on practical outcomes'
    }
  ];

  const loadPersonas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use mock data for now
      setTimeout(() => {
        setPersonas(mockPersonas);
        setLoading(false);
      }, 1000);
      
      // Uncomment when API is ready
      // const response = await apiClient.getJudgePersonas();
      // if (response.status === 'success' && response.data) {
      //   setPersonas((response.data as any).personas || []);
      // } else {
      //   setError('Failed to load judge personas');
      // }
    } catch (err) {
      setError('Error loading judge personas');
      setLoading(false);
    }
  };

  const startNewSession = async () => {
    if (!selectedPersona || !caseType || !caseFacts) {
      setError('Please select a persona and provide case details');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use mock session creation
      setTimeout(() => {
        const newSession: MootCourtSession = {
          session: {
            id: `session_${Date.now()}`,
            case_type: caseType,
            persona_type: selectedPersona.type,
            case_facts: caseFacts,
            status: 'active',
            created_at: new Date().toISOString(),
          },
          persona: selectedPersona,
          arguments: [],
          isComplete: false
        };
        
        setCurrentSession(newSession);
        setLoading(false);
        setError(null);
        showNotification('Moot Court session started successfully!', 'success');
      }, 1500);
      
      // Uncomment when API is ready
      // const response = await apiClient.startMootSession(
      //   `session_${Date.now()}`,
      //   selectedPersona.type,
      //   caseType,
      //   caseFacts
      // );

      // if (response.status === 'success' && response.data) {
      //   setCurrentSession({
      //     session: (response.data as any).session,
      //     persona: selectedPersona,
      //     arguments: [],
      //     isComplete: false
      //   });
      //   setError(null);
      // } else {
      //   setError('Failed to start moot court session');
      // }
    } catch (err) {
      setError('Error starting moot court session');
      setLoading(false);
    }
  };

  const submitArgument = async () => {
    if (!userArgument.trim() || !currentSession) {
      return;
    }

    try {
      const response = await apiClient.submitMootArgument(
        currentSession.session.id,
        userArgument,
        argumentType
      );

      if (response.status === 'success' && response.data) {
        const newArgument: Argument = {
          role: 'user',
          message: userArgument,
          argument_type: argumentType,
          timestamp: new Date().toISOString()
        };

        setCurrentSession(prev => prev ? {
          ...prev,
          arguments: [...prev.arguments, newArgument]
        } : null);

        setUserArgument('');
      } else {
        setError(response.error || 'Failed to submit argument');
      }
    } catch (err) {
      setError('Error submitting argument');
    }
  };

  const completeSession = async () => {
    if (!currentSession) return;

    setLoading(true);
    try {
      const response = await apiClient.completeMootSession(currentSession.session.id);

      if (response.status === 'success' && response.data) {
        setCurrentSession(prev => prev ? ({
          ...prev,
          isComplete: true,
          currentScore: (response.data as any).score
        }) : null);
      } else {
        setError(response.error || 'Failed to complete session');
      }
    } catch (err) {
      setError('Error completing session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Moot Court Simulation</h2>
      
      {!currentSession ? (
        <div className="space-y-6">
          {/* Persona Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Judge Persona</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personas.map((persona) => (
                <div
                  key={persona.type}
                  onClick={() => setSelectedPersona(persona)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPersona?.type === persona.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h3 className="font-semibold text-slate-900">{persona.name}</h3>
                  <p className="text-sm text-slate-600">{persona.specialization}</p>
                  <p className="text-xs text-slate-500 mt-1">Temperament: {persona.temperament}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Case Details */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Case Type</label>
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              style={{ 
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              <option value="">Select a case type</option>
              <optgroup label="Civil Cases">
                <option value="Contract Dispute">Contract Dispute</option>
                <option value="Property Dispute">Property Dispute</option>
                <option value="Tort Claim">Tort Claim</option>
              </optgroup>
              <optgroup label="Criminal Cases">
                <option value="Criminal Appeal">Criminal Appeal</option>
                <option value="Bail Application">Bail Application</option>
                <option value="Constitutional Challenge">Constitutional Challenge</option>
              </optgroup>
              <optgroup label="Small Claims by State">
                <option value="Small Claims - Lagos">Small Claims - Lagos (₦5,000,000 limit)</option>
                <option value="Small Claims - Abuja">Small Claims - Abuja (₦5,000,000 limit)</option>
                <option value="Small Claims - Rivers">Small Claims - Rivers (₦5,000,000 limit)</option>
                <option value="Small Claims - Kano">Small Claims - Kano (₦5,000,000 limit)</option>
                <option value="Small Claims - Oyo">Small Claims - Oyo (₦5,000,000 limit)</option>
                <option value="Small Claims - Enugu">Small Claims - Enugu (₦5,000,000 limit)</option>
                <option value="Small Claims - Kaduna">Small Claims - Kaduna (₦5,000,000 limit)</option>
                <option value="Small Claims - Delta">Small Claims - Delta (₦5,000,000 limit)</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Case Facts</label>
            <textarea
              value={caseFacts}
              onChange={(e) => setCaseFacts(e.target.value)}
              placeholder="Describe the case facts..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 resize-none"
              style={{ 
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Debug Info - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs select-text cursor-text" style={{ 
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              userSelect: 'text',
              cursor: 'text'
            }}>
              <p className="text-slate-800">Selected Persona: {selectedPersona ? selectedPersona.name : 'None'}</p>
              <p className="text-slate-800">Case Type: {caseType || 'None'}</p>
              <p className="text-slate-800">Case Facts: {caseFacts ? 'Filled' : 'Empty'}</p>
              <p className="text-slate-800">Loading: {loading ? 'Yes' : 'No'}</p>
            </div>
          )}

          <button
            onClick={startNewSession}
            disabled={loading || !selectedPersona || !caseType || !caseFacts.trim()}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                Starting Session...
              </>
            ) : (
              'Start Moot Court Session'
            )}
          </button>

          {!selectedPersona && (
            <p className="text-sm text-amber-600">Please select a judge persona</p>
          )}
          {!caseType && (
            <p className="text-sm text-amber-600">Please select a case type</p>
          )}
          {!caseFacts.trim() && (
            <p className="text-sm text-amber-600">Please enter case facts</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Session Header */}
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Session with {currentSession.persona.name}
                </h3>
                <p className="text-sm text-slate-600">Case: {currentSession.session.case_type}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentSession.isComplete ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {currentSession.isComplete ? 'Completed' : 'In Progress'}
                </span>
                {currentSession.currentScore && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Score: {currentSession.currentScore}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Arguments */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Courtroom Dialogue</h4>
            <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              {currentSession.arguments.map((arg, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded-lg ${
                    arg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-slate-100 mr-8'
                  }`}
                  style={{ 
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-600">
                      {arg.role === 'user' ? 'Your Argument' : currentSession.persona.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(arg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 select-text cursor-text" style={{ 
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility',
                    userSelect: 'text',
                    cursor: 'text'
                  }}>
                    {arg.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Argument Input */}
          {!currentSession.isComplete && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Argument Type</label>
                <select
                  value={argumentType}
                  onChange={(e) => setArgumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  style={{ 
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  <option value="legal_argument">Legal Argument</option>
                  <option value="factual_argument">Factual Argument</option>
                  <option value="precedent">Precedent Citation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Argument</label>
                <textarea
                  value={userArgument}
                  onChange={(e) => setUserArgument(e.target.value)}
                  placeholder="Present your argument to the court..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 resize-none"
                  style={{ 
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitArgument}
                  disabled={loading || !userArgument.trim()}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                  style={{ 
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Argument'}
                </button>
                <button
                  onClick={completeSession}
                  disabled={loading}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                  style={{ 
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  Complete Session
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      )}
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}
