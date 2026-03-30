"use client";

import { useState, useRef } from "react";
import { FileText, Download, Send, Clock, CheckCircle } from "lucide-react";

export default function LegalDraftingPage() {
  const [selectedDocument, setSelectedDocument] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const [generatedDocuments, setGeneratedDocuments] = useState([
    {
      id: 1,
      type: "Motion",
      title: "Motion for Extension of Time",
      date: "2024-01-15",
      status: "completed"
    },
    {
      id: 2,
      type: "Affidavit", 
      title: "Affidavit of Service",
      date: "2024-01-10",
      status: "completed"
    }
  ]);

  const documentTypes = [
    {
      id: "motion",
      title: "Generate Motion",
      description: "Create legal motions for various court procedures",
      icon: "⚖️",
      fields: ["Motion Type", "Case Number", "Court", "Relief Sought"]
    },
    {
      id: "affidavit",
      title: "Generate Affidavit", 
      description: "Draft sworn statements for legal proceedings",
      icon: "📝",
      fields: ["Deponent Name", "Statement Facts", "Exhibits", "Commissioner"]
    },
    {
      id: "written-address",
      title: "Generate Written Address",
      description: "Prepare written arguments for court submission",
      icon: "📋",
      fields: ["Case Issues", "Legal Arguments", "Prayer", "Authorities"]
    },
    {
      id: "affidavit-car-ownership",
      title: "Affidavit for Change of Car Ownership",
      description: "Transfer vehicle ownership legally",
      icon: "🚗",
      fields: ["Current Owner", "New Owner", "Vehicle Details", "Witnesses"]
    },
    {
      id: "affidavit-loss-documents",
      title: "Affidavit of Loss of Important Documents",
      description: "Declare loss of important legal documents",
      icon: "📄",
      fields: ["Document Type", "Circumstances of Loss", "Date of Loss", "Police Report"]
    },
    {
      id: "affidavit-marriage",
      title: "Affidavit of Marriage",
      description: "Legal declaration of marriage for official purposes",
      icon: "💑",
      fields: ["Spouse Names", "Date of Marriage", "Place of Marriage", "Witnesses"]
    },
    {
      id: "affidavit-name-change",
      title: "Affidavit of Facts for Change of Name",
      description: "Legal declaration for name change process",
      icon: "✍️",
      fields: ["Current Name", "New Name", "Reason for Change", "Duration of Usage"]
    },
    {
      id: "affidavit-single-parenthood",
      title: "Affidavit of Single Parenthood",
      description: "Legal declaration of single parent status",
      icon: "👤",
      fields: ["Parent Name", "Child Details", "Other Parent Status", "Duration of Single Parenthood"]
    },
    {
      id: "affidavit-bachelorhood",
      title: "Affidavit of Bachelorhood",
      description: "Legal declaration of bachelor status",
      icon: "🧑",
      fields: ["Full Name", "Declaration of Bachelor Status", "Reason", "Duration"]
    },
    {
      id: "affidavit-spinsterhood",
      title: "Affidavit of Facts as to Spinsterhood",
      description: "Legal declaration of spinster status",
      icon: "👩",
      fields: ["Full Name", "Declaration of Spinster Status", "Reason", "Duration"]
    },
    {
      id: "affidavit-passport-loss",
      title: "Affidavit of Loss of International Passport",
      description: "Declare loss of Nigerian international passport",
      icon: "🛂",
      fields: ["Passport Number", "Date of Issue", "Place of Loss", "Travel Plans"]
    },
    {
      id: "affidavit-sim-loss",
      title: "Affidavit of Loss of SIM Card",
      description: "Declare loss of mobile SIM card for replacement",
      icon: "📱",
      fields: ["Phone Number", "Network Provider", "Date of Loss", "Police Report"]
    },
    {
      id: "affidavit-educational-certificates",
      title: "Affidavit of Loss of Educational Certificates",
      description: "Declare loss of academic certificates",
      icon: "🎓",
      fields: ["Certificate Types", "Institution Names", "Year of Issue", "Circumstances of Loss"]
    },
    {
      id: "affidavit-vehicle-particulars",
      title: "Affidavit of Loss of Vehicle Particulars",
      description: "Declare loss of vehicle registration documents",
      icon: "🚙",
      fields: ["Vehicle Registration", "License Number", "Date of Loss", "Police Report"]
    },
    {
      id: "affidavit-drivers-license",
      title: "Affidavit of Loss of Driver's License",
      description: "Declare loss of Nigerian driver's license",
      icon: "🪪",
      fields: ["License Number", "Date of Issue", "Place of Loss", "Police Report"]
    },
    {
      id: "statement-of-claim",
      title: "Statement of Claim",
      description: "Initiate civil proceedings with detailed claim",
      icon: "📜",
      fields: ["Plaintiff Details", "Defendant Details", "Nature of Claim", "Relief Sought"]
    },
    {
      id: "statement-of-defense",
      title: "Statement of Defense",
      description: "Respond to civil claims with defense arguments",
      icon: "🛡️",
      fields: ["Defendant Details", "Plaintiff Details", "Defense Arguments", "Prayer"]
    },
    {
      id: "notice-of-appeal",
      title: "Notice of Appeal",
      description: "Appeal lower court decisions to higher court",
      icon: "⚡",
      fields: ["Lower Court Details", "Judgment Date", "Grounds of Appeal", "Relief Sought"]
    },
    {
      id: "writ-of-summons",
      title: "Writ of Summons",
      description: "Formally summon defendant to court",
      icon: "📬",
      fields: ["Plaintiff Details", "Defendant Details", "Court Jurisdiction", "Case Nature"]
    }
  ];

  const handleGenerateDocument = async (type: string) => {
    setSelectedDocument(type);
    setIsGenerating(true);
    
    try {
      console.log('🔍 DEBUG: Starting document generation for type:', type);
      
      // Get user data for personalization
      console.log('🔍 DEBUG: Fetching user data from: http://localhost:8000/api/auth/profile/');
      const userResponse = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔍 DEBUG: User response status:', userResponse.status);
      const userData = userResponse.ok ? await userResponse.json() : {};
      console.log('🔍 DEBUG: User data:', userData);
      
      // Prepare case details for AI
      const caseDetails = {
        case_type: "General Legal Matter",
        legal_issue: "Document generation request",
        jurisdiction: "Lagos State, Nigeria",
        facts: `Document generated on ${new Date().toLocaleDateString()} for ${userData.name || 'User'}`,
        parties: userData.name || "User",
        arguments: "Standard legal arguments",
        deponent: userData.name || "User"
      };

      console.log('🔍 DEBUG: Case details prepared:', caseDetails);
      console.log('🔍 DEBUG: Calling AI service at: http://localhost:8002/ai/legal-drafting');

      // Call real FastAPI service
      const response = await fetch('http://localhost:8002/ai/legal-drafting', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          document_type: type,
          case_details: caseDetails
        })
      });

      console.log('🔍 DEBUG: AI response status:', response.status);
      console.log('🔍 DEBUG: AI response ok:', response.ok);

      if (!response.ok) {
        console.log('🔍 DEBUG: Response not ok, throwing error');
        throw new Error('Failed to generate document');
      }

      const result = await response.json();
      console.log('🔍 DEBUG: AI result:', result);
      setDocumentContent(result.document);
      
      // Add to generated documents
      const newDoc = {
        id: generatedDocuments.length + 1,
        type: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' '),
        title: `${type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')} - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString().split('T')[0],
        status: "completed"
      };
      
      setGeneratedDocuments([newDoc, ...generatedDocuments]);
      setMessage("Document generated successfully!");
      setMessageType("success");
      
    } catch (error) {
      console.error('Error generating document:', error);
      setMessage("Failed to generate document. Please try again.");
      setMessageType("error");
      setDocumentContent("Error: Unable to generate document at this time. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Legal Drafting AI</h1>
        <p className="text-slate-600 mt-1">Generate professional legal documents with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Types */}
        <div className="lg:col-span-1">
          <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Document Types</h2>
            <div className="space-y-3">
              {documentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleGenerateDocument(type.id)}
                  disabled={isGenerating && selectedDocument === type.id}
                  className="w-full text-left p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{type.icon}</span>
                    <h3 className="font-medium text-slate-900">{type.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{type.description}</p>
                  {isGenerating && selectedDocument === type.id && (
                    <div className="flex items-center gap-2 mt-2 text-blue-600">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Generating...</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="lg:col-span-2">
          <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Generated Document</h2>
              {documentContent && (
                <div className="flex items-center gap-2">
                  <button 
                    ref={copyButtonRef}
                    onClick={() => {
                      navigator.clipboard.writeText(documentContent).then(() => {
                        // Show success feedback
                        if (copyButtonRef.current) {
                          const originalText = copyButtonRef.current.textContent;
                          copyButtonRef.current.textContent = 'Copied!';
                          copyButtonRef.current.classList.add('bg-green-600', 'text-white');
                          setTimeout(() => {
                            if (copyButtonRef.current) {
                              copyButtonRef.current.textContent = originalText;
                              copyButtonRef.current.classList.remove('bg-green-600', 'text-white');
                            }
                          }, 2000);
                        }
                      }).catch(err => {
                        console.error('Failed to copy: ', err);
                      });
                    }}
                    className="px-3 py-1 text-sm border border-slate-300 rounded-lg transition-colors"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    Copy
                  </button>
                  <button 
                    ref={downloadButtonRef}
                    onClick={() => {
                      // Create downloadable file
                      const content = documentContent;
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `legal-document-${new Date().toISOString().split('T')[0]}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              )}
            </div>
            
            {documentContent ? (
              <div className="space-y-4">
                <textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  className="w-full h-96 p-4 border border-slate-200 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                />
                <div className="flex justify-end">
                  <button 
                    ref={saveButtonRef}
                    onClick={() => {
                      // Save document to localStorage and show feedback
                      const documentName = `document-${new Date().toISOString().split('T')[0]}`;
                      const savedDocuments = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
                      const newDocument = {
                        id: Date.now(),
                        name: documentName,
                        content: documentContent,
                        date: new Date().toISOString(),
                        type: selectedDocument
                      };
                      savedDocuments.push(newDocument);
                      localStorage.setItem('savedDocuments', JSON.stringify(savedDocuments));
                      
                      // Show success feedback
                      if (saveButtonRef.current) {
                        const originalText = saveButtonRef.current.innerHTML;
                        saveButtonRef.current.innerHTML = '<CheckCircle className="h-4 w-4" /> Saved!';
                        saveButtonRef.current.classList.add('bg-green-600');
                        setTimeout(() => {
                          if (saveButtonRef.current) {
                            saveButtonRef.current.innerHTML = originalText;
                            saveButtonRef.current.classList.remove('bg-green-600');
                          }
                        }, 2000);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Save Document
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">Select a document type to generate</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generated Documents History */}
      {generatedDocuments.length > 0 && (
        <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Documents</h2>
          <div className="space-y-3">
            {generatedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-slate-900">{doc.title}</h4>
                    <p className="text-sm text-slate-600">{doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 border border-blue-200 text-blue-800 rounded-full">
                    {doc.type}
                  </span>
                  <button className="px-3 py-1 text-sm border border-slate-300 rounded-lg transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
