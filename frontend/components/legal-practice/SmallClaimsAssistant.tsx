"use client";

import { useState } from 'react';
import { FileText, Users, DollarSign, Calendar, CheckCircle, AlertCircle, Clock, ArrowRight, Download } from 'lucide-react';

interface ClaimDetails {
  claimType: string;
  amount: number;
  description: string;
  defendantName: string;
  defendantAddress: string;
  incidentDate: string;
  location: string;
  evidence: string[];
}

interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  recommendations: string[];
  nextSteps: string[];
}

interface FilingRequirements {
  documents: string[];
  fees: number;
  timeline: string;
  court: string;
}

export default function SmallClaimsAssistant() {
  const [currentStep, setCurrentStep] = useState(1);
  const [claimDetails, setClaimDetails] = useState<ClaimDetails>({
    claimType: '',
    amount: 0,
    description: '',
    defendantName: '',
    defendantAddress: '',
    incidentDate: '',
    location: '',
    evidence: []
  });
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [filingRequirements, setFilingRequirements] = useState<FilingRequirements | null>(null);
  const [loading, setLoading] = useState(false);

  const claimTypes = [
    'Contract Dispute',
    'Property Damage',
    'Personal Injury',
    'Debt Collection',
    'Landlord-Tenant',
    'Consumer Complaint',
    'Employment Dispute',
    'Other'
  ];

  const steps = [
    { id: 1, title: 'Claim Details', icon: FileText },
    { id: 2, title: 'Eligibility Check', icon: CheckCircle },
    { id: 3, title: 'Filing Requirements', icon: Users },
    { id: 4, title: 'Readiness Report', icon: Download }
  ];

  const handleEligibilityCheck = async () => {
    setLoading(true);
    try {
      // Mock API call
      const response = await fetch('/api/legal-practice/small-claims/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimDetails)
      });
      
      if (response.ok) {
        const data = await response.json();
        setEligibilityResult(data);
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('Eligibility check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilingRequirements = async () => {
    setLoading(true);
    try {
      // Mock API call
      const response = await fetch('/api/legal-practice/small-claims/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimDetails)
      });
      
      if (response.ok) {
        const data = await response.json();
        setFilingRequirements(data);
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Requirements check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Tell us about your dispute</h3>
        <p className="text-slate-600">Provide details about your small claims case to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Claim Type</label>
          <select
            value={claimDetails.claimType}
            onChange={(e) => setClaimDetails({...claimDetails, claimType: e.target.value})}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            <option value="">Select claim type</option>
            {claimTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Claim Amount (₦)</label>
          <input
            type="number"
            value={claimDetails.amount || ''}
            onChange={(e) => setClaimDetails({...claimDetails, amount: parseFloat(e.target.value) || 0})}
            placeholder="5000000"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          />
          <p className="text-xs text-slate-500 mt-1">Maximum: ₦5,000,000 for small claims</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Defendant Name</label>
          <input
            type="text"
            value={claimDetails.defendantName}
            onChange={(e) => setClaimDetails({...claimDetails, defendantName: e.target.value})}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Defendant Address</label>
          <input
            type="text"
            value={claimDetails.defendantAddress}
            onChange={(e) => setClaimDetails({...claimDetails, defendantAddress: e.target.value})}
            placeholder="123 Main St, Lagos"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Incident Date</label>
          <input
            type="date"
            value={claimDetails.incidentDate}
            onChange={(e) => setClaimDetails({...claimDetails, incidentDate: e.target.value})}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Location of Incident</label>
          <input
            type="text"
            value={claimDetails.location}
            onChange={(e) => setClaimDetails({...claimDetails, location: e.target.value})}
            placeholder="Lagos, Nigeria"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Case Description</label>
        <textarea
          value={claimDetails.description}
          onChange={(e) => setClaimDetails({...claimDetails, description: e.target.value})}
          placeholder="Describe what happened in detail..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 resize-none"
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleEligibilityCheck}
          disabled={!claimDetails.claimType || !claimDetails.amount || !claimDetails.description || loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}
        >
          {loading ? 'Checking...' : 'Check Eligibility'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Eligibility Assessment</h3>
        <p className="text-slate-600">Based on your claim details, here's your eligibility assessment.</p>
      </div>

      {eligibilityResult && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${
            eligibilityResult.isEligible 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {eligibilityResult.isEligible ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
              <h4 className={`text-lg font-semibold ${
                eligibilityResult.isEligible ? 'text-green-900' : 'text-red-900'
              }`}>
                {eligibilityResult.isEligible ? 'Eligible for Small Claims Court' : 'Not Eligible for Small Claims Court'}
              </h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-slate-800 mb-2">Assessment Reasons:</h5>
                <ul className="space-y-1">
                  {eligibilityResult.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-slate-400 mt-1">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-slate-800 mb-2">Recommendations:</h5>
                <ul className="space-y-1">
                  {eligibilityResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-blue-500 mt-1">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {eligibilityResult.isEligible && (
                <div>
                  <h5 className="font-medium text-slate-800 mb-2">Next Steps:</h5>
                  <ul className="space-y-1">
                    {eligibilityResult.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-green-500 mt-1">✓</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              Back
            </button>
            
            {eligibilityResult.isEligible && (
              <button
                onClick={handleFilingRequirements}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                {loading ? 'Loading...' : 'View Filing Requirements'}
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Filing Requirements</h3>
        <p className="text-slate-600">Here's what you'll need to file your small claims case.</p>
      </div>

      {filingRequirements && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Required Documents
                </h4>
                <ul className="space-y-2">
                  {filingRequirements.documents.map((doc, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                      <FileText className="h-4 w-4 text-slate-400 mt-0.5" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Filing Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Filing Fees</p>
                    <p className="text-lg font-semibold text-slate-900">₦{filingRequirements.fees.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Processing Time</p>
                    <p className="text-sm font-medium text-slate-800">{filingRequirements.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Court Jurisdiction</p>
                    <p className="text-sm font-medium text-slate-800">{filingRequirements.court}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">Important Notes</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• All documents must be original or certified copies</li>
                  <li>• Filing fees are non-refundable</li>
                  <li>• You must serve the defendant within 30 days</li>
                  <li>• Court dates are scheduled based on availability</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              Back
            </button>
            
            <button
              onClick={() => setCurrentStep(4)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              Generate Readiness Report
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Filing Readiness Report</h3>
        <p className="text-slate-600">Your comprehensive small claims filing report is ready.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-semibold text-slate-900 mb-2">Claim Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Claim Type:</span>
                <span className="ml-2 font-medium text-slate-900">{claimDetails.claimType}</span>
              </div>
              <div>
                <span className="text-slate-600">Amount:</span>
                <span className="ml-2 font-medium text-slate-900">₦{claimDetails.amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-600">Defendant:</span>
                <span className="ml-2 font-medium text-slate-900">{claimDetails.defendantName}</span>
              </div>
              <div>
                <span className="text-slate-600">Incident Date:</span>
                <span className="ml-2 font-medium text-slate-900">{claimDetails.incidentDate}</span>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-semibold text-slate-900 mb-2">Eligibility Status</h4>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              eligibilityResult?.isEligible 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {eligibilityResult?.isEligible ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {eligibilityResult?.isEligible ? 'Eligible' : 'Not Eligible'}
            </div>
          </div>

          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-semibold text-slate-900 mb-2">Required Actions</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">1.</span>
                Gather all required documents listed in filing requirements
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">2.</span>
                Prepare filing fee payment (₦{filingRequirements?.fees.toLocaleString()})
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">3.</span>
                Visit {filingRequirements?.court} to file the claim
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">4.</span>
                Serve the defendant within 30 days of filing
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Timeline</h4>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">Processing:</span>
                <span className="font-medium text-slate-900">{filingRequirements?.timeline}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(3)}
          className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}
        >
          Back
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              // Download report functionality
              const reportData = {
                claimDetails,
                eligibilityResult,
                filingRequirements,
                generatedAt: new Date().toISOString()
              };
              const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `small-claims-report-${Date.now()}.json`;
              a.click();
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            <Download className="h-5 w-5" />
            Download Report
          </button>
          
          <button
            onClick={() => {
              // Reset form
              setCurrentStep(1);
              setClaimDetails({
                claimType: '',
                amount: 0,
                description: '',
                defendantName: '',
                defendantAddress: '',
                incidentDate: '',
                location: '',
                evidence: []
              });
              setEligibilityResult(null);
              setFilingRequirements(null);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          >
            Start New Claim
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Small Claims Assistant</h2>
        <p className="text-slate-600 mt-1">Guided assistance for small claims disputes up to ₦5,000,000</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-900' : 'text-slate-600'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
}
