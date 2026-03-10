"use client";

import { useState } from "react";
import { FileText, Download, Send, Clock, CheckCircle } from "lucide-react";

export default function LegalDraftingPage() {
  const [selectedDocument, setSelectedDocument] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
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
    }
  ];

  const handleGenerateDocument = async (type: string) => {
    setSelectedDocument(type);
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockContent = {
        motion: `IN THE HIGH COURT OF LAGOS STATE\n\nHOLDEN AT LAGOS\n\nSUIT NO: LD/123/2024\n\nBETWEEN\n\nPLAINTIFF\n\nAND\n\nDEFENDANT\n\n\nMOTION FOR EXTENSION OF TIME\n\nDATED: ${new Date().toLocaleDateString()}\n\n\nTAKE NOTICE that the Plaintiff herein applies to this Honorable Court for an order extending the time for filing of the Statement of Claim.\n\n\nGROUNDS FOR THE APPLICATION\n\n1. The Plaintiff requires additional time to properly prepare and file the Statement of Claim.\n2. The delay will not prejudice the Defendant.\n3. It is in the interest of justice to grant this application.\n\n\nAND FOR SUCH FURTHER ORDERS as this Honorable Court may deem fit to make in the circumstances.\n\n\nDATED AT LAGOS THIS ${new Date().toLocaleDateString()}\n\n\n_________________________\nCOUNSEL TO THE PLAINTIFF`,
        
        affidavit: `AFFIDAVIT OF SERVICE\n\nI, ${documentContent.includes('Deponent') ? 'John Doe' : 'Jane Smith'} of Lagos, Nigeria, do hereby make oath and state as follows:\n\n1. That I am a legal practitioner in the firm of ${documentContent.includes('Firm') ? 'Legal Associates' : 'Law Partners'}.\n\n2. That I am duly authorized by the Plaintiff to make this affidavit.\n\n3. That on the ${new Date().toLocaleDateString()}, I personally served the Defendant with the court processes.\n\n4. That the Defendant acknowledged receipt of the documents.\n\n5. That I make this affidavit in good faith and in belief of the facts stated herein.\n\n\nSWORN TO AT LAGOS\nThis ${new Date().toLocaleDateString()}\n\n\n_________________________\nDEPONENT\n\n\nBEFORE ME\n\n_________________________\nCOMMISSIONER FOR OATHS`,
        
        "written-address": `WRITTEN ADDRESS ON THE MERITS\n\nINTRODUCTION\n\nMy Lord, the issues for determination in this appeal are:\n\n1. Whether the trial court was right in its decision.\n2. Whether the appellant is entitled to the relief sought.\n\n\nARGUMENTS\n\nIssue 1: Jurisdiction and Proper Procedure\n\nIt is trite law that jurisdiction is fundamental and must be properly established. The case of ${documentContent.includes('Case') ? 'Smith v. Jones' : 'Doe v. Roe'} establishes this principle.\n\nThe trial court properly exercised jurisdiction in this matter as:\n- The parties are within its territorial jurisdiction\n- The subject matter falls within its competence\n- All procedural requirements were complied with\n\n\nIssue 2: Merits of the Case\n\nThe evidence before the court clearly establishes that:\n1. The appellant has a valid cause of action\n2. The respondent is liable as claimed\n3. The damages awarded are appropriate\n\n\nAUTHORITIES\n\n1. ${documentContent.includes('Authority') ? 'Supreme Court case' : 'Leading precedent'}\n2. Relevant statutory provisions\n3. Established legal principles\n\n\nPRAYER\n\nIn the circumstances, we humbly pray this Honorable Court to:\n1. Allow the appeal\n2. Set aside the decision of the lower court\n3. Grant such further orders as deemed just\n\n\nCONCLUSION\n\nThe appeal has merit and ought to be allowed.\n\n\nDATED: ${new Date().toLocaleDateString()}\n\n\n_________________________\nCOUNSEL`
      };
      
      setDocumentContent(mockContent[type as keyof typeof mockContent] || "");
      setIsGenerating(false);
      
      // Add to generated documents
      const newDoc = {
        id: generatedDocuments.length + 1,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString().split('T')[0],
        status: "completed"
      };
      setGeneratedDocuments([newDoc, ...generatedDocuments]);
    }, 2000);
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
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Document Types</h2>
            <div className="space-y-3">
              {documentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleGenerateDocument(type.id)}
                  disabled={isGenerating && selectedDocument === type.id}
                  className="w-full text-left p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Generated Document</h2>
              {documentContent && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(documentContent)}
                    className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    Copy
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
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
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
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
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
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
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {doc.type}
                  </span>
                  <button className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
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
