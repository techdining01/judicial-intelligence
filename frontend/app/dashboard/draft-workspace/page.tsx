/**
 * Draft Workspace Page
 * Main page for document creation and editing
 */

'use client';

import DashboardLayout from '@/src/components/Dashboard/DashboardLayout';
import DraftWorkspace from '@/src/components/Draft/DraftWorkspace';

export default function DraftWorkspacePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Draft Workspace</h1>
          <p className="text-slate-600">Create and edit legal documents with AI assistance</p>
        </div>

        {/* Draft Editor */}
        <DraftWorkspace />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Rich Text Editor</h3>
            <p className="text-sm text-blue-800">Professional formatting tools for legal documents</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Module Integration</h3>
            <p className="text-sm text-green-800">Link directly to learning modules and references</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">AI Assistance</h3>
            <p className="text-sm text-purple-800">Get help with legal writing and research</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
