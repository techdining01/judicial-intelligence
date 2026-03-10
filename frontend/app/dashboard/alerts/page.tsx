"use client";

import { useEffect, useState } from "react";
import AlertCard from "@/components/AlertCard";

interface AlertItem {
  id: string;
  title: string;
  content: string;
  sent_at: string;
  delivered: boolean;
  source: string;
  priority?: string;
}

function AlertDateTime({ sentAt }: { sentAt: string }) {
  const [dateTime, setDateTime] = useState('');
  
  useEffect(() => {
    setDateTime(new Date(sentAt).toLocaleString());
  }, [sentAt]);
  
  return <span className="text-xs text-slate-500">{dateTime}</span>;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const alertsPerPage = 10;

  useEffect(() => {
    // Call real-time Django endpoint
    const token = localStorage.getItem('access');
    fetch('http://127.0.0.1:8001/api/courts/realtime-alerts/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setFilteredAlerts(data);
        setTotalPages(Math.ceil(data.length / alertsPerPage));
      })
      .catch(() => setError("Failed to load alerts"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!Array.isArray(alerts)) return;
    
    const filtered = alerts.filter(alert => 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAlerts(filtered);
    setTotalPages(Math.ceil(filtered.length / alertsPerPage));
    setCurrentPage(1); // Reset to first page when searching
  }, [searchQuery, alerts]);

  const paginatedAlerts = Array.isArray(filteredAlerts) ? filteredAlerts.slice(
    (currentPage - 1) * alertsPerPage,
    currentPage * alertsPerPage
  ) : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Loading alerts...</p>
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
        <h1 className="text-2xl font-semibold text-slate-800">Morning Alerts</h1>
        <p className="text-slate-500 mt-1">Court cause lists and hearing notifications</p>
      </div>
      
      {/* Search Bar */}
      <div className="border border-slate-200 rounded-lg p-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by title, content, or source..."
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
            Found {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} for "{searchQuery}"
          </div>
        )}
      </div>
      
      {filteredAlerts.length === 0 && !loading ? (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 text-center text-slate-600">
          {searchQuery ? (
            <>
              <p className="text-lg font-medium mb-2">No alerts found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium mb-2">No alerts yet</p>
              <p className="text-sm">Run scraping to populate alerts</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {paginatedAlerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800 truncate pr-2">
                    {alert.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alert.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : alert.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.priority?.toUpperCase() || 'NORMAL'}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 mb-3">{alert.content}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Source: {alert.source}</span>
                  <AlertDateTime sentAt={alert.sent_at} />
                </div>
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
