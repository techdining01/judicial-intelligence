/**
 * Legal Document Drafting Component
 * AI-powered legal document generation
 */

'use client';

import { useState } from 'react';
import { apiClient } from '@/utils/api';

interface CaseDetails {
  case_type: string;
  legal_issue: string;
  jurisdiction: string;
  facts?: string;
  parties?: string;
  arguments?: string;
  deponent?: string;
}

interface DraftingResult {
  document_type: string;
  document: string;
  status: string;
}

const DOCUMENT_TYPES = [
  { value: 'motion', label: 'Motion' },
  { value: 'affidavit', label: 'Affidavit' },
  { value: 'statement_of_claim', label: 'Statement of Claim' },
  { value: 'written_address', label: 'Written Address' },
];

const CASE_TYPES = [
  { value: 'Contract Law', label: 'Contract Law' },
  { value: 'Tort Law', label: 'Tort Law' },
  { value: 'Criminal Law', label: 'Criminal Law' },
  { value: 'Constitutional Law', label: 'Constitutional Law' },
  { value: 'Family Law', label: 'Family Law' },
  { value: 'Commercial Law', label: 'Commercial Law' },
];

const JURISDICTIONS = [
  { value: 'Lagos State High Court', label: 'Lagos State High Court' },
  { value: 'Federal High Court', label: 'Federal High Court' },
  { value: 'Court of Appeal', label: 'Court of Appeal' },
  { value: 'Supreme Court', label: 'Supreme Court' },
];

export default function LegalDrafting() {
  const [documentType, setDocumentType] = useState('motion');
  const [caseDetails, setCaseDetails] = useState<CaseDetails>({
    case_type: '',
    legal_issue: '',
    jurisdiction: '',
    facts: '',
    parties: '',
    arguments: '',
    deponent: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DraftingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!caseDetails.case_type || !caseDetails.legal_issue || !caseDetails.jurisdiction) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.generateLegalDocument(documentType, caseDetails);
      
      if (response.status === 'success' && response.data) {
        setResult(response.data as DraftingResult);
      } else {
        setError(response.error || 'Failed to generate document');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCaseDetails({
      case_type: '',
      legal_issue: '',
      jurisdiction: '',
      facts: '',
      parties: '',
      arguments: '',
      deponent: '',
    });
    setResult(null);
    setError(null);
  };

  const updateCaseDetails = (field: keyof CaseDetails, value: string) => {
    setCaseDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Legal Document Drafting
        </h2>
        <p className="text-gray-600">
          Generate professional legal documents tailored to your case details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type *
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              {DOCUMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Type *
            </label>
            <select
              value={caseDetails.case_type}
              onChange={(e) => updateCaseDetails('case_type', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">Select case type</option>
              {CASE_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Legal Issue *
            </label>
            <input
              type="text"
              value={caseDetails.legal_issue}
              onChange={(e) => updateCaseDetails('legal_issue', e.target.value)}
              placeholder="e.g., Breach of Contract"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jurisdiction *
            </label>
            <select
              value={caseDetails.jurisdiction}
              onChange={(e) => updateCaseDetails('jurisdiction', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">Select jurisdiction</option>
              {JURISDICTIONS.map(jur => (
                <option key={jur.value} value={jur.value}>
                  {jur.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facts of the Case
            </label>
            <textarea
              value={caseDetails.facts}
              onChange={(e) => updateCaseDetails('facts', e.target.value)}
              placeholder="Describe the relevant facts..."
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>

          {documentType === 'statement_of_claim' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parties
              </label>
              <input
                type="text"
                value={caseDetails.parties}
                onChange={(e) => updateCaseDetails('parties', e.target.value)}
                placeholder="e.g., John Doe vs. XYZ Corporation"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          )}

          {documentType === 'affidavit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deponent
              </label>
              <input
                type="text"
                value={caseDetails.deponent}
                onChange={(e) => updateCaseDetails('deponent', e.target.value)}
                placeholder="Name of person making the affidavit"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          )}

          {documentType === 'written_address' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arguments
              </label>
              <textarea
                value={caseDetails.arguments}
                onChange={(e) => updateCaseDetails('arguments', e.target.value)}
                placeholder="Key arguments to be made..."
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Document'}
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
            <div className="mt-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Generated {DOCUMENT_TYPES.find(t => t.value === documentType)?.label}
                </h3>
                <div className="bg-white p-4 rounded border border-green-300">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {result.document}
                  </pre>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => navigator.clipboard.writeText(result.document)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Copy Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
