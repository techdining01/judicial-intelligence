/**
 * Concept Builder Page
 * Main page for the drag-and-drop legal system builder
 */

'use client';

import DashboardLayout from '@/src/components/Dashboard/DashboardLayout';
import ConceptBuilder from '@/src/components/Builder/ConceptBuilder';

export default function ConceptBuilderPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Concept Builder</h1>
          <p className="text-slate-600">Design and visualize legal systems with interactive building blocks</p>
        </div>

        {/* Builder Canvas */}
        <ConceptBuilder />

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">How to Use the Concept Builder</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Getting Started:</h4>
              <ul className="space-y-1">
                <li>• Drag blocks from the palette to the canvas</li>
                <li>• Click on ports to connect blocks</li>
                <li>• Select blocks to edit properties</li>
                <li>• Use the Run Simulation button to test your system</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Block Types:</h4>
              <ul className="space-y-1">
                <li>• <strong>Legal Input:</strong> Entry points for data</li>
                <li>• <strong>Legal Process:</strong> Transform information</li>
                <li>• <strong>Legal Decision:</strong> Decision points</li>
                <li>• <strong>Legal Output:</strong> Generate results</li>
                <li>• <strong>Legal Data:</strong> Store information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
