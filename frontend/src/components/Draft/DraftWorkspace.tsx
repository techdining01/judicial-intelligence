/**
 * Draft Workspace Component
 * Rich text editor with diagram tools and module/research linking
 */

'use client';

import { useState, useRef } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  Link, 
  Image, 
  FileText, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Edit3
} from 'lucide-react';

interface DraftDocument {
  id: string;
  title: string;
  content: string;
  modules: string[];
  research: string[];
  diagrams: string[];
  createdAt: string;
  updatedAt: string;
}

interface ModuleReference {
  id: string;
  title: string;
  category: string;
}

interface ResearchReference {
  id: string;
  title: string;
  authors: string[];
  url: string;
}

export default function DraftWorkspace() {
  const [document, setDocument] = useState<DraftDocument>({
    id: 'draft-1',
    title: 'Untitled Document',
    content: '<p>Start writing your legal document here...</p>',
    modules: [],
    research: [],
    diagrams: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [isEditing, setIsEditing] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedModules, setSelectedModules] = useState<ModuleReference[]>([]);
  const [selectedResearch, setSelectedResearch] = useState<ResearchReference[]>([]);
  const [showModuleSelector, setShowModuleSelector] = useState(false);
  const [showResearchSelector, setShowResearchSelector] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);

  // Mock data
  const availableModules: ModuleReference[] = [
    { id: '1', title: 'Introduction to Constitutional Law', category: 'Constitutional Law' },
    { id: '2', title: 'Contract Formation Essentials', category: 'Contract Law' },
    { id: '3', title: 'Criminal Procedure Overview', category: 'Criminal Law' }
  ];

  const availableResearch: ResearchReference[] = [
    { 
      id: '1', 
      title: 'Constitutional Interpretation in Modern Nigeria', 
      authors: ['Dr. Amina Bello'],
      url: '/research/1'
    },
    { 
      id: '2', 
      title: 'Contract Formation Under Nigerian Law', 
      authors: ['Prof. Funke Akindele'],
      url: '/research/2'
    }
  ];

  const executeCommand = (command: string, value?: string) => {
    if (typeof window !== 'undefined') {
      window.document.execCommand(command, false, value);
    }
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setDocument(prev => ({
        ...prev,
        content: editorRef.current?.innerHTML || '',
        updatedAt: new Date().toISOString()
      }));
    }
  };

  const insertModuleReference = (module: ModuleReference) => {
    const moduleHtml = `<span class="module-reference" data-module-id="${module.id}" contenteditable="false">
      <a href="/modules/${module.id}" class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
        📚 ${module.title}
      </a>
    </span>`;
    
    executeCommand('insertHTML', moduleHtml);
    setSelectedModules(prev => [...prev, module]);
    setShowModuleSelector(false);
  };

  const insertResearchReference = (research: ResearchReference) => {
    const researchHtml = `<span class="research-reference" data-research-id="${research.id}" contenteditable="false">
      <a href="${research.url}" class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
        📄 ${research.title}
      </a>
    </span>`;
    
    executeCommand('insertHTML', researchHtml);
    setSelectedResearch(prev => [...prev, research]);
    setShowResearchSelector(false);
  };

  const insertDiagram = () => {
    // In a real implementation, this would open a diagram editor
    const diagramHtml = `<div class="diagram-placeholder" contenteditable="false">
      <div class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500">
        📊 Diagram Placeholder
        <p class="text-sm mt-2">Click to add diagram</p>
      </div>
    </div>`;
    
    executeCommand('insertHTML', diagramHtml);
  };

  const saveDocument = () => {
    // In a real implementation, this would save to backend
    console.log('Saving document:', document);
    alert('Document saved successfully!');
  };

  const exportDocument = (format: 'docx' | 'pdf' | 'html') => {
    // In a real implementation, this would export in the specified format
    const content = format === 'html' ? document.content : document.content.replace(/<[^>]*>/g, '');
    const blob = new Blob([content], { 
      type: format === 'html' ? 'text/html' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={document.title}
              onChange={(e) => setDocument(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-semibold text-slate-900 bg-transparent border-none outline-none w-full"
              placeholder="Document title"
            />
            <p className="text-sm text-slate-600">
              Last updated: {new Date(document.updatedAt).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                showPreview 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {showPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            
            <button
              onClick={saveDocument}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            
            <div className="relative">
              <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {!showPreview && (
        <div className="border-b border-slate-200 p-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
              <button
                onClick={() => executeCommand('bold')}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => executeCommand('italic')}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => executeCommand('underline')}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Underline"
              >
                <Underline className="h-4 w-4" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
              <button
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => executeCommand('insertOrderedList')}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
              <button
                onClick={() => executeCommand('justifyLeft')}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => executeCommand('justifyCenter')}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                onClick={() => executeCommand('justifyRight')}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </button>
            </div>

            {/* Insert Tools */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowModuleSelector(true)}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Insert Module Reference"
              >
                <FileText className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowResearchSelector(true)}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Insert Research Reference"
              >
                <Link className="h-4 w-4" />
              </button>
              <button
                onClick={insertDiagram}
                className="p-2 rounded hover:bg-slate-100 transition-colors"
                title="Insert Diagram"
              >
                <Image className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor/Preview */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Editor */}
        {!showPreview && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            className="absolute inset-0 p-6 overflow-y-auto focus:outline-none"
            style={{ minHeight: '600px' }}
            dangerouslySetInnerHTML={{ __html: document.content }}
          />
        )}

        {/* Preview */}
        {showPreview && (
          <div className="absolute inset-0 p-6 overflow-y-auto">
            <div className="prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: document.content }} />
            </div>
          </div>
        )}

        {/* Module Selector Modal */}
        {showModuleSelector && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[400px] overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Select Module to Reference</h3>
              </div>
              <div className="p-4 overflow-y-auto max-h-[300px]">
                <div className="space-y-2">
                  {availableModules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => insertModuleReference(module)}
                      className="w-full text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <h4 className="font-medium text-slate-900">{module.title}</h4>
                      <p className="text-sm text-slate-600">{module.category}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-slate-200">
                <button
                  onClick={() => setShowModuleSelector(false)}
                  className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Research Selector Modal */}
        {showResearchSelector && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[400px] overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Select Research to Reference</h3>
              </div>
              <div className="p-4 overflow-y-auto max-h-[300px]">
                <div className="space-y-2">
                  {availableResearch.map((research) => (
                    <button
                      key={research.id}
                      onClick={() => insertResearchReference(research)}
                      className="w-full text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <h4 className="font-medium text-slate-900">{research.title}</h4>
                      <p className="text-sm text-slate-600">{research.authors.join(', ')}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-slate-200">
                <button
                  onClick={() => setShowResearchSelector(false)}
                  className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t border-slate-200 p-2 bg-slate-50">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span>Words: {document.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}</span>
            <span>Characters: {document.content.replace(/<[^>]*>/g, '').length}</span>
            <span>Modules: {selectedModules.length}</span>
            <span>Research: {selectedResearch.length}</span>
          </div>
          <div>
            <span>Auto-saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
