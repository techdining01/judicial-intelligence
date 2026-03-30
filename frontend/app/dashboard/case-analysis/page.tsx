"use client";

import { useState } from "react";
import { Gavel, Search, AlertCircle, CheckCircle, Clock, FileText, Scale, TrendingUp } from "lucide-react";

export default function CaseAnalysisPage() {
  const [disputeDescription, setDisputeDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [savedCases, setSavedCases] = useState([
    {
      id: 1,
      title: "Contract Dispute - Tech Startup",
      status: "completed",
      date: "2024-01-15",
      score: 85,
      issues: ["Breach of Contract", "Non-payment"]
    },
    {
      id: 2,
      title: "Landlord-Tenant Dispute",
      status: "in-progress", 
      date: "2024-01-10",
      score: 72,
      issues: ["Unpaid Rent", "Property Damage"]
    }
  ]);

  const handleCaseAnalysis = async () => {
    if (!disputeDescription.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        legalIssues: [
          {
            issue: "Breach of Contract",
            severity: "High",
            description: "The facts indicate a clear violation of contractual obligations",
            applicableLaws: ["Contract Act 1950", "Commercial Law"],
            potentialClaims: ["Damages", "Specific Performance"]
          },
          {
            issue: "Negligence",
            severity: "Medium", 
            description: "Evidence suggests failure to exercise reasonable care",
            applicableLaws: ["Law of Torts", "Duty of Care"],
            potentialClaims: ["Compensation", "Injunction"]
          }
        ],
        possibleDefenses: [
          {
            defense: "Force Majeure",
            strength: "Weak",
            description: "Limited evidence of uncontrollable circumstances"
          },
          {
            defense: "Contributory Negligence",
            strength: "Medium",
            description: "Some evidence suggests shared responsibility"
          }
        ],
        jurisdiction: "Lagos State High Court",
        estimatedTimeline: "6-12 months",
        successProbability: 75,
        recommendedActions: [
          "Gather additional documentary evidence",
          "File formal complaint within limitation period",
          "Consider alternative dispute resolution",
          "Consult with specialist counsel"
        ],
        similarCases: [
          {
            case: "Smith v. Jones (2023)",
            outcome: "Plaintiff awarded damages",
            relevance: "Similar contractual breach"
          },
          {
            case: "ABC Corp v. XYZ Ltd (2022)",
            outcome: "Settlement reached",
            relevance: "Comparable business dispute"
          }
        ],
        evidenceRequired: [
          "Written contract or agreement",
          "Communication records",
          "Financial documents",
          "Witness statements",
          "Expert reports if applicable"
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case "strong":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "weak":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Case Analysis Engine</h1>
        <p className="text-slate-600 mt-1">AI-powered legal dispute analysis and recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Describe Your Dispute</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dispute Description
                </label>
                <textarea
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="Provide a detailed description of your legal dispute, including relevant facts, dates, parties involved, and what outcome you're seeking..."
                  rows={6}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Jurisdiction
                  </label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    <option value="">Select State</option>
                    <option value="Abia">Abia State</option>
                    <option value="Adamawa">Adamawa State</option>
                    <option value="Akwa Ibom">Akwa Ibom State</option>
                    <option value="Anambra">Anambra State</option>
                    <option value="Bauchi">Bauchi State</option>
                    <option value="Bayelsa">Bayelsa State</option>
                    <option value="Benue">Benue State</option>
                    <option value="Borno">Borno State</option>
                    <option value="Cross River">Cross River State</option>
                    <option value="Delta">Delta State</option>
                    <option value="Ebonyi">Ebonyi State</option>
                    <option value="Edo">Edo State</option>
                    <option value="Ekiti">Ekiti State</option>
                    <option value="Enugu">Enugu State</option>
                    <option value="FCT">Federal Capital Territory (Abuja)</option>
                    <option value="Gombe">Gombe State</option>
                    <option value="Imo">Imo State</option>
                    <option value="Jigawa">Jigawa State</option>
                    <option value="Kaduna">Kaduna State</option>
                    <option value="Kano">Kano State</option>
                    <option value="Katsina">Katsina State</option>
                    <option value="Kebbi">Kebbi State</option>
                    <option value="Kogi">Kogi State</option>
                    <option value="Kwara">Kwara State</option>
                    <option value="Lagos">Lagos State</option>
                    <option value="Nasarawa">Nasarawa State</option>
                    <option value="Niger">Niger State</option>
                    <option value="Ogun">Ogun State</option>
                    <option value="Ondo">Ondo State</option>
                    <option value="Osun">Osun State</option>
                    <option value="Oyo">Oyo State</option>
                    <option value="Plateau">Plateau State</option>
                    <option value="Rivers">Rivers State</option>
                    <option value="Sokoto">Sokoto State</option>
                    <option value="Taraba">Taraba State</option>
                    <option value="Yobe">Yobe State</option>
                    <option value="Zamfara">Zamfara State</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Dispute Type
                  </label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    <option>Contract Dispute</option>
                    <option>Property Dispute</option>
                    <option>Employment Issue</option>
                    <option>Family Matter</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCaseAnalysis}
                disabled={!disputeDescription.trim() || isAnalyzing}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="h-5 w-5 animate-spin" />
                    Analyzing Case...
                  </>
                ) : (
                  <>
                    <Gavel className="h-5 w-5" />
                    Analyze Dispute
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Saved Cases */}
        <div className="lg:col-span-1">
          <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Saved Cases</h2>
            <div className="space-y-3">
              {savedCases.map((case_) => (
                <div
                  key={case_.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-900">{case_.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded ${
                      case_.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {case_.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Date: {case_.date}</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {case_.score}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {case_.issues.map((issue, index) => (
                        <span key={index} className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Success Probability</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{analysis.successProbability}%</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-slate-700">Legal Issues</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{analysis.legalIssues.length}</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">Defenses</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{analysis.possibleDefenses.length}</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">Timeline</span>
              </div>
              <div className="text-lg font-bold text-purple-600">{analysis.estimatedTimeline}</div>
            </div>
          </div>

          {/* Legal Issues */}
          <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Identified Legal Issues</h3>
            <div className="space-y-4">
              {analysis.legalIssues.map((issue: any, index: number) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-900">{issue.issue}</h4>
                    <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{issue.description}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-slate-700">Applicable Laws:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {issue.applicableLaws.map((law: any, lawIndex: number) => (
                          <span key={lawIndex} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {law}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-700">Potential Claims:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {issue.potentialClaims.map((claim: any, claimIndex: number) => (
                          <span key={claimIndex} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {claim}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommended Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.recommendedActions.map((action: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Cases */}
          <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Similar Cases</h3>
            <div className="space-y-3">
              {analysis.similarCases.map((case_: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">{case_.case}</h4>
                    <p className="text-sm text-slate-600">{case_.relevance}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded ${
                      case_.outcome.includes("Plaintiff") 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {case_.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
