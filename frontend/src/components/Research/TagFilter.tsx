/**
 * Tag Filter Component
 * Displays and manages topic tags for filtering
 */

'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export default function TagFilter({ availableTags, selectedTags, onTagToggle, onClearAll }: TagFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering dynamic content after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const displayTags = showAll ? availableTags : availableTags.slice(0, 8);

  const getTagCount = (tag: string) => {
    // Deterministic tag counts - no random values to avoid hydration mismatch
    const counts: Record<string, number> = {
      'constitutional': 45,
      'contracts': 38,
      'criminal': 32,
      'family': 28,
      'commercial': 25,
      'property': 22,
      'torts': 20,
      'evidence': 18,
      'procedure': 15,
      'ethics': 12,
      'international': 10,
      'human-rights': 8,
      'corporate': 7,
      'tax': 6,
      'environmental': 5
    };
    return counts[tag] || 5; // Default to 5 instead of random
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-slate-900">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">Selected:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => onTagToggle(tag)}
                  className="hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Available Tags */}
      <div className="space-y-2">
        <p className="text-sm text-slate-600">Available tags:</p>
        <div className="flex flex-wrap gap-2">
          {isMounted ? displayTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            const count = getTagCount(tag);
            
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tag}
                <span className={`text-xs ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  ({count})
                </span>
              </button>
            );
          }) : availableTags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700"
            >
              {tag}
              <span className="text-xs text-slate-500">
                (Loading...)
              </span>
            </button>
          ))}
        </div>
        
        {/* Show More/Less Button */}
        {isMounted && availableTags.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
          >
            {showAll ? 'Show less' : `Show ${availableTags.length - 8} more`}
          </button>
        )}
      </div>
    </div>
  );
}
