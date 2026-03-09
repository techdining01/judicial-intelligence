/**
 * Module Viewer Component
 * Displays full module content with interactive elements
 */

'use client';

import { useState } from 'react';
import { ArrowLeft, Play, Pause, Volume2, CheckCircle, Circle, BookOpen, Target, Award, Download } from 'lucide-react';

interface ModuleViewerProps {
  module: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    duration: number;
    content: {
      sections: Array<{
        title: string;
        content: string;
        type: 'text' | 'video' | 'interactive' | 'example';
        duration?: number;
        completed?: boolean;
      }>;
    };
    quiz: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
    relatedModules: string[];
  };
  onClose: () => void;
  onComplete?: (id: string) => void;
  onProgress?: (id: string, progress: number) => void;
}

export default function ModuleViewer({ module, onClose, onComplete, onProgress }: ModuleViewerProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const handleSectionComplete = (sectionIndex: number) => {
    setSectionProgress(prev => ({ ...prev, [sectionIndex]: true }));
    
    // Calculate overall progress
    const completedSections = Object.keys(sectionProgress).length + 1;
    const totalSections = module.content.sections.length;
    const progress = Math.round((completedSections / totalSections) * 100);
    
    onProgress?.(module.id, progress);
    
    // Auto-advance to next section
    if (sectionIndex < module.content.sections.length - 1) {
      setCurrentSection(sectionIndex + 1);
    }
  };

  const handleQuizSubmit = () => {
    setShowQuizResults(true);
    const allCorrect = module.quiz.every((q, index) => quizAnswers[index] === q.correctAnswer);
    if (allCorrect) {
      onComplete?.(module.id);
    }
  };

  const calculateQuizScore = () => {
    const correct = module.quiz.filter((q, index) => quizAnswers[index] === q.correctAnswer).length;
    return Math.round((correct / module.quiz.length) * 100);
  };

  const currentSectionData = module.content.sections[currentSection];
  const isLastSection = currentSection === module.content.sections.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{module.title}</h1>
                <p className="text-slate-600">{module.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {module.category}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">
                {module.difficulty}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>Section {currentSection + 1} of {module.content.sections.length}</span>
              <span>{Math.round(((currentSection + 1) / module.content.sections.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSection + 1) / module.content.sections.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {module.content.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  index === currentSection
                    ? 'bg-blue-600 text-white'
                    : sectionProgress[index]
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sectionProgress[index] ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentSectionData.type === 'text' && (
            <div className="prose prose-slate max-w-none">
              <h2>{currentSectionData.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: currentSectionData.content }} />
            </div>
          )}

          {currentSectionData.type === 'video' && (
            <div className="space-y-4">
              <h2>{currentSectionData.title}</h2>
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                <div className="text-white text-center">
                  <Play className="h-16 w-16 mx-auto mb-4" />
                  <p>Video Player Placeholder</p>
                  <p className="text-sm opacity-75">{currentSectionData.duration} minutes</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Transcript</h3>
                <p className="text-sm text-slate-600">{currentSectionData.content}</p>
              </div>
            </div>
          )}

          {currentSectionData.type === 'interactive' && (
            <div className="space-y-4">
              <h2>{currentSectionData.title}</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Interactive Exercise
                </h3>
                <div dangerouslySetInnerHTML={{ __html: currentSectionData.content }} />
              </div>
            </div>
          )}

          {currentSectionData.type === 'example' && (
            <div className="space-y-4">
              <h2>{currentSectionData.title}</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Practical Example
                </h3>
                <div dangerouslySetInnerHTML={{ __html: currentSectionData.content }} />
              </div>
            </div>
          )}

          {/* Quiz Section */}
          {isLastSection && module.quiz.length > 0 && (
            <div className="mt-8 space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Module Quiz
                </h3>
                {module.quiz.map((question, qIndex) => (
                  <div key={qIndex} className="mb-6">
                    <p className="font-medium mb-3">{qIndex + 1}. {question.question}</p>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <label key={oIndex} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={oIndex}
                            onChange={() => setQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                            className="text-blue-600"
                          />
                          <span>{option}</span>
                          {showQuizResults && oIndex === question.correctAnswer && (
                            <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                          )}
                          {showQuizResults && quizAnswers[qIndex] === oIndex && oIndex !== question.correctAnswer && (
                            <Circle className="h-5 w-5 text-red-600 ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                    {showQuizResults && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                        {question.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!showQuizResults ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length !== module.quiz.length}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              ) : (
                <div className="bg-slate-50 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Quiz Results</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">{calculateQuizScore()}%</p>
                  <p className="text-slate-600 mb-4">
                    {calculateQuizScore() >= 80 ? 'Excellent work!' : 'Keep practicing!'}
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Complete Module
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isLastSection && (
          <div className="border-t border-slate-200 p-6">
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handleSectionComplete(currentSection)}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {sectionProgress[currentSection] ? 'Next Section' : 'Mark Complete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
