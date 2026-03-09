/**
 * Concept Builder Component
 * Drag-and-drop interface for building legal systems and concepts
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { Blocks, Play, RotateCcw, Download, Save, Trash2, Plus } from 'lucide-react';

interface Block {
  id: string;
  type: 'input' | 'process' | 'decision' | 'output' | 'data';
  label: string;
  description: string;
  position: { x: number; y: number };
  inputs: string[];
  outputs: string[];
  config?: Record<string, any>;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromPort: string;
  toPort: string;
}

interface BlockTemplate {
  type: Block['type'];
  label: string;
  description: string;
  icon: string;
  color: string;
  defaultConfig?: Record<string, any>;
}

const blockTemplates: BlockTemplate[] = [
  {
    type: 'input',
    label: 'Legal Input',
    description: 'Entry point for legal data or documents',
    icon: '📄',
    color: 'bg-blue-100 border-blue-300',
    defaultConfig: { inputType: 'document', required: true }
  },
  {
    type: 'process',
    label: 'Legal Process',
    description: 'Process or transform legal information',
    icon: '⚙️',
    color: 'bg-green-100 border-green-300',
    defaultConfig: { processType: 'analysis', duration: 0 }
  },
  {
    type: 'decision',
    label: 'Legal Decision',
    description: 'Decision point with multiple outcomes',
    icon: '🔀',
    color: 'bg-yellow-100 border-yellow-300',
    defaultConfig: { criteria: [], outcomes: [] }
  },
  {
    type: 'output',
    label: 'Legal Output',
    description: 'Generate legal documents or results',
    icon: '📋',
    color: 'bg-purple-100 border-purple-300',
    defaultConfig: { outputType: 'document', format: 'pdf' }
  },
  {
    type: 'data',
    label: 'Legal Data',
    description: 'Store or reference legal data',
    icon: '💾',
    color: 'bg-orange-100 border-orange-300',
    defaultConfig: { dataType: 'case', searchable: true }
  }
];

export default function ConceptBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{blockId: string; port: string} | null>(null);
  const [canvasScale, setCanvasScale] = useState(1);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  const addBlock = (template: BlockTemplate, position: { x: number; y: number }) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: template.type,
      label: template.label,
      description: template.description,
      position,
      inputs: template.type === 'output' ? [] : ['input'],
      outputs: template.type === 'input' ? [] : ['output'],
      config: template.defaultConfig || {}
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlock(newBlock);
  };

  const deleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    setConnections(prev => prev.filter(c => c.from !== blockId && c.to !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addConnection = (from: string, to: string, fromPort: string, toPort: string) => {
    // Check if connection already exists
    const exists = connections.some(c => 
      c.from === from && c.to === to && c.fromPort === fromPort && c.toPort === toPort
    );
    
    if (!exists) {
      const newConnection: Connection = {
        id: `connection-${Date.now()}`,
        from,
        to,
        fromPort,
        toPort
      };
      setConnections(prev => [...prev, newConnection]);
    }
  };

  const deleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  };

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - canvasOffset.x) / canvasScale;
    const y = (e.clientY - rect.top - canvasOffset.y) / canvasScale;

    const templateData = e.dataTransfer.getData('application/json');
    if (templateData) {
      try {
        const template = JSON.parse(templateData) as BlockTemplate;
        addBlock(template, { x, y });
      } catch (error) {
        console.error('Invalid template data:', error);
      }
    }
  }, [canvasScale, canvasOffset]);

  const handleBlockDragStart = (e: React.DragEvent, block: Block) => {
    setDraggedBlock(block);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBlockDragEnd = () => {
    setIsDragging(false);
    setDraggedBlock(null);
  };

  const handlePortClick = (blockId: string, port: string, isOutput: boolean) => {
    if (!isConnecting) {
      // Start connection
      setConnectionStart({ blockId, port });
      setIsConnecting(true);
    } else {
      // Complete connection
      if (connectionStart && connectionStart.blockId !== blockId) {
        if (isOutput) {
          // connectionStart -> this block
          addConnection(connectionStart.blockId, blockId, connectionStart.port, port);
        } else {
          // this block -> connectionStart
          addConnection(blockId, connectionStart.blockId, port, connectionStart.port);
        }
      }
      // Reset connection state
      setConnectionStart(null);
      setIsConnecting(false);
    }
  };

  const runSimulation = () => {
    // Simulate running the legal system
    console.log('Running simulation with blocks:', blocks);
    console.log('Connections:', connections);
    
    // In a real implementation, this would:
    // 1. Validate the system structure
    // 2. Execute the legal processes
    // 3. Generate results and visualizations
  };

  const resetCanvas = () => {
    setBlocks([]);
    setConnections([]);
    setSelectedBlock(null);
    setConnectionStart(null);
    setIsConnecting(false);
  };

  const exportSystem = () => {
    const systemData = {
      blocks,
      connections,
      metadata: {
        name: 'Legal System',
        version: '1.0',
        created: new Date().toISOString()
      }
    };
    
    const blob = new Blob([JSON.stringify(systemData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legal-system.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Blocks className="h-5 w-5" />
              Concept Builder
            </h2>
            <p className="text-sm text-slate-600">Build legal systems with drag-and-drop blocks</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runSimulation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Run Simulation
            </button>
            <button
              onClick={resetCanvas}
              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={exportSystem}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* Block Palette */}
        <div className="w-64 border-r border-slate-200 p-4 space-y-4">
          <h3 className="font-medium text-slate-900">Block Palette</h3>
          <div className="space-y-2">
            {blockTemplates.map((template) => (
              <div
                key={template.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify(template));
                }}
                className={`p-3 border rounded-lg cursor-move hover:shadow-md transition-shadow ${template.color}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{template.icon}</span>
                  <div>
                    <h4 className="font-medium text-sm">{template.label}</h4>
                    <p className="text-xs text-slate-600">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <div
            ref={canvasRef}
            className="absolute inset-0 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg m-4"
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
              backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            {/* Render Blocks */}
            {blocks.map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleBlockDragStart(e, block)}
                onDragEnd={handleBlockDragEnd}
                onClick={() => setSelectedBlock(block)}
                className={`absolute p-3 border rounded-lg cursor-move min-w-[120px] ${
                  selectedBlock?.id === block.id ? 'ring-2 ring-blue-500' : ''
                } ${
                  blockTemplates.find(t => t.type === block.type)?.color || 'bg-gray-100'
                }`}
                style={{
                  left: block.position.x,
                  top: block.position.y,
                  transform: `scale(${canvasScale})`,
                  transformOrigin: 'top left'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{block.label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlock(block.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </button>
                </div>
                
                {/* Ports */}
                <div className="flex justify-between">
                  {block.inputs.map((port) => (
                    <div
                      key={port}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePortClick(block.id, port, false);
                      }}
                      className={`w-3 h-3 bg-white border-2 rounded-full cursor-pointer ${
                        connectionStart?.blockId === block.id && connectionStart?.port === port
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-400 hover:border-blue-500'
                      }`}
                      style={{ marginLeft: '-6px' }}
                    />
                  ))}
                  {block.outputs.map((port) => (
                    <div
                      key={port}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePortClick(block.id, port, true);
                      }}
                      className={`w-3 h-3 bg-white border-2 rounded-full cursor-pointer ${
                        connectionStart?.blockId === block.id && connectionStart?.port === port
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-400 hover:border-blue-500'
                      }`}
                      style={{ marginRight: '-6px' }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {blocks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Blocks className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">Start Building</h3>
                  <p className="text-sm text-slate-500">Drag blocks from the palette to create your legal system</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 border-l border-slate-200 p-4">
          <h3 className="font-medium text-slate-900 mb-4">Properties</h3>
          
          {selectedBlock ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
                <input
                  type="text"
                  value={selectedBlock.label}
                  onChange={(e) => updateBlock(selectedBlock.id, { label: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={selectedBlock.description}
                  onChange={(e) => updateBlock(selectedBlock.id, { description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <div className="px-3 py-2 bg-slate-100 rounded-lg text-sm">
                  {selectedBlock.type}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={Math.round(selectedBlock.position.x)}
                    onChange={(e) => updateBlock(selectedBlock.id, { 
                      position: { ...selectedBlock.position, x: parseFloat(e.target.value) }
                    })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="X"
                  />
                  <input
                    type="number"
                    value={Math.round(selectedBlock.position.y)}
                    onChange={(e) => updateBlock(selectedBlock.id, { 
                      position: { ...selectedBlock.position, y: parseFloat(e.target.value) }
                    })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Y"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">Select a block to view its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
