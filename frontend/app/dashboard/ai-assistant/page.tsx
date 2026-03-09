/**
 * AI Assistant Page
 * Main page for AI-powered legal assistance
 */

'use client';

import DashboardLayout from '@/src/components/Dashboard/DashboardLayout';
import AIAssistant from '@/src/components/AI/AIAssistantFixed';

export default function AIAssistantPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
          <p className="text-slate-600">Get instant help with legal questions and concepts</p>
        </div>

        {/* AI Chat Interface */}
        <AIAssistant />

        {/* Capabilities */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">AI Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                📚
              </div>
              <h4 className="font-medium text-slate-900 mb-1">Legal Research</h4>
              <p className="text-sm text-slate-600">Find relevant cases and statutes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                ⚖️
              </div>
              <h4 className="font-medium text-slate-900 mb-1">Case Analysis</h4>
              <p className="text-sm text-slate-600">Analyze legal precedents</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                📝
              </div>
              <h4 className="font-medium text-slate-900 mb-1">Document Review</h4>
              <p className="text-sm text-slate-600">Review and improve legal documents</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                💡
              </div>
              <h4 className="font-medium text-slate-900 mb-1">Legal Advice</h4>
              <p className="text-sm text-slate-600">Get guidance on legal procedures</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
