import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-base font-semibold text-gray-700 mb-2">Performance Bar Chart</h2>
      <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
    </div>
  );
};

export default BarChart;