/**
 * API Client for Judicial Intelligence Platform
 * Handles all API calls to FastAPI backend
 */

import {
  ApiResponse,
  Scenario,
  TrainingProgress,
  AlertItem,
  Persona,
  Session,
  Argument,
  Score,
  LeaderboardEntry,
  CourtAnalytics,
  CourtAlert,
  CourtJudgment,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || `HTTP error! status: ${response.status}`,
          status: 'error',
        };
      }

      return {
        data,
        status: 'success',
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
      };
    }
  }

  // AI Services
  async summarizeText(text: string) {
    return this.request('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async normalizeJudgment(text: string) {
    return this.request('/ai/normalize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async generateLegalDocument(documentType: string, caseDetails: any) {
    return this.request('/ai/legal-drafting', {
      method: 'POST',
      body: JSON.stringify({
        document_type: documentType,
        case_details: caseDetails,
      }),
    });
  }

  async searchPrecedents(caseId: number, vector: ArrayBuffer, allVectors: Record<number, ArrayBuffer>) {
    return this.request('/ai/precedents', {
      method: 'POST',
      body: JSON.stringify({
        case_id: caseId,
        vector: Array.from(new Uint8Array(vector)),
        all_vectors: Object.fromEntries(
          Object.entries(allVectors).map(([id, vec]) => [id, Array.from(new Uint8Array(vec))])
        ),
      }),
    });
  }

  // Rules Engine
  async getSupportedStates() {
    return this.request('/rules/states');
  }

  async getMonetaryLimit(state: string, courtType: string, grade?: string) {
    return this.request('/rules/monetary-limit', {
      method: 'POST',
      body: JSON.stringify({
        state,
        court_type: courtType,
        grade,
      }),
    });
  }

  async calculateFilingFee(state: string, claimAmount: number) {
    return this.request('/rules/filing-fee', {
      method: 'POST',
      body: JSON.stringify({
        state,
        claim_amount: claimAmount,
      }),
    });
  }

  async getHearingTimeline(state: string, caseCategory: string) {
    return this.request('/rules/hearing-timeline', {
      method: 'POST',
      body: JSON.stringify({
        state,
        case_category: caseCategory,
      }),
    });
  }

  async getComprehensiveCaseInfo(state: string, caseDetails: any) {
    return this.request('/rules/comprehensive-case-info', {
      method: 'POST',
      body: JSON.stringify({
        state,
        case_details: caseDetails,
      }),
    });
  }

  // Training System
  async getTrainingScenarios() {
    return this.request('/training/scenarios');
  }

  async createTrainingSession(userId: number, scenarioTemplateId: string, participantRole?: string) {
    return this.request('/training/session/create', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        scenario_template_id: scenarioTemplateId,
        participant_role: participantRole || 'attorney',
      }),
    });
  }

  async sendTrainingMessage(sessionId: string, message: string, messageType?: string) {
    return this.request('/training/session/message', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        message,
        message_type: messageType || 'argument',
      }),
    });
  }

  async completeTrainingSession(sessionId: string) {
    return this.request('/training/session/complete', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  async getUserTrainingProgress(userId: number) {
    return this.request('/training/progress', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // Moot Court
  async getJudgePersonas() {
    return this.request('/moot-court/personas');
  }

  async startMootSession(sessionId: string, personaType: string, caseType: string, caseFacts: string) {
    return this.request('/moot-court/session/start', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        persona_type: personaType,
        case_type: caseType,
        case_facts: caseFacts,
      }),
    });
  }

  async submitMootArgument(sessionId: string, userArgument: string, argumentType?: string) {
    return this.request('/moot-court/session/argument', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        user_argument: userArgument,
        argument_type: argumentType || 'legal_argument',
      }),
    });
  }

  async completeMootSession(sessionId: string) {
    return this.request('/moot-court/session/complete', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  async getMootCourtLeaderboard(timeFilter: 'all' | 'week' | 'month' = 'all') {
    return this.request(`/moot-court/leaderboard?time_filter=${timeFilter}`);
  }

  // Notifications
  async getUserAlerts(userId: string, unreadOnly = false) {
    return this.request(`/notifications/dashboard/${userId}/alerts${unreadOnly ? '?unread_only=true' : ''}`);
  }

  async markAlertRead(userId: string, alertId: string) {
    return this.request(`/notifications/dashboard/${userId}/alerts/${alertId}/read`, {
      method: 'PUT',
    });
  }

  async markAllAlertsRead(userId: string) {
    return this.request(`/notifications/dashboard/${userId}/alerts/read-all`, {
      method: 'PUT',
    });
  }

  async getNotificationStats() {
    return this.request('/notifications/stats');
  }

  // Scraping (for admin users)
  async scrapeJudgments(court: string) {
    return this.request(`/scrape/judgments/${court}`, {
      method: 'POST',
    });
  }

  async getCauseList(court: string, date?: string) {
    return this.request(`/scrape/cause-list/${court}${date ? `?date=${date}` : ''}`, {
      method: 'GET',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();

// Export types for use in components
export type {
  ApiResponse,
};
