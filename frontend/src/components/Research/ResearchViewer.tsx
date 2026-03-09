/**
 * Research Viewer Component
 * Displays full research article content
 */

'use client';

import { 
  X, 
  Download, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Calendar,
  User,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';

interface ResearchViewerProps {
  article: {
    id: string;
    title: string;
    abstract: string;
    content: string;
    authors: string[];
    publishDate: string;
    category: string;
    readTime: number;
    tags: string[];
    references: string[];
    diagrams?: string[];
    pdfUrl?: string;
  };
  onClose: () => void;
  onBookmark?: (id: string, bookmarked: boolean) => void;
}

export default function ResearchViewer({ article, onClose, onBookmark }: ResearchViewerProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'references' | 'diagrams'>('content');

  const handleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    onBookmark?.(article.id, newBookmarkState);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Constitutional Law': 'bg-purple-100 text-purple-800',
      'Contract Law': 'bg-blue-100 text-blue-800',
      'Criminal Law': 'bg-red-100 text-red-800',
      'Family Law': 'bg-green-100 text-green-800',
      'Commercial Law': 'bg-yellow-100 text-yellow-800',
      'Property Law': 'bg-indigo-100 text-indigo-800',
      'Tort Law': 'bg-pink-100 text-pink-800',
      'Evidence': 'bg-orange-100 text-orange-800',
      'Civil Procedure': 'bg-teal-100 text-teal-800',
      'Legal Ethics': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 mb-3">{article.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.authors.join(', ')}</span>
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
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
                {article.tags.map((tag) => (
                  <span key={tag} className="text-sm text-slate-500">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-5 w-5 text-blue-600 fill-current" />
                ) : (
                  <Bookmark className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {article.pdfUrl && (
                <a
                  href={article.pdfUrl}
                  download
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Download className="h-5 w-5 text-slate-600" />
                </a>
              )}
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Share2 className="h-5 w-5 text-slate-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('references')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'references'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              References ({article.references.length})
            </button>
            {article.diagrams && article.diagrams.length > 0 && (
              <button
                onClick={() => setActiveTab('diagrams')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'diagrams'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-800'
                }`}
              >
                Diagrams ({article.diagrams.length})
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'content' && (
            <div className="prose prose-slate max-w-none">
              <div className="bg-slate-50 border-l-4 border-blue-500 p-4 mb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Abstract</h3>
                <p className="text-slate-700">{article.abstract}</p>
              </div>
              
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          )}

          {activeTab === 'references' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">References</h3>
              <div className="space-y-3">
                {article.references.map((reference, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-600">{index + 1}.</span>
                    <p className="text-sm text-slate-700">{reference}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'diagrams' && article.diagrams && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Diagrams & Visualizations</h3>
              {article.diagrams.map((diagram, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <img
                    src={diagram}
                    alt={`Diagram ${index + 1}`}
                    className="w-full h-auto rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
