/**
 * Type definitions for Judicial Intelligence Platform
 */

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}

// Training System Types
export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  estimated_duration: number;
}

export interface TrainingProgress {
  total_scenarios: number;
  completed_scenarios: number;
  current_level: string;
  points: number;
  achievements: string[];
}

// AI Services Types
export interface AlertItem {
  id: string;
  title: string;
  content: string;
  sent_at: string;
  delivered: boolean;
  source: string;
  priority?: string;
}

// Moot Court Types
export interface Persona {
  type: string;
  name: string;
  specialization: string;
  temperament: string;
  questioning_style: string;
}

export interface Session {
  id: string;
  case_type: string;
  case_facts: string;
  created_at: string;
  status: string;
}

export interface Argument {
  role: string;
  message: string;
  argument_type?: string;
  timestamp: string;
}

export interface Score {
  total_score: number;
  legal_accuracy: number;
  argument_strength: number;
  reasoning_quality: number;
  courtroom_demeanor: number;
  analysis?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  participant_name: string;
  participant_email: string;
  judge_persona: string;
  total_score: number;
  completed_at: string;
  session_duration_minutes: number;
}

// Rules Engine Types
export interface CourtAnalytics {
  court_name: string;
  court_type: string;
  state: string;
  total_cases: number;
  status_breakdown: Record<string, number>;
  monthly_trend: Record<string, number>;
  last_updated: string;
  data_source: string;
}

export interface CourtAlert {
  id: string;
  title: string;
  content: string;
  sent_at: string;
  delivered: boolean;
  source: string;
  priority?: string;
}

export interface CourtJudgment {
  id: string;
  case_title: string;
  suit_number: string;
  court: string;
  judgment_date: string;
  summary?: string;
  is_final: boolean;
  document_url?: string;
  source: string;
  scraped_at?: string;
}
