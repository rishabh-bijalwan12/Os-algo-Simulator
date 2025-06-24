import React, { useState } from 'react';
import BarChart from '../../components/CpuAlgoComponent/BarChart';
import CompareLineChart from '../../components/CpuAlgoComponent/CompareLineChart';
import LineChart from '../../components/CpuAlgoComponent/LineChart';

const Sjf = () => {
  const [burstTimes, setBurstTimes] = useState('');
  const [arrivalTimes, setArrivalTimes] = useState('');
  const [result, setResult] = useState(null);
  const [compareData, setCompareData] = useState(null);

  const parseInput = (input) => {
    return input
      .split(/[\s,]+/)
      .map(str => str.trim())
      .filter(Boolean)
      .map(Number);
  };

  const handleSubmit = async () => {
    const btArr = parseInput(burstTimes);
    const atArr = parseInput(arrivalTimes);

    if (btArr.length !== atArr.length) {
      alert('Mismatch in number of burst and arrival times.');
      return;
    }

    const processes = btArr.map((bt, idx) => ({
      id: idx + 1,
      burstTime: bt,
      arrivalTime: atArr[idx],
    }));

    try {
      const res = await fetch('https://os-algo-simulator.onrender.com/api/cpu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: 'SJF',
          processes: processes.map(p => ({
            ...p,
            burstTime: parseInt(p.burstTime),
            arrivalTime: parseInt(p.arrivalTime),
          })),
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to calculate SJF.');
    }
  };

  const handleCompare = async () => {
    const btArr = parseInput(burstTimes);
    const atArr = parseInput(arrivalTimes);

    if (btArr.length !== atArr.length) {
      alert('Mismatch in number of burst and arrival times.');
      return;
    }

    const processes = btArr.map((bt, idx) => ({
      id: idx + 1,
      burstTime: bt,
      arrivalTime: atArr[idx],
    }));

    try {
      const res = await fetch('https://os-algo-simulator.onrender.com/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processes }),
      });
      const data = await res.json();
      setCompareData(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to compare algorithms.');
    }
  };

  const chartData = result && {
    labels: result.result.map(proc => `P${proc.id}`),
    datasets: [
      {
        label: 'Waiting Time',
        data: result.result.map(proc => proc.waitingTime),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
      {
        label: 'Turnaround Time',
        data: result.result.map(proc => proc.turnaroundTime),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
      },
    ],
  };

  const compareChartData = compareData && {
    labels: Object.keys(compareData),
    datasets: [
      {
        label: 'Average Waiting Time',
        data: Object.values(compareData).map(algo => parseFloat(algo.avgWaitingTime)),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Average Turnaround Time',
        data: Object.values(compareData).map(algo => parseFloat(algo.avgTurnaroundTime)),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Shortest Job First (SJF) Scheduling</h1>

          {/* Textareas for inputs */}
          <div className="grid gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Burst Times</label>
              <textarea
                value={burstTimes}
                onChange={(e) => setBurstTimes(e.target.value)}
                placeholder="E.g., 5 3 8 6"
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Times</label>
              <textarea
                value={arrivalTimes}
                onChange={(e) => setArrivalTimes(e.target.value)}
                placeholder="E.g., 0 1 2 3"
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={2}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">Calculate</button>
            <button onClick={handleCompare} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Compare</button>
          </div>

          {result && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Results</h2>
              <div className="overflow-x-auto h-64">
                <table className="w-full min-w-max text-sm text-left">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-3 py-2">Process</th>
                      <th className="px-3 py-2">Start</th>
                      <th className="px-3 py-2">Waiting</th>
                      <th className="px-3 py-2">Turnaround</th>
                      <th className="px-3 py-2">Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.result.map(proc => (
                      <tr key={proc.id} className="border-t">
                        <td className="px-3 py-2">P{proc.id}</td>
                        <td className="px-3 py-2">{proc.startTime}</td>
                        <td className="px-3 py-2">{proc.waitingTime}</td>
                        <td className="px-3 py-2">{proc.turnaroundTime}</td>
                        <td className="px-3 py-2">{proc.completionTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-1">Gantt Chart</h3>
                <div className="flex items-center h-12 bg-gray-100 rounded overflow-hidden">
                  {result.ganttChart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-center items-center border-r border-white text-xs"
                      style={{
                        width: `${(item.endTime - item.startTime) * 30}px`,
                        backgroundColor: `hsl(${item.processId * 60}, 70%, 85%)`,
                      }}
                    >
                      <span className="font-semibold">P{item.processId}</span>
                      <span>{item.startTime}-{item.endTime}</span>
                    </div>

                  ))}
                </div>
              </div>
              {/* Comparison Results Table + Chart */}
              {compareData && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-700 mb-3">Comparison Results</h2>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm text-left border rounded-md overflow-hidden">
                      <thead className="bg-gray-200 text-gray-700">
                        <tr>
                          <th className="px-4 py-2">Algorithm</th>
                          <th className="px-4 py-2">Avg Waiting Time</th>
                          <th className="px-4 py-2">Avg Turnaround Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(compareData).map(([algo, data]) => (
                          <tr key={algo} className="border-t">
                            <td className="px-4 py-2">{algo}</td>
                            <td className="px-4 py-2">{data.avgWaitingTime}</td>
                            <td className="px-4 py-2">{data.avgTurnaroundTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <LineChart
                      title="Turnaround Time Comparison"
                      processes={compareData.FCFS.result}
                      fcfsData={compareData.FCFS.result.map(proc => proc.turnaroundTime)}
                      rrData={compareData.RoundRobin.result.map(proc => proc.turnaroundTime)}
                      sjfData={compareData.SJF.result.map(proc => proc.turnaroundTime)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Charts */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {chartData && <BarChart data={chartData} />}
          {compareChartData && <CompareLineChart data={compareChartData} />}
          {compareData && (
            <div className="mt-6">
              {/* Waiting Time Chart */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <LineChart
                  title="Process-wise Waiting Time"
                  processes={compareData.FCFS.result}  // FCFS Process data
                  fcfsData={compareData.FCFS.result.map(proc => proc.waitingTime)}  // FCFS Waiting Time
                  rrData={compareData.RoundRobin.result.map(proc => proc.waitingTime)}  // Round Robin Waiting Time
                  sjfData={compareData.SJF.result.map(proc => proc.waitingTime)}  // SJF Waiting Time
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Sjf;