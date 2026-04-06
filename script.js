// DOM Elements
const barsContainer = document.getElementById('bars-container');
const algorithmSelect = document.getElementById('algorithm-select');
const sizeSlider = document.getElementById('size-slider');
const speedSelect = document.getElementById('speed-select');
const generateBtn = document.getElementById('generate-btn');
const sortBtn = document.getElementById('sort-btn');
const pauseBtn = document.getElementById('pause-btn');
const customArrayInput = document.getElementById('custom-array-input');
const setCustomBtn = document.getElementById('set-custom-btn');
const visualType = document.getElementById('visual-type');
const dataType = document.getElementById('data-type');
const csvUpload = document.getElementById('csv-upload');
const raceBtn = document.getElementById('race-btn');
const benchmarkBtn = document.getElementById('benchmark-btn');
const analyticsModal = document.getElementById('analytics-modal');
const closeModal = document.getElementById('close-modal');
const raceResults = document.getElementById('race-results');
const benchmarkResults = document.getElementById('benchmark-results');
const modalTitle = document.getElementById('modal-title');

// Variables
let array = [];
let isSorting = false;
let isPaused = false;
let size = 25;
let speed = 1;
let comparisons = 0;
let swaps = 0;
let startTime;
let comparisonChart;

const algorithms = {
    bubble: bubbleSort,
    selection: selectionSort,
    insertion: insertionSort,
    merge: mergeSort,
    quick: quickSort,
    heap: heapSort,
    bucket: bucketSort
};

const complexities = {
    bubble: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    selection: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    insertion: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    merge: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    quick: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    heap: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    bucket: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)' }
};

// Functions
function generateArray() {
    array = [];
    const type = dataType.value;
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    
    if (type === 'nearly-sorted') {
        array.sort((a,b) => a - b);
        for(let i=0; i<Math.floor(size/5); i++) {
            let idx1 = Math.floor(Math.random() * size);
            let idx2 = Math.floor(Math.random() * size);
            [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
        }
    } else if (type === 'reversed') {
        array.sort((a,b) => b - a);
    } else if (type === 'duplicates') {
        const pool = [20, 40, 60, 80];
        array = [];
        for (let i = 0; i < size; i++) {
            array.push(pool[Math.floor(Math.random() * pool.length)]);
        }
    }

    drawBars();
    updateInfo();
    resetStats();
    if (comparisonChart) {
        updateChart();
    }
}

function drawBars() {
    barsContainer.innerHTML = '';
    barsContainer.className = visualType.value; // 'bars' or 'dots'
    array.forEach(value => {
        const container = document.createElement('div');
        container.classList.add('bar-container');
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 3}px`;
        bar.style.setProperty('--val-height', `${value * 3}px`);
        bar.textContent = value;
        const valueSpan = document.createElement('span');
        valueSpan.classList.add('bar-value');
        valueSpan.textContent = value;
        container.appendChild(valueSpan);
        container.appendChild(bar);
        barsContainer.appendChild(container);
    });
}

function updateInfo() {
    const alg = algorithmSelect.value;
    document.getElementById('algorithm-name').textContent = `Algorithm: ${algorithmSelect.options[algorithmSelect.selectedIndex].text}`;
    document.getElementById('best-case').textContent = complexities[alg].best;
    document.getElementById('average-case').textContent = complexities[alg].average;
    document.getElementById('worst-case').textContent = complexities[alg].worst;
}

function resetStats() {
    comparisons = 0;
    swaps = 0;
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('swaps').textContent = swaps;
    document.getElementById('time-taken').textContent = '0.00 seconds';
}

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms / speed));
}

async function checkPaused() {
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function onCompare(i, j) {
    if (isPaused) return;
    comparisons++;
    document.getElementById('comparisons').textContent = comparisons;
    const bars = document.querySelectorAll('.bar');
    bars[i].classList.add('comparing');
    bars[j].classList.add('comparing');
    await sleep(100);
    bars[i].classList.remove('comparing');
    bars[j].classList.remove('comparing');
}

async function onSwap(i, j) {
    if (isPaused) return;
    swaps++;
    document.getElementById('swaps').textContent = swaps;
    const containers = document.querySelectorAll('.bar-container');
    const bar1 = containers[i].querySelector('.bar');
    const bar2 = containers[j].querySelector('.bar');
    const value1 = containers[i].querySelector('.bar-value');
    const value2 = containers[j].querySelector('.bar-value');
    bar1.classList.add('swapping');
    bar2.classList.add('swapping');
    await sleep(100);
    // Swap heights
    const tempHeight = bar1.style.height;
    bar1.style.height = bar2.style.height;
    bar2.style.height = tempHeight;
    // Swap custom CSS variable for dots visualization
    const tempValHeight = bar1.style.getPropertyValue('--val-height');
    bar1.style.setProperty('--val-height', bar2.style.getPropertyValue('--val-height'));
    bar2.style.setProperty('--val-height', tempValHeight);
    
    // Swap visual text inside the dot
    const tempBarText = bar1.textContent;
    bar1.textContent = bar2.textContent;
    bar2.textContent = tempBarText;

    // Swap values
    const tempValue = value1.textContent;
    value1.textContent = value2.textContent;
    value2.textContent = tempValue;
    bar1.classList.remove('swapping');
    bar2.classList.remove('swapping');
}

async function onSet(i, value) {
    if (isPaused) return;
    array[i] = value;
    const containers = document.querySelectorAll('.bar-container');
    containers[i].querySelector('.bar').style.height = `${value * 3}px`;
    containers[i].querySelector('.bar').style.setProperty('--val-height', `${value * 3}px`);
    containers[i].querySelector('.bar').textContent = value;
    containers[i].querySelector('.bar-value').textContent = value;
    await sleep(50);
}

function onSorted() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => bar.classList.add('sorted'));
}

async function startSorting() {
    if (isSorting) return;
    isSorting = true;
    isPaused = false;
    updateButtons();
    comparisons = 0;
    swaps = 0;
    startTime = Date.now();
    const alg = algorithmSelect.value;
    const sortFunc = algorithms[alg];
    try {
        await sortFunc(array, onCompare, onSwap, onSet, sleep);
        onSorted();
        // All sorted
        const endTime = Date.now();
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
        document.getElementById('time-taken').textContent = `${timeTaken} seconds`;
        alert('Sorting Completed!');
    } catch (e) {
        console.error('Error during sorting:', e);
        // Handle pause or error
    }
    isSorting = false;
    isPaused = false;
    updateButtons();
}

function updateButtons() {
    generateBtn.disabled = isSorting;
    sortBtn.disabled = isSorting;
    pauseBtn.disabled = !isSorting;
    setCustomBtn.disabled = isSorting;
    customArrayInput.disabled = isSorting;
    raceBtn.disabled = isSorting;
    benchmarkBtn.disabled = isSorting;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
}

// Event Listeners
algorithmSelect.addEventListener('change', updateInfo);
sizeSlider.addEventListener('input', () => {
    size = parseInt(sizeSlider.value);
    document.getElementById('slider-value').textContent = size;
    generateArray();
});
speedSelect.addEventListener('change', () => {
    speed = parseFloat(speedSelect.value);
});
generateBtn.addEventListener('click', generateArray);

setCustomBtn.addEventListener('click', () => {
    const rawValue = customArrayInput.value;
    if (!rawValue.trim()) return;
    
    const parsedValues = rawValue.split(',')
        .map(val => parseInt(val.trim()))
        .filter(val => !isNaN(val));

    if (parsedValues.length < 5 || parsedValues.length > 50) {
        alert('Please enter between 5 and 50 elements.');
        return;
    }

    array = parsedValues.map(val => Math.min(Math.max(val, 1), 100)); // Cap between 1 and 100 for styling
    size = array.length;
    sizeSlider.value = size;
    document.getElementById('slider-value').textContent = size;
    
    drawBars();
    updateInfo();
    resetStats();
    if (comparisonChart) {
        updateChart();
    }
});

visualType.addEventListener('change', drawBars);
dataType.addEventListener('change', generateArray);
csvUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target.result;
        const parsed = text.split(/[\s,]+/).map(v => parseInt(v)).filter(v => !isNaN(v));
        if(parsed.length >= 5) {
            array = parsed.slice(0, 50).map(val => Math.min(Math.max(val, 1), 100)); // cap 100
            size = array.length;
            sizeSlider.value = size;
            document.getElementById('slider-value').textContent = size;
            drawBars();
            updateInfo();
            resetStats();
            if(comparisonChart) updateChart();
        }
    };
    reader.readAsText(file);
});

closeModal.addEventListener('click', () => { analyticsModal.style.display = 'none'; });

sortBtn.addEventListener('click', startSorting);
pauseBtn.addEventListener('click', () => {
    if (!isPaused) {
        isPaused = true;
        pauseBtn.textContent = "Resume";
    } else {
        isPaused = false;
        pauseBtn.textContent = "Pause";
    }
});

function initChart() {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    comparisonChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Bubble', 'Selection', 'Insertion', 'Merge', 'Quick', 'Heap', 'Bucket'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(201, 203, 207, 0.8)'
                ],
                borderColor: '#1e1e1e',
                borderWidth: 2
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#ffffff', boxWidth: 12, padding: 10, font: { size: 10 } }
                },
                datalabels: {
                    color: '#ffffff',
                    font: { weight: 'bold', size: 12 },
                    formatter: function(value) {
                        return Math.round(value);
                    }
                }
            }
        }
    });
}

function updateChart() {
    const n = size;
    const nSquared = n * n;
    const nLogN = n * Math.log2(n);
    const nPlusK = n + 10; // For bucket sort average case (10 buckets)
    
    // Assign estimated operations based on average case
    comparisonChart.data.datasets[0].data = [
        nSquared, // Bubble
        nSquared, // Selection
        nSquared, // Insertion
        nLogN,    // Merge
        nLogN,    // Quick
        nLogN,    // Heap
        nPlusK    // Bucket
    ];
    comparisonChart.update();
}

async function runRace() {
    raceResults.style.display = 'block';
    benchmarkResults.style.display = 'none';
    modalTitle.textContent = "Race Results (Current Data)";
    analyticsModal.style.display = 'block';
    document.getElementById('race-table-body').innerHTML = '<tr><td colspan="5">Racing algorithms...</td></tr>';
    await new Promise(r => setTimeout(r, 50)); 
    
    const results = [];
    const algos = Object.keys(algorithms);
    for (let alg of algos) {
        let testArray = [...array];
        let comps = 0, swps = 0;
        const start = performance.now();
        await algorithms[alg](testArray, async () => { comps++; }, async (i,j) => { swps++; }, async () => {}, async () => {});
        const end = performance.now();
        results.push({ name: alg, time: end - start, comps, swps });
    }
    
    const winner = results.reduce((prev, curr) => (prev.time < curr.time) ? prev : curr);
    
    let html = '';
    results.forEach(r => {
        const isWinner = (r.name === winner.name);
        html += `<tr class="${isWinner ? 'winner' : ''}" style="border-bottom:1px solid #444; ${isWinner ? 'background:rgba(39, 174, 96, 0.2);' : ''}">
            <td style="padding:10px; text-transform:capitalize;">${r.name}</td>
            <td style="padding:10px;">${r.time.toFixed(2)}</td>
            <td style="padding:10px;">${r.comps}</td>
            <td style="padding:10px;">${r.swps}</td>
            <td style="padding:10px; font-weight:bold; color: #27ae60;">${isWinner ? '🏆 Winner' : ''}</td>
        </tr>`;
    });
    document.getElementById('race-table-body').innerHTML = html;
}

let bmCompsChart, bmTimeChart;
async function runBenchmarks() {
    raceResults.style.display = 'none';
    benchmarkResults.style.display = 'block';
    modalTitle.textContent = "Algorithm Benchmarks (Lines)";
    analyticsModal.style.display = 'block';
    
    const sizes = [10, 20, 30, 40, 50];
    const algos = Object.keys(algorithms);
    const chartColors = [
        'rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)', 'rgba(201, 203, 207, 0.8)'
    ];
    
    const datasetsComps = algos.map((alg, i) => ({ label: alg, data: [], borderColor: chartColors[i], fill: false, tension: 0.1 }));
    const datasetsTime = algos.map((alg, i) => ({ label: alg, data: [], borderColor: chartColors[i], fill: false, tension: 0.1 }));
    
    for (let s of sizes) {
        for (let i = 0; i < algos.length; i++) {
            let alg = algos[i];
            let testArr = [];
            for (let k=0; k<s; k++) testArr.push(Math.floor(Math.random() * 100) + 1);
            let comps = 0;
            const start = performance.now();
            await algorithms[alg](testArr, async() => {comps++;}, async()=>{}, async()=>{}, async()=>{});
            const end = performance.now();
            datasetsComps[i].data.push(comps);
            datasetsTime[i].data.push(end - start);
        }
    }
    
    if (bmCompsChart) bmCompsChart.destroy();
    if (bmTimeChart) bmTimeChart.destroy();
    
    Chart.defaults.color = '#ffffff';
    bmCompsChart = new Chart(document.getElementById('benchmarkCompsChart').getContext('2d'), {
        type: 'line', data: { labels: sizes, datasets: datasetsComps },
        options: { responsive: true, maintainAspectRatio: false }
    });
    
    bmTimeChart = new Chart(document.getElementById('benchmarkTimeChart').getContext('2d'), {
        type: 'line', data: { labels: sizes, datasets: datasetsTime },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

raceBtn.addEventListener('click', runRace);
benchmarkBtn.addEventListener('click', runBenchmarks);

// Initialize
initChart();
generateArray();
