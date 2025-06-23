const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

//CPU Scheduling
function fcfs(processes) {
    let time = 0;
    const result = [];
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const ganttChart = [];

    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    for (const p of sorted) {
        const startTime = Math.max(time, p.arrivalTime);
        const waitingTime = startTime - p.arrivalTime;
        const turnaroundTime = waitingTime + parseInt(p.burstTime);
        const completionTime = startTime + parseInt(p.burstTime);

        result.push({
            id: p.id,
            startTime,
            waitingTime,
            turnaroundTime,
            completionTime,
        });

        ganttChart.push({ processId: p.id, startTime, endTime: completionTime });

        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;
        time = completionTime;
    }

    return {
        result,
        avgWaitingTime: (totalWaitingTime / processes.length).toFixed(2),
        avgTurnaroundTime: (totalTurnaroundTime / processes.length).toFixed(2),
        ganttChart,
    };
}

function sjf(processes) {
    let time = 0;
    const result = [];
    const completed = new Set();
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const ganttChart = [];

    while (completed.size < processes.length) {
        const available = processes.filter(p => p.arrivalTime <= time && !completed.has(p.id));
        if (available.length === 0) {
            time++;
            continue;
        }

        const next = available.sort((a, b) => a.burstTime - b.burstTime)[0];
        const waitingTime = time - next.arrivalTime;
        const turnaroundTime = waitingTime + parseInt(next.burstTime);
        const completionTime = time + parseInt(next.burstTime);

        result.push({
            id: next.id,
            startTime: time,
            waitingTime,
            turnaroundTime,
            completionTime,
        });

        ganttChart.push({ processId: next.id, startTime: time, endTime: completionTime });

        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;
        time += parseInt(next.burstTime);
        completed.add(next.id);
    }

    return {
        result,
        avgWaitingTime: (totalWaitingTime / processes.length).toFixed(2),
        avgTurnaroundTime: (totalTurnaroundTime / processes.length).toFixed(2),
        ganttChart,
    };
}

function roundRobin(processes, quantum) {
    let time = 0;
    const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const burstLeft = {};
    const arrivalMap = {};
    const waitingTimeMap = {};
    const turnaroundTimeMap = {};
    const startTimeMap = {};
    const ganttChart = [];
    // const totalTurnaroundTime = 0;
    // const totalWaitingTime = 0;
    // const initaialWaitingTime = [];

    processes.forEach(p => {
        burstLeft[p.id] = parseInt(p.burstTime);
        arrivalMap[p.id] = parseInt(p.arrivalTime);
    });

    const readyQueue = [];
    const completed = new Set();
    const result = [];

    let i = 0;

    while (completed.size < processes.length) {
        while (i < queue.length && queue[i].arrivalTime <= time) {
            readyQueue.push(queue[i]);
            i++;
        }

        if (readyQueue.length === 0) {
            time++;
            continue;
        }

        const current = readyQueue.shift();
        const execTime = Math.min(quantum, burstLeft[current.id]);

        if (startTimeMap[current.id] === undefined) {
            // initaialWaitingTime[current.id] = time-current.arrivalTime;
            startTimeMap[current.id] = time;
        }

        ganttChart.push({
            processId: current.id,
            startTime: time,
            endTime: time + execTime,
        });

        time += execTime;
        burstLeft[current.id] -= execTime;

        while (i < queue.length && queue[i].arrivalTime <= time) {
            readyQueue.push(queue[i]);
            i++;
        }

        if (burstLeft[current.id] > 0) {
            readyQueue.push(current);
        } 
        else {
            completed.add(current.id);
            const turnaroundTime = time - (arrivalMap[current.id]);
            const waitingTime = turnaroundTime - parseInt(current.burstTime);
            turnaroundTimeMap[current.id] = turnaroundTime;
            waitingTimeMap[current.id] = waitingTime;
            result.push({
                id: current.id,
                startTime: startTimeMap[current.id],
                waitingTime,
                turnaroundTime,
                completionTime: time,
            });
        }
    }

    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    for (const id in waitingTimeMap) {
        totalWaitingTime += waitingTimeMap[id];
    }

    for (const id in turnaroundTimeMap) {
        totalTurnaroundTime += turnaroundTimeMap[id];
    }

    return {
        result,
        avgWaitingTime: (totalWaitingTime / processes.length).toFixed(2),
        avgTurnaroundTime: (totalTurnaroundTime / processes.length).toFixed(2),
        ganttChart,
    };
}

app.post('/api/cpu', (req, res) => {
    const { algorithm, processes, quantum } = req.body;

    if (!algorithm || !Array.isArray(processes)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    let result;
    switch (algorithm) {
        case 'FCFS':
            result = fcfs(processes);
            break;
        case 'SJF':
            result = sjf(processes);
            break;
        case 'RoundRobin':
            if (typeof quantum !== 'number') {
                return res.status(400).json({ error: 'Quantum required for Round Robin' });
            }
            result = roundRobin(processes, quantum);
            break;
        default:
            return res.status(400).json({ error: 'Unsupported algorithm' });
    }

    res.json(result);
});

app.post('/api/compare', (req, res) => {
    const { processes } = req.body;

    if (!Array.isArray(processes)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const algorithms = ['FCFS', 'SJF', 'RoundRobin'];
    const quantum = req.body.quantum ? req.body.quantum : 2; // Default quantum for Round Robin
    const results = {};

    try {
        results.FCFS = fcfs(processes);
        results.SJF = sjf(processes);
        results.RoundRobin = roundRobin(processes, quantum);

        res.json(results);
    } catch (error) {
        console.error('Error in comparison:', error);
        res.status(500).json({ error: 'Failed to compare algorithms' });
    }
});

//Memory Management page replacement algorithms
const fifo = (references, frames) => {
    const memory = new Set();
    const queue = [];
    const steps = [];
    let pageFaults = 0;

    for (let ref of references) {
        ref = Number(ref);

        const wasInMemory = memory.has(ref);

        if (memory.size < frames) {
            if (!wasInMemory) {
                memory.add(ref);
                queue.push(ref);
                pageFaults++;
            }
        }
        else {
            if (!wasInMemory) {
                const oldest = queue.shift(); // Remove the oldest page
                memory.delete(oldest);
                memory.add(ref);
                queue.push(ref);
                pageFaults++;
            }
        }

        steps.push({
            reference: ref,
            pageFault: !wasInMemory,
            memory: Array.from(queue),
        });
    }

    return { pageFaults, steps };
};

const lru = (references, frames) => {
    const memory = new Set();
    const recentIndexes = new Map();
    const steps = [];
    let pageFaults = 0;

    for (let i = 0; i < references.length; i++) {
        const ref = Number(references[i]);
        const wasInMemory = memory.has(ref);

        if (memory.size < frames) {
            if (!wasInMemory) {
                memory.add(ref);
                pageFaults++;
            }
            recentIndexes.set(ref, i);
        }
        else {
            if (!wasInMemory) {
                // Find the LRU page 
                let lruIndex = Infinity;
                let lruPage = null;
                for (const page of memory) {
                    if (recentIndexes.get(page) < lruIndex) {
                        lruIndex = recentIndexes.get(page);
                        lruPage = page;
                    }
                }

                memory.delete(lruPage);
                recentIndexes.delete(lruPage);

                memory.add(ref);
                pageFaults++;
            }
            recentIndexes.set(ref, i);
        }

        steps.push({
            reference: ref,
            pageFault: !wasInMemory,
            memory: Array.from(memory),
        });
    }

    return { pageFaults, steps };
};

const mru = (references, frames) => {
    const memory = new Set();
    const recentIndexes = new Map();
    const steps = [];
    let pageFaults = 0;

    for (let i = 0; i < references.length; i++) {
        const ref = Number(references[i]);
        const wasInMemory = memory.has(ref);

        if (memory.size < frames) {
            if (!wasInMemory) {
                memory.add(ref);
                pageFaults++;
            }
            recentIndexes.set(ref, i);
        }
        else {
            if (!wasInMemory) {
                // Find the MRU page 
                let lruIndex = -Infinity;
                let lruPage = null;
                for (const page of memory) {
                    if (recentIndexes.get(page) > lruIndex) {
                        lruIndex = recentIndexes.get(page);
                        lruPage = page;
                    }
                }

                memory.delete(lruPage);
                recentIndexes.delete(lruPage);

                memory.add(ref);
                pageFaults++;
            }
            recentIndexes.set(ref, i);
        }

        steps.push({
            reference: ref,
            pageFault: !wasInMemory,
            memory: Array.from(memory),
        });
    }

    return { pageFaults, steps };
};

app.post('/api/memory', (req, res) => {
    let { algorithm, references, frames } = req.body;
    frames = parseInt(frames);

    if (!algorithm || !Array.isArray(references) || isNaN(frames)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    let result;
    switch (algorithm) {
        case 'FIFO':
            result = fifo(references, frames);
            break;
        case 'LRU':
            result = lru(references, frames);
            break;
        case 'MRU':
            result = mru(references, frames);
            break;
        default:
            return res.status(400).json({ error: 'Unsupported algorithm' });
    }

    res.json(result);
});

app.post('/api/comparememory', (req, res) => {
    const { references, frames } = req.body;

    if (!Array.isArray(references) || typeof frames !== 'number') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const fifoResult = fifo(references, frames);
    const lruResult = lru(references, frames);
    const mruResult = mru(references, frames);

    const comparison = {
        FIFO: {
            pageFaults: fifoResult.pageFaults,
        },
        LRU: {
            pageFaults: lruResult.pageFaults,
        },
        MRU: {
            pageFaults: mruResult.pageFaults,
        },
    };

    res.json(comparison);
});

//Memory Allocation Algorithms
function bestFit(blockSizes, processSizes) {
    const allocation = Array(processSizes.length).fill(null);
    const blocks = [...blockSizes];

    for (let i = 0; i < processSizes.length; i++) {
        let bestIdx = -1;

        for (let j = 0; j < blocks.length; j++) {
            if (blocks[j] >= processSizes[i]) {
                if (bestIdx === -1 || blocks[j] < blocks[bestIdx]) {
                    bestIdx = j;
                }
            }
        }

        if (bestIdx !== -1) {
            allocation[i] = {
                blockIndex: bestIdx,
                blockSize: processSizes[i]
            };
            blocks[bestIdx] = 0;
        } 
        else {
            allocation[i] = {
                blockIndex: -1,
                blockSize:  processSizes[i]
            };
        }
    }

    return { allocation, blocks };
}

function firstFit(blockSizes, processSizes) {
    const allocation = Array(processSizes.length).fill(-1,-1);
    const blocks = [...blockSizes];
    for (let i = 0; i < processSizes.length; i++) {
        var t=0;
        for (let j = 0; j < blocks.length; j++) {
            if (blocks[j] >= processSizes[i]) {
                allocation[i] = {
                    blockIndex: j,
                    blockSize: processSizes[i]
                };
                blocks[j] = 0;
                t=1;
                break;
            }
        }
        if(t==0){
            allocation[i] = {
                blockIndex: -1,
                blockSize: processSizes[i]
            };
        }
    }
    return { allocation, blocks };
}

function worstFit(blockSizes, processSizes) {
    const allocation = Array(processSizes.length).fill(null);
    const blocks = [...blockSizes];

    for (let i = 0; i < processSizes.length; i++) {
        let worstIdx = -1;

        for (let j = 0; j < blocks.length; j++) {
            if (blocks[j] >= processSizes[i]) {
                if (worstIdx === -1 || blocks[j] > blocks[worstIdx]) {
                    worstIdx = j;
                }
            }
        }

        if (worstIdx !== -1) {
            allocation[i] = {
                blockIndex: worstIdx,
                blockSize: processSizes[i]
            };
            blocks[worstIdx] = 0;
        } 
        else {
            allocation[i] = {
                blockIndex: -1,
                blockSize: processSizes[i]
            };
        }
    }

    return { allocation, blocks };
}

function nextFit(blockSizes, processSizes) {
    const allocation = Array(processSizes.length).fill(null);
    const blocks = [...blockSizes];
    let lastAllocIdx = 0;

    for (let i = 0; i < processSizes.length; i++) {
        let allocated = false;
        let j = lastAllocIdx;

        for (let count = 0; count < blocks.length; count++) {
            if (blocks[j] >= processSizes[i]) {
                allocation[i] = {
                    blockIndex: j,
                    blockSize: processSizes[i]
                };
                blocks[j] = 0;
                lastAllocIdx = (j + 1) % blocks.length;
                allocated = true;
                break;
            }
            j = (j + 1) % blocks.length;
        }

        if (!allocated) {
            allocation[i] = {
                blockIndex: -1,
                blockSize: processSizes[i]
            };
        }
    }

    return { allocation, blocks };
}

app.post('/api/memoryallocation', (req, res) => {
    const { algorithm, blockSizes, processSizes } = req.body;
    if (!algorithm || !Array.isArray(blockSizes) || !Array.isArray(processSizes)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    let result;
    switch (algorithm) {
        case 'BestFit':
            result = bestFit(blockSizes, processSizes);
            break;
        case 'FirstFit':
            result = firstFit(blockSizes, processSizes);
            break;
        case 'WorstFit':
            result = worstFit(blockSizes, processSizes);
            break;
        case 'NextFit':
            result = nextFit(blockSizes, processSizes);
            break;
        default:
            return res.status(400).json({ error: 'Unsupported algorithm' });
    }

    res.json(result);
});


//Server
app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}  `);
});