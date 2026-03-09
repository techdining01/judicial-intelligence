"use client";

import { useState } from "react";
import { fetchJudgments, fetchCauseList, fetchSupportedCourts, scrapeAllCourts, JudgmentData, CauseListItem } from "@/lib/api";

export default function ScrapingTestPage() {
  const [judgments, setJudgments] = useState<JudgmentData[]>([]);
  const [causeList, setCauseList] = useState<CauseListItem[]>([]);
  const [courts, setCourts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState("all");

  const loadCourts = async () => {
    try {
      const data = await fetchSupportedCourts();
      setCourts(data.courts);
    } catch (error) {
      console.error("Error loading courts:", error);
    }
  };

  const loadJudgments = async () => {
    setLoading(true);
    try {
      const data = await fetchJudgments(selectedCourt);
      setJudgments(data);
    } catch (error) {
      console.error("Error loading judgments:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCauseList = async () => {
    setLoading(true);
    try {
      const data = await fetchCauseList(selectedCourt);
      setCauseList(data);
    } catch (error) {
      console.error("Error loading cause list:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrapeAll = async () => {
    setLoading(true);
    try {
      const data = await scrapeAllCourts();
      console.log("Scraping results:", data);
      // Update local state with results
      if (data.judgments && data.cause_lists) {
        const allJudgments: JudgmentData[] = [];
        const allCases: CauseListItem[] = [];

        Object.values(data.judgments).forEach((courtJudgments: any) => {
          if (Array.isArray(courtJudgments)) {
            allJudgments.push(...courtJudgments);
          }
        });

        Object.values(data.cause_lists).forEach((courtCases: any) => {
          if (Array.isArray(courtCases)) {
            allCases.push(...courtCases);
          }
        });

        setJudgments(allJudgments);
        setCauseList(allCases);
      }
    } catch (error) {
      console.error("Error scraping all courts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Phase 1: Data Acquisition Testing</h1>
        <p className="text-slate-500 mt-1">
          Test judgment scraping and cause list extraction from Nigerian courts
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={selectedCourt}
            onChange={(e) => setSelectedCourt(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md"
          >
            <option value="all">All Courts</option>
            {courts.map(court => (
              <option key={court} value={court}>{court}</option>
            ))}
          </select>

          <button
            onClick={loadCourts}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Load Courts
          </button>

          <button
            onClick={loadJudgments}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load Judgments"}
          </button>

          <button
            onClick={loadCauseList}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load Cause List"}
          </button>

          <button
            onClick={scrapeAll}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Scraping..." : "Scrape All Courts"}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Judgments */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Judgments ({judgments.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {judgments.map((judgment, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-md">
                <h4 className="font-medium text-slate-800">{judgment.case_title}</h4>
                <p className="text-sm text-slate-600">{judgment.court} • {judgment.judge}</p>
                <p className="text-xs text-slate-500">{judgment.judgment_date}</p>
              </div>
            ))}
            {judgments.length === 0 && !loading && (
              <p className="text-slate-500 text-center py-4">No judgments loaded</p>
            )}
          </div>
        </div>

        {/* Cause List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Cause List ({causeList.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {causeList.map((item, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-md">
                <h4 className="font-medium text-slate-800">{item.case_number}</h4>
                <p className="text-sm text-slate-600">{item.parties}</p>
                <p className="text-xs text-slate-500">{item.court} • {item.hearing_date}</p>
              </div>
            ))}
            {causeList.length === 0 && !loading && (
              <p className="text-slate-500 text-center py-4">No cases loaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}