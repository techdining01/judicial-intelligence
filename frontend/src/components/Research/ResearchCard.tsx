/**
 * Research Card Component
 * Displays individual research article in card format
 */

'use client';

import { Calendar, User, FileText, ExternalLink, Bookmark, BookmarkCheck, Download } from 'lucide-react';
import { useState } from 'react';

interface ResearchCardProps {
  article: {
    id: string;
    title: string;
    abstract: string;
    authors: string[];
    publishDate: string;
    category: string;
    readTime: number;
    tags: string[];
    isBookmarked?: boolean;
    pdfUrl?: string;
  };
  onBookmark?: (id: string, bookmarked: boolean) => void;
  onRead?: (id: string) => void;
  onDownload?: (article: any) => void;
}

export default function ResearchCard({ article, onBookmark, onRead, onDownload }: ResearchCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    onBookmark?.(article.id, newBookmarkState);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(article);
  };

  const handleRead = () => {
    onRead?.(article.id);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Constitutional Law': 'border border-purple-200 text-purple-800',
      'Contract Law': 'border border-blue-200 text-blue-800',
      'Criminal Law': 'border border-red-200 text-red-800',
      'Family Law': 'border border-green-200 text-green-800',
      'Commercial Law': 'border border-yellow-200 text-yellow-800',
      'Property Law': 'border border-indigo-200 text-indigo-800',
      'Tort Law': 'border border-pink-200 text-pink-800',
      'Evidence': 'border border-orange-200 text-orange-800',
      'Civil Procedure': 'border border-teal-200 text-teal-800',
      'Legal Ethics': 'border border-gray-200 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div 
      className="border border-slate-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
      onClick={handleRead}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{article.authors[0]}{article.authors.length > 1 && ' et al.'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{article.publishDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleBookmark}
          className="p-2 rounded-lg border border-slate-200 transition-colors"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-5 w-5 text-blue-600 fill-current" />
          ) : (
            <Bookmark className="h-5 w-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Category and Tags */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
          {article.category}
        </span>
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-slate-500">
              #{tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="text-xs text-slate-500">
              +{article.tags.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Abstract */}
      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
        {article.abstract}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1" onClick={handleRead}>
          <ExternalLink className="h-4 w-4" />
          Read Article
        </button>
        <div className="flex gap-2">
          {article.pdfUrl && (
            <a
              href={article.pdfUrl}
              download
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              PDF
            </a>
          )}
          <button 
            onClick={handleDownload}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            title="Download article as HTML"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
