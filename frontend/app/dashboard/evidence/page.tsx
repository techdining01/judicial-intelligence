"use client";

import { useState } from "react";
import { Upload, FolderOpen, FileText, Search, Tag, Calendar, Download, Eye } from "lucide-react";

export default function EvidencePage() {
  const [evidenceFiles, setEvidenceFiles] = useState([
    {
      id: 1,
      name: "Contract Agreement.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      tags: ["Contract", "Agreement", "Signed"],
      category: "Legal Documents",
      extractedText: "This agreement is made between Party A and Party B..."
    },
    {
      id: 2,
      name: "Email Correspondence.eml",
      type: "Email",
      size: "156 KB",
      uploadDate: "2024-01-12",
      tags: ["Communication", "Negotiation"],
      category: "Correspondence",
      extractedText: "Regarding the contract terms discussed in our previous meeting..."
    },
    {
      id: 3,
      name: "Payment Receipt.jpg",
      type: "Image",
      size: "1.2 MB",
      uploadDate: "2024-01-10",
      tags: ["Payment", "Receipt", "Proof"],
      category: "Financial Records",
      extractedText: "Received payment of ₦500,000 for services rendered..."
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const categories = [
    { id: "all", name: "All Files", count: evidenceFiles.length },
    { id: "legal-documents", name: "Legal Documents", count: 1 },
    { id: "correspondence", name: "Correspondence", count: 1 },
    { id: "financial-records", name: "Financial Records", count: 1 },
    { id: "photos", name: "Photos & Videos", count: 0 },
    { id: "other", name: "Other", count: 0 }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFile = {
        id: evidenceFiles.length + 1,
        name: files[0].name,
        type: files[0].type.split('/')[1]?.toUpperCase() || "FILE",
        size: `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        tags: ["New"],
        category: "Other",
        extractedText: "Document processing in progress..."
      };
      setEvidenceFiles([newFile, ...evidenceFiles]);
    }
  };

  const filteredFiles = evidenceFiles.filter(file => {
    const matchesCategory = selectedCategory === "all" || 
      file.category.toLowerCase().replace(" ", "-") === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "📄";
      case "image":
      case "jpg":
      case "png":
        return "🖼️";
      case "email":
      case "eml":
        return "📧";
      default:
        return "📁";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Evidence Organizer</h1>
        <p className="text-slate-600 mt-1">Manage and organize your case evidence documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload Evidence</h3>
              <div className="space-y-4">
                <label className="block">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, DOC, JPG, PNG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.eml"
                    multiple
                  />
                </label>
              </div>
            </div>

            {/* Categories */}
            <div className="border border-slate-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm bg-slate-100 px-2 py-1 rounded">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="border border-slate-200 rounded-lg shadow-sm">
            {/* Search Bar */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search evidence files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  />
                </div>
                <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  Filter
                </button>
              </div>
            </div>

            {/* Files List */}
            <div className="p-6">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">No evidence files found</p>
                  <p className="text-sm text-slate-400 mt-1">Upload your first evidence document to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedFile(file)}
                      style={{
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getFileIcon(file.type)}</span>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{file.name}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                              <span>{file.type}</span>
                              <span>{file.size}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {file.uploadDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {file.tags.map((tag: any, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Download className="h-4 w-4 text-slate-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected File Details */}
          {selectedFile && (
            <div className="border border-slate-200 rounded-lg p-6 shadow-sm mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">File Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">File Name</label>
                    <p className="text-slate-900">{selectedFile.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    <p className="text-slate-900">{selectedFile.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Size</label>
                    <p className="text-slate-900">{selectedFile.size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Upload Date</label>
                    <p className="text-slate-900">{selectedFile.uploadDate}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Tags</label>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedFile.tags.map((tag: any, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Extracted Text</label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700">{selectedFile.extractedText}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                    Edit Tags
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Download
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
