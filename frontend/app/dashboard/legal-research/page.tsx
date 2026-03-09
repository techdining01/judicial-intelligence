"use client";

import { useState } from 'react';
import StatuteSearch from '@/components/legal-research/StatuteSearch';

export default function LegalResearchPage() {
  const [activeTab, setActiveTab] = useState<'statutes' | 'precedents' | 'analysis'>('statutes');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Legal Research</h1>
        <p className="text-slate-600 mt-2">Discover, analyze, and understand legal materials with AI assistance</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab('statutes')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'statutes'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Statute Search
          </button>
          <button
            onClick={() => setActiveTab('precedents')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'precedents'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Precedent Mapping
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Document Analysis
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'statutes' && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Statute & Regulation Search</h2>
            <StatuteSearch />
          </div>
        )}

        {activeTab === 'precedents' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Precedent Mapping</h2>
            <div className="text-center py-12">
              <p className="text-slate-500">Precedent mapping coming soon...</p>
              <p className="text-sm text-slate-400 mt-2">This feature will help you track legal precedents and case relationships</p>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Document Analysis</h2>
            <div className="text-center py-12">
              <p className="text-slate-500">Document analysis coming soon...</p>
              <p className="text-sm text-slate-400 mt-2">Upload legal documents for AI-powered analysis and summarization</p>
            </div>
          </div>
        )}
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">📚 Comprehensive Database</h3>
          <p className="text-slate-600 text-sm">
            Access federal and state statutes, regulations, and court decisions
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">🔍 Smart Search</h3>
          <p className="text-slate-600 text-sm">
            AI-powered search with semantic understanding and relevance ranking
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">🔗 Cross-Referencing</h3>
          <p className="text-slate-600 text-sm">
            Automatic precedent detection and citation analysis
          </p>
        </div>
      </div>
    </div>
  );
}
