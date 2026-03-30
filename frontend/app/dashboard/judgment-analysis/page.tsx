"use client";

import { BarChart3, Search, FileText, TrendingUp } from "lucide-react";

export default function JudgmentAnalysisPage() {
  const analysisModules = [
    {
      id: 1,
      title: "Judgment Summarization",
      description: "Quickly summarize long judgments into key legal points",
      icon: FileText,
      status: "Available"
    },
    {
      id: 2,
      title: "Precedent Search",
      description: "Find related judgments and cases across different jurisdictions",
      icon: Search,
      status: "Available"
    },
    {
      id: 3,
      title: "Legal Trends Analysis",
      description: "Analyze judicial decision trends for better legal strategy",
      icon: TrendingUp,
      status: "In Progress"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Judgment Analysis Training</h1>
        <p className="text-slate-600">Enhance your judgment analysis and legal research skills with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analysisModules.map((module) => (
          <div key={module.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <module.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{module.title}</h3>
            <p className="text-slate-600 text-sm mb-4">{module.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xs px-2 py-1 rounded-full ${
                module.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {module.status}
              </span>
              <button 
                className={`text-sm font-medium ${module.status === 'Available' ? 'text-blue-600 hover:text-blue-700' : 'text-slate-400 cursor-not-allowed'}`}
                disabled={module.status !== 'Available'}
              >
                Start Training →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl p-8 text-white">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold mb-4">AI Judgment Search Engine</h2>
          <p className="text-slate-300 mb-6">
            Our AI-powered judgment search engine is currently being integrated. 
            Soon you'll be able to perform advanced legal research and analyze judicial decisions in real-time.
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors">
              Notify Me
            </button>
            <button className="border border-slate-700 hover:bg-slate-800 px-6 py-2 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
