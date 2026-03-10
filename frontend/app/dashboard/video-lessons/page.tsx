/**
 * Video Lessons Page
 * Main page for browsing and watching video lessons
 */

'use client';

import { useState } from 'react';
import DashboardLayout from '@/src/components/Dashboard/DashboardLayout';
import VideoPlayer from '@/src/components/Video/VideoPlayer';
import { Play, Clock, BookOpen, Filter, Search } from 'lucide-react';

// Mock data
const mockLessons = [
  {
    id: '1',
    title: 'Introduction to Nigerian Legal System',
    description: 'Comprehensive overview of the Nigerian legal system, its structure, and hierarchy.',
    thumbnail: '/images/legal-system-thumb.jpg',
    duration: 1200,
    category: 'Legal System',
    difficulty: 'Beginner',
    instructor: 'Prof. James Okoro',
    rating: 4.7,
    views: 15420,
    transcript: 'Welcome to this comprehensive introduction to the Nigerian legal system...',
    relatedModules: ['Introduction to Constitutional Law']
  }
];

const categories = ['All', 'Legal System', 'Contract Law', 'Criminal Law'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function VideoLessonsPage() {
  const [lessons, setLessons] = useState(mockLessons);
  const [selectedLesson, setSelectedLesson] = useState<typeof mockLessons[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLessonSelect = (lesson: typeof mockLessons[0]) => {
    setSelectedLesson(lesson);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Video Lessons</h1>
          <p className="text-slate-600">Learn from expert instructors through comprehensive video lessons</p>
        </div>

        {/* Filters */}
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lessons, instructors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Filter className="h-5 w-5 text-slate-600 mt-2.5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Lesson Player */}
        {selectedLesson ? (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedLesson(null)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to lessons
            </button>
            <VideoPlayer
              videoUrl={selectedLesson.thumbnail}
              title={selectedLesson.title}
              duration={selectedLesson.duration}
              transcript={selectedLesson.transcript}
            />
          </div>
        ) : (
          <>
            {/* Lessons Grid */}
            {filteredLessons.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <div className="relative aspect-video bg-slate-200">
                      <img
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-slate-100/90 rounded-full flex items-center justify-center">
                          <Play className="h-8 w-8 text-slate-900 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                        {formatDuration(lesson.duration)}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-2">{lesson.title}</h3>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{lesson.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                        <span className="px-2 py-1 bg-slate-100 rounded">{lesson.category}</span>
                        <span>{lesson.views.toLocaleString()} views</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-700">Instructor: {lesson.instructor}</p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Watch Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Play className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No lessons found</h3>
                <p className="text-slate-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
