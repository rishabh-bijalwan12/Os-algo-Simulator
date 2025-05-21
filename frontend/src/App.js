import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import CpuScheduling from './pages/scheduling/CpuScheduling';
import Fcfs from './pages/scheduling/Fcfs';
import RoundRobin from './pages/scheduling/RoundRobin';
import Sjf from './pages/scheduling/Sjf';
import MemoryManagement from './pages/pageReplacement/MemoryManagement';
import Fifo from './pages/pageReplacement/Fifo';
import Lru from './pages/pageReplacement/Lru';
import Mru from './pages/pageReplacement/Mru';
import BestFirstFit from './pages/MemoryAllocation/BestFirstFit';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cpu" element={<CpuScheduling />} />
      <Route path="/cpu/fcfs" element={<Fcfs />} />
      <Route path="/cpu/round-robin" element={<RoundRobin />} />
      <Route path="/cpu/sjf" element={<Sjf />} />

      <Route path="/memory" element={<MemoryManagement />} />
      <Route path="/memory/fifo" element={<Fifo />} />
      <Route path="/memory/lru" element={<Lru />} />
      <Route path="/memory/mru" element={<Mru />} />
      <Route path="/memory/bestfirstfit" element={<BestFirstFit />} />

    </Routes>
  );
}

export default App;
