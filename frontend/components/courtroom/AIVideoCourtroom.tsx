"use client";

import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Users, Gavel, Scale, Clock, AlertCircle, CheckCircle, Play, Pause, Volume2, VolumeX } from 'lucide-react';

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
  participants: CourtroomParticipant[];
  startTime: string;
  status: 'waiting' | 'in_progress' | 'paused' | 'completed';
  transcript: Array<{
    speaker: string;
    timestamp: string;
    text: string;
    type: 'statement' | 'objection' | 'ruling' | 'testimony';
  }>;
}

const mockSessions: CourtroomSession[] = [
  {
    id: 'court-001',
    title: 'Smith vs. Jones - Contract Dispute',
    caseNumber: 'LD/123/2024',
    court: 'Lagos High Court',
    judge: 'Hon. Justice A. B. Smith',
    participants: [
      { id: '1', name: 'Hon. Justice A. B. Smith', role: 'judge', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '👨‍⚖️' },
      { id: '2', name: 'Barrister John Doe', role: 'prosecutor', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '👨‍💼' },
      { id: '3', name: 'Barrister Jane Smith', role: 'defendant', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '👩‍💼' },
      { id: '4', name: 'AI Legal Assistant', role: 'ai_opponent', isVideoOn: true, isMuted: false, isSpeaking: false, avatar: '🤖' }
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInSession && selectedSession?.status === 'in_progress') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInSession, selectedSession?.status]);

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
    
    // Update session status
    setSessions(prev => prev.map(s => 
      s.id === session.id ? { ...s, status: 'in_progress' } : s
    ));
  };

  const handleEndSession = () => {
    if (selectedSession) {
      setSessions(prev => prev.map(s => 
        s.id === selectedSession.id ? { ...s, status: 'completed' } : s
      ));
    }
    setIsInSession(false);
    setSelectedSession(null);
    setSessionTime(0);
  };

  const renderSessionList = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">AI Video Courtroom Sessions</h3>
        <p className="text-slate-600">Practice courtroom proceedings with AI opponents and judges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{session.title}</h4>
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Gavel className="h-4 w-4" />
                    {session.court}
                  </span>
                  <span className="flex items-center gap-1">
                    <Scale className="h-4 w-4" />
                    {session.judge}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {session.participants.length} participants
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    session.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                    session.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                    AI Courtroom
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                <span className="font-medium">Case:</span> {session.caseNumber}
              </div>
              <button
                onClick={() => handleStartSession(session)}
                disabled={session.status === 'in_progress'}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
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
            <h3 className="text-xl font-semibold text-slate-900 mb-2">AI Video Courtroom</h3>
            <p className="text-slate-600">{selectedSession.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="h-4 w-4" />
              <span>{formatTime(sessionTime)}</span>
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Judge Video */}
            <div className="bg-slate-900 rounded-lg aspect-video relative overflow-hidden">
              {currentSession.participants.find(p => p.role === 'judge')?.isVideoOn ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">👨‍⚖️</div>
                    <p className="text-white font-medium">Hon. Justice A. B. Smith</p>
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
                >
                  {localVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setLocalMicOn(!localMicOn)}
                  className={`p-3 rounded-lg transition-colors flex items-center justify-center ${
                    localMicOn ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {localMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Participants List */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-4">Participants</h4>
              <div className="space-y-2">
                {currentSession.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{participant.avatar}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{participant.name}</p>
                        <p className="text-xs text-slate-600">{participant.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {participant.isMuted && <MicOff className="h-3 w-3 text-red-500" />}
                      {!participant.isVideoOn && <VideoOff className="h-3 w-3 text-slate-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
