import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="flex items-center justify-center min-h-screen bg-pink-50">
    <div className="text-center px-6 py-10 bg-white shadow-lg rounded-2xl max-w-xl w-full transition-all duration-300">
      <h1 className="text-4xl font-bold text-yellow-500 mb-4">Welcome to OS Scheduling Simulator</h1>
      <h2 className="text-xl text-gray-600 mb-10">Select a management type:</h2>

      <div className="flex flex-wrap justify-center gap-6">
        <Link
          to="/cpu"
          className="bg-purple-500 hover:bg-purple-600 text-white text-lg font-medium px-8 py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          CPU Scheduling
        </Link>
      
        <Link
          to="/memory"
          className="bg-purple-500 hover:bg-purple-600 text-white text-lg font-medium px-8 py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          Page Replacement
        </Link>
        {/* <Link
          to="/disk"
          className="bg-purple-500 hover:bg-purple-600 text-white text-lg font-medium px-8 py-4 rounded-full shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          Disk Scheduling
        </Link> */}
      </div>
    </div>
  </div>
);

export default Home;
