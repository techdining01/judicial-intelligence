"use client";

import { useState } from 'react';
import SmallClaimsAssistant from '@/components/legal-practice/SmallClaimsAssistant';

export default function LegalPracticePage() {
  const [activeTab, setActiveTab] = useState<'small-claims' | 'document-drafting' | 'evidence' | 'timeline'>('small-claims');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Legal Practice Tools</h1>
        <p className="text-slate-600 mt-2">Practical legal workflow support for real legal matters</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab('small-claims')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'small-claims'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Small Claims Assistant
          </button>
          <button
            onClick={() => setActiveTab('document-drafting')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'document-drafting'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Document Drafting
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'evidence'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Evidence Organizer
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'timeline'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Case Timeline
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'small-claims' && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Small Claims Assistant</h2>
            <SmallClaimsAssistant />
          </div>
        )}

        {activeTab === 'document-drafting' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Legal Document Drafting</h2>
            <div className="text-center py-12">
              <p className="text-slate-500">Document drafting coming soon...</p>
              <p className="text-sm text-slate-400 mt-2">AI-powered generation of legal documents</p>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Evidence Organizer</h2>
            <div className="text-center py-12">
              <p className="text-slate-500">Evidence organizer coming soon...</p>
              <p className="text-sm text-slate-400 mt-2">Upload and categorize evidence for your case</p>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Case Timeline Builder</h2>
            <div className="text-center py-12">
              <p className="text-slate-500">Timeline builder coming soon...</p>
              <p className="text-sm text-slate-400 mt-2">Create chronological timelines of legal events</p>
            </div>
          </div>
        )}
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">⚖️ Guided Workflows</h3>
          <p className="text-slate-600 text-sm">
            Step-by-step assistance for common legal procedures
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">📝 Document Generation</h3>
          <p className="text-slate-600 text-sm">
            AI-powered drafting of legal documents and forms
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">📁 Case Management</h3>
          <p className="text-slate-600 text-sm">
            Organize evidence, documents, and timelines
          </p>
        </div>
      </div>
    </div>
  );
}
