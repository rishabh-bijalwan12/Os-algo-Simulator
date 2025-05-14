import React from 'react';

const Table = ({ compareData }) => {
  if (!compareData) return null; // Early return if compareData is not provided

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 overflow-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Comparison Table</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Algorithm</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Page Faults</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(compareData).map(([algo, data]) => (
            <tr key={algo}>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{algo}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{data.pageFaults}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
