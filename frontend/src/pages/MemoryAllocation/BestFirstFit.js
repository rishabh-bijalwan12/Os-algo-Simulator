import React, { useState } from 'react';

const BestFirstFit = () => {
  const [blockSizes, setBlockSizes] = useState('');
  const [processSizes, setProcessSizes] = useState('');
  const [result, setResult] = useState(null);

  const parseInput = (input) => {
    return input.split(/[\s,]+/).map(str => str.trim()).filter(Boolean).map(Number);
  };

  const handleSubmit = async (algorithm) => {
    const blocks = parseInput(blockSizes);
    const processes = parseInput(processSizes);
    if (!blocks.length || !processes.length) {
      alert('Please enter valid block and process sizes.');
      return;
    }
    try {
      const res = await fetch('https://os-algo-simulator.onrender.com/api/memoryallocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm,
          blockSizes: blocks,
          processSizes: processes,
        }),
      });
      const data = await res.json();
      setResult({ ...data, algorithm });
    } catch (error) {
      alert('Failed to calculate.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Memory Allocation (Best Fit, First Fit, Worst Fit, Next Fit)
          </h1>

          <div className="grid gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Block Sizes</label>
              <textarea
                value={blockSizes}
                onChange={e => setBlockSizes(e.target.value)}
                placeholder="E.g., 100 500 200 300 600"
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Process Sizes</label>
              <textarea
                value={processSizes}
                onChange={e => setProcessSizes(e.target.value)}
                placeholder="E.g., 212 417 112 426"
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={2}
              />
            </div>
          </div>

          {/* Algorithm Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={() => handleSubmit('BestFit')} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">Best Fit</button>
            <button onClick={() => handleSubmit('FirstFit')} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">First Fit</button>
            <button onClick={() => handleSubmit('WorstFit')} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">Worst Fit</button>
            <button onClick={() => handleSubmit('NextFit')} className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700">Next Fit</button>
          </div>

          {/* Allocation Chart */}
          {result && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-1">Allocation Chart</h3>
              <div className="flex items-center h-12 bg-gray-100 rounded overflow-hidden">
                {result.allocation.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-center items-center border-r border-white text-xs"
                    style={{
                      width: `${item.blockSize * 0.5}px`,
                      backgroundColor: item.blockIndex === -1 ? '#ccc' : `hsl(${item.blockIndex * 60}, 70%, 85%)`,
                    }}
                  >
                    <span className="font-semibold">P{idx + 1}</span>
                    <span>{item.blockIndex === -1 ? "Not Allocated" : `Block ${item.blockIndex + 1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Table */}
          {result && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">{result.algorithm} Results</h2>
              <table className="w-full text-sm text-left mb-4">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-3 py-2">Process</th>
                    <th className="px-3 py-2">Block Allocated</th>
                  </tr>
                </thead>
                <tbody>
                  {result.allocation.map((block, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">P{i + 1}</td>
                      <td className="px-3 py-2">
                        {block.blockIndex !== -1 ? `Block ${block.blockIndex + 1}` : 'Not Allocated'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Optional: Remaining Block Sizes */}
          {result && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-1">Remaining Block Sizes</h3>
              <ul className="list-disc pl-6 text-sm text-gray-700">
                {result.blocks.map((size, idx) => (
                  <li key={idx}>Block {idx + 1}: {size === 0 ? 'Used' : `${size} KB Remaining`}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestFirstFit;
