import React from 'react';
import { Line } from 'react-chartjs-2';

const CompareLineChart = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-base font-semibold text-gray-700 mb-2">Comparison Line Chart</h2>
      <Line data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
    </div>
  );
};

export default CompareLineChart;