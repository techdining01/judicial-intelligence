"use client";

import { useState } from 'react';
import { Search, Filter, BookOpen, Scale, Eye } from 'lucide-react';

interface Statute {
  id: string;
  title: string;
  jurisdiction: string;
  category: string;
  content: string;
  section: string;
  relevanceScore: number;
  lastUpdated: string;
}

interface StatuteSearchProps {
  onStatuteSelect?: (statute: Statute) => void;
}

export default function StatuteSearch({ onStatuteSelect }: StatuteSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [jurisdiction, setJurisdiction] = useState('All');
  const [category, setCategory] = useState('All');
  const [statutes, setStatutes] = useState<Statute[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatute, setSelectedStatute] = useState<Statute | null>(null);

  const jurisdictions = ['All', 'Federal', 'State', 'Local'];
  const categories = ['All', 'Constitutional', 'Criminal', 'Civil', 'Commercial', 'Family', 'Property'];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Mock API call - replace with real endpoint
      const response = await fetch('/api/legal-research/statutes/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          jurisdiction: jurisdiction === 'All' ? undefined : jurisdiction,
          category: category === 'All' ? undefined : category
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatutes(data.statutes || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Statute & Regulation Search</h2>
        <p className="text-slate-600 mt-1">Search legal statutes and regulations by jurisdiction, keyword, or legal topic</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search statutes, regulations, or legal topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-5 w-5 text-slate-600" />
              <label className="text-sm font-medium text-slate-700">Jurisdiction</label>
            </div>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              {jurisdictions.map(jur => (
                <option key={jur} value={jur}>{jur}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-slate-600" />
              <label className="text-sm font-medium text-slate-700">Category</label>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed font-medium"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              {loading ? 'Searching...' : 'Search Statutes'}
            </button>
          </div>
        </div>

        {statutes.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-slate-700 font-medium">
                Found {statutes.length} statute{statutes.length === 1 ? '' : 's'}
              </p>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-slate-500" />
                <select
                  value="relevance"
                  className="px-2 py-1 border border-slate-200 rounded text-sm text-slate-700 bg-white"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="recent">Most Recent</option>
                  <option value="cited">Most Cited</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-slate-500">Searching statutes...</p>
            </div>
          )}

          {!loading && statutes.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-slate-500">No statutes found for "{searchQuery}"</p>
              <p className="text-sm text-slate-400 mt-2">Try adjusting your search terms or filters</p>
            </div>
          )}

          {statutes.map((statute) => (
            <div
              key={statute.id}
              className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedStatute(statute);
                onStatuteSelect?.(statute);
              }}
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{statute.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{statute.jurisdiction}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{statute.category}</span>
                    <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded">Section {statute.section}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStatute(statute);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="text-slate-700 mb-4">
                <p className="line-clamp-3">
                  {statute.content.substring(0, 300)}
                  {statute.content.length > 300 && '...'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Relevance Score:</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${statute.relevanceScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-700 ml-2">
                      {statute.relevanceScore}%
                    </span>
                  </div>
                </div>
                <span className="text-sm text-slate-500">
                  Updated: {new Date(statute.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal temporarily commented out for build */}
      {/* {selectedStatute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">{selectedStatute.title}</h3>
                <button
                  onClick={() => setSelectedStatute(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{selectedStatute.jurisdiction}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{selectedStatute.category}</span>
                  <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded">Section {selectedStatute.section}</span>
                </div>

                <div className="prose max-w-none">
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedStatute.content}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-sm text-slate-500">
                    Last Updated: {new Date(selectedStatute.lastUpdated).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedStatute.content);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      style={{
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility'
                      }}
                    >
                      Copy Text
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([selectedStatute.content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedStatute.title}.txt`;
                        a.click();
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      style={{
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility'
                      }}
                    >
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      )} */}
    </div>
  );
} 
