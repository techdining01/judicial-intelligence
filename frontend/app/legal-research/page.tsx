/**
 * Legal Research Page
 * Main interface for legal research tools and AI-powered analysis
 */

'use client';

import { useState } from 'react';
import LegalSummarizer from '@/components/ai/LegalSummarizer';
import LegalDrafting from '@/components/ai/LegalDrafting';
import RulesEngine from '@/components/rules/RulesEngine';

type Tool = 'summarizer' | 'drafting' | 'rules';

export default function LegalResearchPage() {
  const [activeTool, setActiveTool] = useState<Tool>('summarizer');

  const tools = [
    { id: 'summarizer' as Tool, name: 'AI Summarizer', icon: '📝', description: 'Summarize legal documents' },
    { id: 'drafting' as Tool, name: 'Document Drafting', icon: '⚖️', description: 'Generate legal documents' },
    { id: 'rules' as Tool, name: 'Rules Engine', icon: '📚', description: 'Legal rules & procedures' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Legal Research Platform
          </h1>
          <p className="text-gray-600">
            AI-powered legal research tools for Nigerian legal professionals
          </p>
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTool === tool.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tool.icon}</span>
                  {tool.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">{tools.find(t => t.id === activeTool)?.icon}</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-900">
                  {tools.find(t => t.id === activeTool)?.name}
                </h3>
                <p className="text-blue-700 text-sm">
                  {tools.find(t => t.id === activeTool)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {activeTool === 'summarizer' && <LegalSummarizer />}
          {activeTool === 'drafting' && <LegalDrafting />}
          {activeTool === 'rules' && <RulesEngine />}
        </div>
      </div>
    </div>
  );
}
