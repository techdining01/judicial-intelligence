"use client";

import { Users, Lightbulb, MessageSquare, Target } from "lucide-react";

export default function ArgumentConstructionPage() {
  const learningSteps = [
    {
      id: 1,
      title: "Issue Identification",
      description: "Learn to identify the core legal issues from case facts",
      icon: Lightbulb,
      status: "Available"
    },
    {
      id: 2,
      title: "Legal Framework",
      description: "Building arguments based on relevant statutes and precedents",
      icon: Target,
      status: "Available"
    },
    {
      id: 3,
      title: "Argument Structure",
      description: "Structuring your written and oral arguments effectively",
      icon: MessageSquare,
      status: "In Progress"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Argument Construction Training</h1>
        <p className="text-slate-600">Master the art of building persuasive legal arguments with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {learningSteps.map((step) => (
          <div key={step.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <step.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
            <p className="text-slate-600 text-sm mb-4">{step.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xs px-2 py-1 rounded-full ${
                step.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {step.status}
              </span>
              <button 
                className={`text-sm font-medium ${step.status === 'Available' ? 'text-blue-600 hover:text-blue-700' : 'text-slate-400 cursor-not-allowed'}`}
                disabled={step.status !== 'Available'}
              >
                Start Training →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl p-8 text-white">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold mb-4">AI Argument Builder</h2>
          <p className="text-slate-300 mb-6">
            Our AI-powered argument builder is currently being integrated. 
            Soon you'll be able to input your case facts and receive a structured legal argument with relevant precedents.
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
