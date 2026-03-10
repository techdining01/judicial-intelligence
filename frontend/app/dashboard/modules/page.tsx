/**
 * Learning Modules Page
 * Main page for browsing and accessing learning modules
 */

'use client';

import { useState } from 'react';
import DashboardLayout from '@/src/components/Dashboard/DashboardLayout';
import ModuleCard from '@/src/components/Modules/ModuleCard';
import ModuleViewer from '@/src/components/Modules/ModuleViewer';
import { Filter, Search, Grid, List } from 'lucide-react';

// Mock data
const mockModules = [
  {
    id: '1',
    title: 'Introduction to Constitutional Law',
    description: 'Learn the fundamental principles of constitutional law, including the structure of government.',
    category: 'Constitutional Law',
    difficulty: 'Beginner' as const,
    duration: 45,
    progress: 75,
    isCompleted: false,
    isSaved: true,
    rating: 4.5,
    concepts: ['Constitution', 'Separation of Powers', 'Fundamental Rights'],
    examples: ['Analysis of landmark cases', 'Interactive flowchart'],
    miniQuiz: true,
    relatedModules: ['Advanced Constitutional Law'],
    content: {
      sections: [
        {
          title: 'What is Constitutional Law?',
          content: '<p>Constitutional law forms the foundation of any democratic system...</p>',
          type: 'text' as const,
          duration: 10
        }
      ]
    },
    quiz: [
      {
        question: 'What is the primary purpose of constitutional law?',
        options: ['Regulate business', 'Establish government framework', 'Handle criminal cases', 'Manage international relations'],
        correctAnswer: 1,
        explanation: 'Constitutional law establishes the basic framework of government.'
      }
    ]
  }
];

const categories = ['All', 'Constitutional Law', 'Contract Law', 'Criminal Law'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ModulesPage() {
  const [modules, setModules] = useState(mockModules);
  const [selectedModule, setSelectedModule] = useState<typeof mockModules[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || module.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleModuleStart = (id: string) => {
    const module = modules.find(m => m.id === id);
    if (module) {
      setSelectedModule(module);
    }
  };

  const handleModuleSave = (id: string, saved: boolean) => {
    setModules(prev => prev.map(module =>
      module.id === id ? { ...module, isSaved: saved } : module
    ));
  };

  const handleModuleComplete = (id: string) => {
    setModules(prev => prev.map(module =>
      module.id === id ? { ...module, isCompleted: true, progress: 100 } : module
    ));
    setSelectedModule(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Learning Modules</h1>
          <p className="text-slate-600">Master legal concepts through interactive learning modules</p>
        </div>

        {/* Filters */}
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Filter className="h-5 w-5 text-slate-600 mt-2.5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-slate-600">
            {filteredModules.length} {filteredModules.length === 1 ? 'module' : 'modules'} found
          </p>
        </div>

        {/* Modules Grid */}
        {filteredModules.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
            {filteredModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onStart={handleModuleStart}
                onSave={handleModuleSave}
                onComplete={handleModuleComplete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No modules found</h3>
            <p className="text-slate-600">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Module Viewer Modal */}
        {selectedModule && (
          <ModuleViewer
            module={selectedModule}
            onClose={() => setSelectedModule(null)}
            onComplete={handleModuleComplete}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
