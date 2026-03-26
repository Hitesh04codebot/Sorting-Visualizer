// DOM Elements
const barsContainer = document.getElementById('bars-container');
const algorithmSelect = document.getElementById('algorithm-select');
const sizeSlider = document.getElementById('size-slider');
const speedSelect = document.getElementById('speed-select');
const generateBtn = document.getElementById('generate-btn');
const sortBtn = document.getElementById('sort-btn');
const pauseBtn = document.getElementById('pause-btn');

// Variables
let array = [];
let isSorting = false;
let isPaused = false;
let size = 25;
let speed = 1;
let comparisons = 0;
let swaps = 0;
let startTime;

const algorithms = {
    bubble: bubbleSort,
    selection: selectionSort,
    insertion: insertionSort,
    merge: mergeSort,
    quick: quickSort
};

const complexities = {
    bubble: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    selection: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    insertion: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    merge: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    quick: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' }
};

// Functions
function generateArray() {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    drawBars();
    updateInfo();
    resetStats();
}

function drawBars() {
    barsContainer.innerHTML = '';
    array.forEach(value => {
        const container = document.createElement('div');
        container.classList.add('bar-container');
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 3}px`;
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

// Initialize
generateArray();
