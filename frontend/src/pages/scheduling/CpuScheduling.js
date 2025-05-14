import React from 'react';
import { Link } from 'react-router-dom';

const CpuScheduling = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-4">
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">CPU Scheduling Algorithms</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/cpu/fcfs" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg text-center transition duration-300"
        >
          FCFS
        </Link>
        <Link 
          to="/cpu/round-robin" 
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg text-center transition duration-300"
        >
          Round Robin
        </Link>
        <Link 
          to="/cpu/sjf" 
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg text-center transition duration-300"
        >
          SJF
        </Link>
      </div>
    </div>
  </div>
);

export default CpuScheduling;