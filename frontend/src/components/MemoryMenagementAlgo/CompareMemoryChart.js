import React from 'react';
import { Bar } from 'react-chartjs-2';

const CompareMemoryChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Page Faults',
        data: Object.values(data).map(algo => algo.pageFaults),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Memory Algorithm Comparison</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Comparison of Memory Algorithms' },
          },
        }}
      />
    </div>
  );
};

export default CompareMemoryChart;
