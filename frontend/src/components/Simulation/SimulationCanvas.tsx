/**
 * Simulation Canvas Component
 * Interactive canvas for legal simulations with variable controls and graph outputs
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Download, Settings, Maximize2 } from 'lucide-react';

interface SimulationProps {
  title: string;
  description: string;
  variables: Array<{
    id: string;
    name: string;
    min: number;
    max: number;
    default: number;
    unit: string;
    description: string;
  }>;
  onSimulate: (variables: Record<string, number>) => SimulationResult;
}

interface SimulationResult {
  data: Array<{
    x: number;
    y: number;
    label?: string;
  }>;
  explanation: string;
  insights: string[];
}

export default function SimulationCanvas({ title, description, variables, onSimulate }: SimulationProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentVariables, setCurrentVariables] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize variables with defaults
  useEffect(() => {
    const defaults: Record<string, number> = {};
    variables.forEach(v => {
      defaults[v.id] = v.default;
    });
    setCurrentVariables(defaults);
  }, [variables]);

  const handleVariableChange = (variableId: string, value: number) => {
    setCurrentVariables(prev => ({
      ...prev,
      [variableId]: value
    }));
  };

  const runSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate progressive calculation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        const simulationResult = onSimulate(currentVariables);
        setResult(simulationResult);
        setIsRunning(false);
        if (simulationResult) {
          drawChart(simulationResult.data);
        }
      }
    }, 100);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
    setResult(null);
    
    // Reset variables to defaults
    const defaults: Record<string, number> = {};
    variables.forEach(v => {
      defaults[v.id] = v.default;
    });
    setCurrentVariables(defaults);
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const drawChart = (data: SimulationResult['data']) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Find data ranges
    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw data line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + ((point.x - xMin) / (xMax - xMin)) * chartWidth;
      const y = canvas.height - padding - ((point.y - yMin) / (yMax - yMin)) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = '#3b82f6';
    data.forEach(point => {
      const x = padding + ((point.x - xMin) / (xMax - xMin)) * chartWidth;
      const y = canvas.height - padding - ((point.y - yMin) / (yMax - yMin)) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#475569';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let i = 0; i <= 5; i++) {
      const x = padding + (chartWidth / 5) * i;
      const value = xMin + ((xMax - xMin) / 5) * i;
      ctx.fillText(value.toFixed(1), x, canvas.height - padding + 20);
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = canvas.height - padding - (chartHeight / 5) * i;
      const value = yMin + ((yMax - yMin) / 5) * i;
      ctx.fillText(value.toFixed(1), padding - 10, y + 5);
    }
  };

  const exportResults = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify({
      variables: currentVariables,
      result: result,
      timestamp: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulation-${title.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('simulation-container');
    if (!container) return;
    
    if (!isFullscreen) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div id="simulation-container" className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Maximize2 className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Variable Controls */}
        <div className={`border-r border-slate-200 p-4 space-y-4 ${showSettings ? 'w-80' : 'w-64'} transition-all`}>
          <h3 className="font-medium text-slate-900">Parameters</h3>
          
          {variables.map((variable) => (
            <div key={variable.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">{variable.name}</label>
                <span className="text-sm text-slate-600">
                  {currentVariables[variable.id]?.toFixed(2)} {variable.unit}
                </span>
              </div>
              
              <input
                type="range"
                min={variable.min}
                max={variable.max}
                step={(variable.max - variable.min) / 100}
                value={currentVariables[variable.id] || variable.default}
                onChange={(e) => handleVariableChange(variable.id, parseFloat(e.target.value))}
                className="w-full"
                disabled={isRunning}
              />
              
              {showSettings && (
                <p className="text-xs text-slate-500">{variable.description}</p>
              )}
            </div>
          ))}

          {/* Control Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <button
              onClick={isRunning ? () => setIsRunning(false) : runSimulation}
              disabled={isRunning}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Simulation
                </>
              )}
            </button>
            
            <button
              onClick={resetSimulation}
              className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            
            {result && (
              <button
                onClick={exportResults}
                className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Results
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Progress Bar */}
          {isRunning && (
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>Running simulation...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Chart Canvas */}
          <div className="flex-1 p-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-full border border-slate-200 rounded-lg"
            />
          </div>

          {/* Results Panel */}
          {result && (
            <div className="border-t border-slate-200 p-4">
              <h3 className="font-medium text-slate-900 mb-3">Results & Analysis</h3>
              
              <div className="space-y-4">
                {/* Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 mb-2">Explanation</h4>
                  <p className="text-sm text-blue-800">{result.explanation}</p>
                </div>

                {/* Insights */}
                {result.insights.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Key Insights</h4>
                    <ul className="space-y-2">
                      {result.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-green-600 mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
