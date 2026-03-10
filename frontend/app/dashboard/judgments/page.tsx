"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

interface JudgmentItem {
  id: string;
  case_title: string;
  suit_number: string;
  court: string;
  judgment_date: string;
  summary?: string;
  is_final: boolean;
  document_url?: string;
  source: string;
  scraped_at?: string;
}

export default function JudgmentsPage() {
  const [judgments, setJudgments] = useState<JudgmentItem[]>([]);
  const [filteredJudgments, setFilteredJudgments] = useState<JudgmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const judgmentsPerPage = 10;

  useEffect(() => {
    // Call real-time Django endpoint
    const token = localStorage.getItem('access');
    fetch('http://127.0.0.1:8001/api/courts/realtime-judgments/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setJudgments(data);
        setFilteredJudgments(data);
        setTotalPages(Math.ceil(data.length / judgmentsPerPage));
      })
      .catch(() => setError("Failed to load judgments"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!Array.isArray(judgments)) return;
    
    const filtered = judgments.filter(judgment => 
      judgment.case_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      judgment.suit_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      judgment.court.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJudgments(filtered);
    setTotalPages(Math.ceil(filtered.length / judgmentsPerPage));
    setCurrentPage(1); // Reset to first page when searching
  }, [searchQuery, judgments]);

  const paginatedJudgments = Array.isArray(filteredJudgments) ? filteredJudgments.slice(
    (currentPage - 1) * judgmentsPerPage,
    currentPage * judgmentsPerPage
  ) : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading judgments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Judgments</h1>
        <p className="text-slate-500 mt-1">
          Search and browse court judgments. AI summarization and precedent search.
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="border border-slate-200 rounded-lg p-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case title, suit number, or court..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
            style={{ 
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-slate-600">
            Found {filteredJudgments.length} result{filteredJudgments.length !== 1 ? 's' : ''} for "{searchQuery}"
          </div>
        )}
      </div>
      
      {filteredJudgments.length === 0 && !loading ? (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 text-center text-slate-600">
          {searchQuery ? (
            <>
              <p className="text-lg font-medium mb-2">No judgments found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium mb-2">No judgments available yet</p>
              <p className="text-sm">Run scraping to populate judgments</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {paginatedJudgments.map((judgment) => (
              <div key={judgment.id} className="rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800 truncate">
                    {judgment.case_title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    judgment.is_final 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {judgment.is_final ? 'Final' : 'Reserved'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-slate-600 mb-3">
                  <div><strong>Suit Number:</strong> {judgment.suit_number}</div>
                  <div><strong>Court:</strong> {judgment.court}</div>
                  <div><strong>Date:</strong> {new Date(judgment.judgment_date).toLocaleDateString()}</div>
                  <div><strong>Source:</strong> {judgment.source}</div>
                </div>
                
                {judgment.summary && (
                  <p className="text-slate-600 text-sm mb-3 line-clamp-3">
                    {judgment.summary}
                  </p>
                )}
                
                {judgment.document_url && (
                  <a
                    href={judgment.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700"
                  >
                    View Document
                  </a>
                )}
              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-slate-300 text-sm text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                style={{ 
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
                    }`}
                    style={{ 
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-slate-300 text-sm text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                style={{ 
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
