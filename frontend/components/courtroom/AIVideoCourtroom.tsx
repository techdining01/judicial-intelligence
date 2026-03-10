"use client";

import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Users, Gavel, Scale, Clock, AlertCircle, CheckCircle, Play, Pause, Volume2, VolumeX, MessageSquare, Send } from 'lucide-react';

interface CourtroomParticipant {
  id: string;
  name: string;
  role: 'judge' | 'prosecutor' | 'defendant' | 'witness' | 'lawyer' | 'ai_opponent';
  isVideoOn: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  avatar: string;
}

interface CourtroomSession {
  id: string;
  title: string;
  caseNumber: string;
  court: string;
  judge: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  participants: CourtroomParticipant[];
  startTime: string;
  status: 'waiting' | 'in_progress' | 'paused' | 'completed';
  transcript: Array<{
    speaker: string;
    timestamp: string;
    text: string;
    type: 'statement' | 'objection' | 'ruling' | 'testimony';
  }>;
  score?: number;
  duration?: number;
}

const mockSessions: CourtroomSession[] = [
  {
    id: 'court-001',
    title: 'Contract Dispute - Tech Startup Case',
    caseNumber: 'LD/123/2024',
    court: 'Lagos High Court',
    judge: 'Hon. Justice A. B. Smith',
    difficulty: 'Intermediate',
    participants: [
      { id: '1', name: 'Hon. Justice A. B. Smith', role: 'judge', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '👨‍⚖️' },
      { id: '2', name: 'Barrister John Doe', role: 'prosecutor', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '👨‍💼' },
      { id: '3', name: 'Barrister Jane Smith', role: 'defendant', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '👩‍💼' },
      { id: '4', name: 'AI Legal Assistant', role: 'ai_opponent', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '🤖' }
    ],
    startTime: new Date().toISOString(),
    status: 'waiting',
    transcript: []
  },
  {
    id: 'court-002',
    title: 'Intellectual Property - Software Patent',
    caseNumber: 'FD/456/2024',
    court: 'Federal High Court',
    judge: 'Hon. Justice C. R. Johnson',
    difficulty: 'Advanced',
    participants: [
      { id: '1', name: 'Hon. Justice C. R. Johnson', role: 'judge', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '👨‍⚖️' },
      { id: '2', name: 'Barrister Tech Corp', role: 'prosecutor', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '🏢' },
      { id: '3', name: 'Barrister Startup Ltd', role: 'defendant', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '💻' },
      { id: '4', name: 'IP Law Expert AI', role: 'ai_opponent', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '🤖' }
    ],
    startTime: new Date().toISOString(),
    status: 'waiting',
    transcript: []
  },
  {
    id: 'court-003',
    title: 'Employment Law - Wrongful Termination',
    caseNumber: 'ABJ/789/2024',
    court: 'Abuja High Court',
    judge: 'Hon. Justice M. K. Ahmed',
    difficulty: 'Beginner',
    participants: [
      { id: '1', name: 'Hon. Justice M. K. Ahmed', role: 'judge', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '👨‍⚖️' },
      { id: '2', name: 'Employee Representative', role: 'prosecutor', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '👤' },
      { id: '3', name: 'Former Employee', role: 'defendant', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '👤' },
      { id: '4', name: 'Labor Law AI', role: 'ai_opponent', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '🤖' }
    ],
    startTime: new Date().toISOString(),
    status: 'waiting',
    transcript: []
  }
];

export default function AIVideoCourtroom() {
  const [sessions, setSessions] = useState<CourtroomSession[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<CourtroomSession | null>(null);
  const [isInSession, setIsInSession] = useState(false);
  const [localVideoOn, setLocalVideoOn] = useState(true);
  const [localMicOn, setLocalMicOn] = useState(true);
  const [volume, setVolume] = useState(50);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentArgument, setCurrentArgument] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInSession && selectedSession?.status === 'in_progress' && !isPaused) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInSession, selectedSession?.status, isPaused]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = (session: CourtroomSession) => {
    setSelectedSession(session);
    setIsInSession(true);
    setSessionTime(0);
    setCurrentArgument('');
    setError(null);
    setIsPaused(false);
    
    // Update session status
    setSessions(prev => prev.map(s => 
      s.id === session.id ? { ...s, status: 'in_progress' } : s
    ));
  };

  const handleEndSession = () => {
    if (selectedSession) {
      // Calculate score based on performance
      const finalScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
      
      setSessions(prev => prev.map(s => 
        s.id === selectedSession.id ? { 
          ...s, 
          status: 'completed', 
          score: finalScore,
          duration: sessionTime
        } : s
      ));
    }
    setIsInSession(false);
    setSelectedSession(null);
    setSessionTime(0);
    setCurrentArgument('');
    setIsPaused(false);
  };

  const toggleVideo = (participantId: string) => {
    if (selectedSession) {
      setSessions(prev => prev.map(session => {
        if (session.id === selectedSession.id) {
          return {
            ...session,
            participants: session.participants.map(p => 
              p.id === participantId ? { ...p, isVideoOn: !p.isVideoOn } : p
            )
          };
        }
        return session;
      }));
    }
  };

  const toggleMic = (participantId: string) => {
    if (selectedSession) {
      setSessions(prev => prev.map(session => {
        if (session.id === selectedSession.id) {
          return {
            ...session,
            participants: session.participants.map(p => 
              p.id === participantId ? { ...p, isMuted: !p.isMuted } : p
            )
          };
        }
        return session;
      }));
    }
  };

  const submitArgument = () => {
    if (!currentArgument.trim() || !selectedSession) return;

    const newTranscriptEntry = {
      speaker: 'You',
      timestamp: new Date().toLocaleTimeString(),
      text: currentArgument,
      type: 'statement'
    };

    // Add to transcript
    setSessions(prev => prev.map(session => {
      if (session.id === selectedSession?.id) {
        return {
          ...session,
          transcript: [...session.transcript, newTranscriptEntry]
        };
      }
      return session;
    }));

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        'That\'s an interesting point. Let me consider the legal implications.',
        'I understand your argument, but have you considered the precedent in the case of Smith vs. Jones?',
        'Your reasoning is sound, but we need to address the statutory framework more clearly.',
        'Objection, Your Honor! That line of questioning is not relevant to this matter.',
        'I agree with your assessment of the facts, but the burden of proof remains on the plaintiff.',
        'Your argument is well-structured, but the legal standard requires additional evidence.',
        'That\'s a valid point, but let\'s examine the contract more closely.'
      ];
      
      const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiTranscriptEntry = {
        speaker: selectedSession.participants.find(p => p.role === 'ai_opponent')?.name || 'AI Assistant',
        timestamp: new Date().toLocaleTimeString(),
        text: aiResponse,
        type: 'statement'
      };

      setSessions(prev => prev.map(session => {
        if (session.id === selectedSession?.id) {
          return {
            ...session,
            transcript: [...session.transcript, aiTranscriptEntry]
          };
        }
        return session;
      }));
    }, 2000);

    setCurrentArgument('');
    setError(null);
  };

  const renderSessionList = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">AI Video Courtroom Sessions</h3>
        <p className="text-slate-600">Practice courtroom proceedings with AI opponents and judges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:border-blue-300 transition-colors"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Gavel className="h-5 w-5 text-purple-600" />
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    session.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    session.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {session.difficulty}
                  </span>
                  {session.status === 'completed' && session.score && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Score: {session.score}%</span>
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{session.title}</h4>
                <p className="text-slate-600 text-sm mb-3">{session.caseNumber}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Scale className="h-4 w-4" />
                    {session.court}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {session.participants.length} participants
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                {session.status === 'completed' && session.duration && (
                  <span>Duration: {formatTime(session.duration)}</span>
                )}
              </div>
              <button
                onClick={() => handleStartSession(session)}
                disabled={session.status === 'in_progress'}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                <Video className="h-4 w-4" />
                {session.status === 'in_progress' ? 'Join Session' : 'Start Session'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVideoCourtroom = () => {
    if (!selectedSession) return null;

    const currentSession = sessions.find(s => s.id === selectedSession.id) || selectedSession;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{selectedSession.title}</h3>
            <p className="text-slate-600">Difficulty: {selectedSession.difficulty} | Court: {selectedSession.court}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="h-4 w-4" />
              <span>{formatTime(sessionTime)}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
              <button
                onClick={handleEndSession}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                <Phone className="h-4 w-4" />
                End Session
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Judge Video */}
            <div className="bg-slate-900 rounded-lg aspect-video relative overflow-hidden">
              {currentSession.participants.find(p => p.role === 'judge')?.isVideoOn ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">👨‍⚖️</div>
                    <p className="text-white font-medium">{currentSession.judge}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm">LIVE</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <VideoOff className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400">Camera Off</p>
                  </div>
                </div>
              )}
              
              {/* Court Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <div className="bg-black bg-opacity-50 rounded-lg px-3 py-2">
                  <p className="text-white text-sm font-medium">Court in Session</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-2 rounded-lg transition-colors ${
                      isRecording ? 'bg-red-600 text-white' : 'bg-black bg-opacity-50 text-white'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Participant Videos */}
            <div className="grid grid-cols-2 gap-4">
              {currentSession.participants.filter(p => p.role !== 'judge').map((participant) => (
                <div key={participant.id} className="bg-slate-800 rounded-lg aspect-video relative overflow-hidden">
                  {participant.isVideoOn ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-1">{participant.avatar}</div>
                        <p className="text-white text-sm">{participant.name}</p>
                        {participant.isSpeaking && (
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-xs">Speaking</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <VideoOff className="h-8 w-8 text-slate-400 mx-auto mb-1" />
                        <p className="text-slate-400 text-xs">{participant.name}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Participant Controls */}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                    <div className="flex items-center gap-1">
                      {participant.isMuted && <MicOff className="h-3 w-3 text-red-500" />}
                      {!participant.isVideoOn && <VideoOff className="h-3 w-3 text-slate-400" />}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleVideo(participant.id)}
                        className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
                      >
                        <Video className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => toggleMic(participant.id)}
                        className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
                      >
                        <Mic className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Local Controls */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-4">Your Controls</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLocalVideoOn(!localVideoOn)}
                  className={`p-3 rounded-lg transition-colors flex items-center justify-center ${
                    localVideoOn ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
                  }`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {localVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setLocalMicOn(!localMicOn)}
                  className={`p-3 rounded-lg transition-colors flex items-center justify-center ${
                    localMicOn ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
                  }`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {localMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="h-4 w-4 text-slate-600" />
                  <span className="text-sm text-slate-600">Volume</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Argument Input */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-4">Courtroom Argument</h4>
              <div className="space-y-3">
                <textarea
                  value={currentArgument}
                  onChange={(e) => setCurrentArgument(e.target.value)}
                  placeholder="Type your legal argument here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 resize-none"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                />
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-600">
                    {currentArgument.length} / 500 characters
                  </div>
                  <button
                    onClick={submitArgument}
                    disabled={!currentArgument.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    <Send className="h-4 w-4" />
                    Submit Argument
                  </button>
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-4">Session Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Arguments Made</span>
                  <span className="font-medium text-slate-900">
                    {currentSession.transcript.filter(t => t.speaker === 'You').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">AI Responses</span>
                  <span className="font-medium text-slate-900">
                    {currentSession.transcript.filter(t => t.speaker.includes('AI')).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Session Time</span>
                  <span className="font-medium text-slate-900">{formatTime(sessionTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Transcript */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-slate-900 mb-4">Live Transcript</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {currentSession.transcript.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Transcript will appear here...</p>
            ) : (
              currentSession.transcript.map((entry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg mb-3 ${
                    entry.speaker === 'You' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
                  }`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{entry.speaker}</span>
                      <span className="text-xs text-slate-500">{entry.timestamp}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      entry.type === 'objection' ? 'bg-red-100 text-red-700' :
                      entry.type === 'ruling' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {entry.type}
                    </span>
                  </div>
                  <p className="text-slate-700 select-text cursor-text" style={{ 
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility',
                    userSelect: 'text',
                    cursor: 'text'
                  }}>
                    {entry.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">AI Video Courtroom</h2>
        <p className="text-slate-600 mt-1">Practice courtroom proceedings with AI judges and opponents</p>
      </div>

      {!isInSession ? renderSessionList() : renderVideoCourtroom()}
    </div>
  );
}
