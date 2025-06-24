import React, { useState } from 'react';
import CompareMemoryChart from '../../components/MemoryMenagementAlgo/CompareMemoryChart';
import PieChart from '../../components/MemoryMenagementAlgo/PieChart';
import Table from '../../components/MemoryMenagementAlgo/Table';
import BarChart from '../../components/MemoryMenagementAlgo/BarChart';


const Lru = () => {
  const [referenceString, setReferenceString] = useState('');
  const [numFrames, setNumFrames] = useState('');
  const [result, setResult] = useState(null);
  const [compareData, setCompareData] = useState(null);

  const handleSubmit = async () => {
    try {
      const references = referenceString.split(',').map((v) => parseInt(v.trim()));

      const res = await fetch('https://os-algo-simulator.onrender.com/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: 'LRU',
          references,
          frames: parseInt(numFrames),
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to calculate LRU. Please check your inputs.');
    }
  };

  const handleCompare = async () => {
    try {
      const references = referenceString.split(',').map((v) => parseInt(v.trim()));

      const res = await fetch('https://os-algo-simulator.onrender.com/api/comparememory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          references,
          frames: parseInt(numFrames),
        }),
      });

      const data = await res.json();
      setCompareData(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch comparison data.');
    }
  };

  const chartData = result ? {
    labels: result.steps.map((_, idx) => `Step ${idx + 1}`),
    datasets: [
      {
        label: 'Page Faults',
        data: result.steps.map(step => step.pageFault ? 1 : 0),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  } : null;

  const renderSteps = result ? (
    <div className="bg-white p-4 rounded-lg border border-gray-200 overflow-auto max-h-96">
      <ol className="list-decimal list-inside space-y-2">
        {result.steps.map((step, idx) => (
          <li key={idx} className="font-mono text-sm">
            Reference: {step.reference}, Page Fault: {step.pageFault ? 'Yes' : 'No'}, Memory: [{step.memory.join(', ')}]
          </li>
        ))}
      </ol>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">LRU Page Replacement</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference String (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1"
                  value={referenceString}
                  onChange={(e) => setReferenceString(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Frames
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="e.g. 3"
                  value={numFrames}
                  onChange={(e) => setNumFrames(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!referenceString || !numFrames}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 mr-4 ${
                referenceString && numFrames
                  ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Simulate LRU
            </button>

            <button
              onClick={handleCompare}
              disabled={!referenceString || !numFrames}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                referenceString && numFrames
                  ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Compare Algorithms
            </button>
          </div>

          {result && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Page Faults: {result.pageFaults}
              </div>
              <h3 className="font-medium text-gray-700 mb-3">Page Replacement Steps:</h3>
              {renderSteps}
            </div>
          )}

          {compareData && (<Table compareData={compareData} />)}
        </div>

        {/* Right Panel: Charts */}
        <div className="space-y-6">
          {chartData && (<BarChart data={chartData} title="LRU Page Faults" />)}
          {compareData && <CompareMemoryChart data={compareData} />}
          {compareData && <PieChart data={compareData} />}
        </div>
      </div>
    </div>
  );
};

export default Lru;
