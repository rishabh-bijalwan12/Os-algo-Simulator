import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ title, processes, fcfsData, rrData, sjfData }) => {

  const data = {
    labels: processes?.map((proc) => `P${proc.id}`), // X-axis is Process ID
    datasets: [
      {
        label: 'FCFS',
        data: fcfsData,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: 'Round Robin',
        data: rrData,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: 'SJF',
        data: sjfData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Process ID' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Time (ms)' },
      },
    },
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: title,
        font: { size: 16 },
      },
    },
  };

  return <Line data={data} options={options} height={300} />;
};

export default LineChart;
