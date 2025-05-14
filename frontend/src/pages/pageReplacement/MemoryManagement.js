import React from 'react';
import { Link } from 'react-router-dom';

const MemoryManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">Memory Management</h1>
        <h2 className="text-xl text-gray-700 mb-8">Select Page Replacement Algorithm:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/memory/fifo" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            FIFO
          </Link>
          <Link 
            to="/memory/lru" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            LRU
          </Link>
          <Link 
            to="/memory/mru" 
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            MRU
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemoryManagement;