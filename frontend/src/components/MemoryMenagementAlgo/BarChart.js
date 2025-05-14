// BarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data, title }) => {
  if (!data) return null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={data} options={chartOptions} />
    </div>
  );
};

export default BarChart;
