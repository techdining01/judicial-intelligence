/**
 * Legal Summarizer Component
 * Provides AI-powered legal document summarization
 */

'use client';

import { useState } from 'react';
import { apiClient } from '@/utils/api';

interface SummarizerResult {
  summary: string;
  plain_english: string;
  embedding?: number[];
}

export default function LegalSummarizer() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummarizerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter text to summarize');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.summarizeText(text);
      
      if (response.status === 'success' && response.data) {
        setResult(response.data as SummarizerResult);
      } else {
        setError(response.error || 'Failed to summarize text');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Legal Summarizer
        </h2>
        <p className="text-gray-600">
          Get professional legal summaries and plain English explanations of legal documents
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="legal-text" className="block text-sm font-medium text-gray-700 mb-2">
            Legal Text to Summarize
          </label>
          <textarea
            id="legal-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your legal text here... (judgments, contracts, statutes, etc.)"
            className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleSummarize}
            disabled={loading || !text.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Summarizing...' : 'Summarize'}
          </button>
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>

        {result && (
          <div className="space-y-6 mt-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Professional Summary
              </h3>
              <p className="text-blue-800 whitespace-pre-wrap">
                {result.summary}
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Plain English Explanation
              </h3>
              <p className="text-green-800 whitespace-pre-wrap">
                {result.plain_english}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigator.clipboard.writeText(result.summary)}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Copy Summary
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(result.plain_english)}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Copy Plain English
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
