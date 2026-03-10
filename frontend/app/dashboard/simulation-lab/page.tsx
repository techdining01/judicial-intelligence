/**
 * Simulation Lab Page
 * Main page for legal simulations and interactive learning
 */

'use client';

import { useState } from 'react';
import DashboardLayout from '@/src/components/Dashboard/DashboardLayout';
import SimulationCanvas from '@/src/components/Simulation/SimulationCanvas';
import { Filter, Search, Beaker, Calculator, Scale } from 'lucide-react';

// Mock simulation data
const mockSimulations = [
  {
    id: 'contract-simulation',
    title: 'Contract Breach Analysis',
    description: 'Simulate the financial impact of contract breaches under different scenarios',
    icon: Calculator,
    category: 'Contract Law',
    difficulty: 'Intermediate',
    variables: [
      {
        id: 'contract_value',
        name: 'Contract Value',
        min: 10000,
        max: 1000000,
        default: 100000,
        unit: '₦',
        description: 'Total value of the contract in Naira'
      }
    ],
    onSimulate: (variables: Record<string, number>) => {
      const contractValue = variables.contract_value;
      const data = [];
      for (let i = 0; i <= 100; i += 10) {
        const severity = i / 100;
        const damages = contractValue * severity;
        data.push({ x: i, y: damages, label: `${i}% breach` });
      }
      
      return {
        data,
        explanation: `Based on a contract value of ₦${contractValue.toLocaleString()}, the estimated damages range from ₦0 to ₦${contractValue.toLocaleString()}.`,
        insights: ['Higher breach severity increases damages', 'Mitigation efforts can reduce losses']
      };
    }
  }
];

const categories = ['All', 'Contract Law', 'Civil Procedure', 'Evidence Law'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function SimulationLabPage() {
  const [selectedSimulation, setSelectedSimulation] = useState(mockSimulations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSimulations = mockSimulations.filter(sim => {
    const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sim.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Simulation Lab</h1>
          <p className="text-slate-600">Interactive legal simulations to understand complex concepts</p>
        </div>

        {/* Filters */}
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search simulations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Filter className="h-5 w-5 text-slate-600 mt-2.5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Simulation Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulation List */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Available Simulations</h3>
            {filteredSimulations.map((simulation) => (
              <div
                key={simulation.id}
                onClick={() => setSelectedSimulation(simulation)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedSimulation.id === simulation.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <simulation.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate">{simulation.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">{simulation.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500">{simulation.category}</span>
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded">{simulation.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Simulation Canvas */}
          <div className="lg:col-span-2">
            <SimulationCanvas
              title={selectedSimulation.title}
              description={selectedSimulation.description}
              variables={selectedSimulation.variables}
              onSimulate={selectedSimulation.onSimulate}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
