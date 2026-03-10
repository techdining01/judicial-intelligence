"use client";

import { useState } from "react";
import { BookOpen, Play, CheckCircle, Clock, Award, TrendingUp, FileText, Users } from "lucide-react";

export default function LegalModulesPage() {
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [userProgress, setUserProgress] = useState({
    completedModules: 3,
    totalModules: 8,
    averageScore: 82,
    studyTime: 24
  });

  const modules = [
    {
      id: 1,
      title: "Contract Law Fundamentals",
      description: "Understanding the basics of contract formation, performance, and breach",
      difficulty: "Beginner",
      duration: "4 hours",
      lessons: 8,
      completedLessons: 8,
      score: 85,
      status: "completed",
      icon: "📋",
      topics: ["Offer and Acceptance", "Consideration", "Capacity", "Legality", "Performance", "Breach", "Remedies", "Statute of Frauds"]
    },
    {
      id: 2,
      title: "Civil Procedure Rules",
      description: "Master the procedural aspects of civil litigation in Nigerian courts",
      difficulty: "Intermediate",
      duration: "6 hours",
      lessons: 12,
      completedLessons: 7,
      score: 78,
      status: "in-progress",
      icon: "⚖️",
      topics: ["Jurisdiction", "Pleadings", "Service of Process", "Discovery", "Motions", "Trial Procedure", "Judgment", "Appeals", "Execution", "Injunctions", "Summary Judgment", "Class Actions"]
    },
    {
      id: 3,
      title: "Consumer Rights Protection",
      description: "Learn about consumer protection laws and remedies in Nigeria",
      difficulty: "Beginner",
      duration: "3 hours",
      lessons: 6,
      completedLessons: 0,
      score: 0,
      status: "not-started",
      icon: "🛡️",
      topics: ["Consumer Rights Act", "Product Liability", "False Advertising", "Unfair Practices", "Complaint Procedures", "Remedies"]
    },
    {
      id: 4,
      title: "Evidence Law",
      description: "Understanding rules of evidence and proof in legal proceedings",
      difficulty: "Advanced",
      duration: "8 hours",
      lessons: 15,
      completedLessons: 3,
      score: 72,
      status: "in-progress",
      icon: "🔍",
      topics: ["Relevance", "Admissibility", "Hearsay Rule", "Expert Evidence", "Documentary Evidence", "Witness Testimony", "Burden of Proof", "Presumptions", "Judicial Notice", "Character Evidence", "Privilege", "Examination", "Cross-examination", "Re-examination", "Exhibits"]
    },
    {
      id: 5,
      title: "Small Claims Procedure",
      description: "Practical guide to small claims court processes and procedures",
      difficulty: "Beginner",
      duration: "2 hours",
      lessons: 5,
      completedLessons: 0,
      score: 0,
      status: "not-started",
      icon: "⚡",
      topics: ["Small Claims Court", "Claim Limits", "Filing Procedures", "Evidence Requirements", "Hearing Process"]
    },
    {
      id: 6,
      title: "Legal Research Methods",
      description: "Effective techniques for legal research and case analysis",
      difficulty: "Intermediate",
      duration: "5 hours",
      lessons: 10,
      completedLessons: 0,
      score: 0,
      status: "not-started",
      icon: "📚",
      topics: ["Research Sources", "Case Law Research", "Statutory Research", "Legal Databases", "Citation Methods", "Research Strategy", "Note-taking", "Analysis Techniques", "Writing Briefs", "Presentation Skills"]
    },
    {
      id: 7,
      title: "Legal Ethics",
      description: "Professional responsibility and ethical standards for legal practitioners",
      difficulty: "Intermediate",
      duration: "3 hours",
      lessons: 6,
      completedLessons: 0,
      score: 0,
      status: "not-started",
      icon: "⚖️",
      topics: ["Professional Conduct", "Client Confidentiality", "Conflict of Interest", "Fee Arrangements", "Advertising Rules", "Disciplinary Proceedings"]
    },
    {
      id: 8,
      title: "Alternative Dispute Resolution",
      description: "Understanding ADR methods including mediation and arbitration",
      difficulty: "Advanced",
      duration: "4 hours",
      lessons: 8,
      completedLessons: 0,
      score: 0,
      status: "not-started",
      icon: "🤝",
      topics: ["Mediation Process", "Arbitration Proceedings", "Negotiation Skills", "Conciliation", "ADR Agreements", "Enforcement", "International ADR", "Online Dispute Resolution"]
    }
  ];

  const lessons = {
    1: [
      { id: 1, title: "Introduction to Contracts", type: "video", duration: "15 min", completed: true },
      { id: 2, title: "Elements of a Valid Contract", type: "reading", duration: "20 min", completed: true },
      { id: 3, title: "Offer and Acceptance", type: "video", duration: "18 min", completed: true },
      { id: 4, title: "Consideration Explained", type: "interactive", duration: "25 min", completed: true },
      { id: 5, title: "Capacity and Legality", type: "reading", duration: "15 min", completed: true },
      { id: 6, title: "Contract Performance", type: "video", duration: "22 min", completed: true },
      { id: 7, title: "Breach of Contract", type: "case-study", duration: "30 min", completed: true },
      { id: 8, title: "Contract Remedies", type: "quiz", duration: "20 min", completed: true }
    ],
    2: [
      { id: 1, title: "Introduction to Civil Procedure", type: "video", duration: "20 min", completed: true },
      { id: 2, title: "Understanding Jurisdiction", type: "reading", duration: "25 min", completed: true },
      { id: 3, title: "Pleadings and Motions", type: "video", duration: "30 min", completed: true },
      { id: 4, title: "Service of Process", type: "interactive", duration: "15 min", completed: true },
      { id: 5, title: "Discovery Process", type: "case-study", duration: "35 min", completed: true },
      { id: 6, title: "Pre-trial Motions", type: "video", duration: "25 min", completed: true },
      { id: 7, title: "Trial Procedure Basics", type: "reading", duration: "20 min", completed: true },
      { id: 8, title: "Judgment and Appeals", type: "video", duration: "28 min", completed: false },
      { id: 9, title: "Execution of Judgments", type: "interactive", duration: "22 min", completed: false },
      { id: 10, title: "Injunctions", type: "case-study", duration: "30 min", completed: false },
      { id: 11, title: "Summary Judgment", type: "reading", duration: "18 min", completed: false },
      { id: 12, title: "Class Actions", type: "quiz", duration: "25 min", completed: false }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return "🎥";
      case "reading":
        return "📖";
      case "interactive":
        return "🎯";
      case "case-study":
        return "⚖️";
      case "quiz":
        return "❓";
      default:
        return "📄";
    }
  };

  const handleModuleSelect = (module: any) => {
    setSelectedModule(module);
    setCurrentLesson(null);
  };

  const handleLessonSelect = (lesson: any) => {
    setCurrentLesson(lesson);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Legal Modules</h1>
        <p className="text-slate-600 mt-1">Structured legal education and training modules</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{userProgress.completedModules}/{userProgress.totalModules}</div>
            <div className="text-sm text-slate-600">Modules Completed</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{userProgress.averageScore}%</div>
            <div className="text-sm text-slate-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{userProgress.studyTime}h</div>
            <div className="text-sm text-slate-600">Study Time</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">38%</div>
            <div className="text-sm text-slate-600">Overall Progress</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Available Modules</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedModule?.id === module.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                    onClick={() => handleModuleSelect(module)}
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{module.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{module.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{module.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {module.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {module.lessons} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {module.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(module.difficulty)}`}>
                          {module.difficulty}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(module.status)}`}>
                          {module.status.replace("-", " ")}
                        </span>
                        {module.score > 0 && (
                          <div className="text-sm font-medium text-slate-900">
                            {module.score}%
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{module.completedLessons}/{module.lessons} lessons</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(module.completedLessons / module.lessons) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Module Details */}
        <div className="lg:col-span-1">
          {selectedModule ? (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">{selectedModule.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{selectedModule.description}</p>
              </div>
              
              <div className="p-6">
                {/* Module Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{selectedModule.lessons}</div>
                    <div className="text-xs text-slate-600">Total Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">{selectedModule.duration}</div>
                    <div className="text-xs text-slate-600">Duration</div>
                  </div>
                </div>

                {/* Topics Covered */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Topics Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModule.topics.map((topic: any, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lessons List */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Lessons</h4>
                  <div className="space-y-2">
                    {(lessons[selectedModule.id as keyof typeof lessons] || []).map((lesson: any) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          currentLesson?.id === lesson.id
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-slate-50"
                        }`}
                        onClick={() => handleLessonSelect(lesson)}
                        style={{
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                          textRendering: 'optimizeLegibility'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getLessonIcon(lesson.type)}</span>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{lesson.title}</div>
                            <div className="text-xs text-slate-600">{lesson.duration}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {lesson.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                          <span className="text-xs text-slate-600 capitalize">{lesson.type.replace("-", " ")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start/Continue Button */}
                <button className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                  <Play className="h-5 w-5" />
                  {selectedModule.status === "not-started" ? "Start Module" : "Continue Learning"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm text-center">
              <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Select a module to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
