// Heap Sort Algorithm
async function heapSort(array, onCompare, onSwap, onSet, sleep) {
    const n = array.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await checkPaused();
        await heapify(array, n, i, onCompare, onSwap);
    }

    // Heap sort
    for (let i = n - 1; i > 0; i--) {
        await checkPaused();
        // Swap root with the end element
        await onSwap(0, i);
        [array[0], array[i]] = [array[i], array[0]];

        // Heapify the reduced heap
        await heapify(array, i, 0, onCompare, onSwap);
    }
}

async function heapify(array, n, i, onCompare, onSwap) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
        await onCompare(left, largest);
        if (array[left] > array[largest]) {
            largest = left;
        }
    }

    if (right < n) {
        await onCompare(right, largest);
        if (array[right] > array[largest]) {
            largest = right;
        }
    }

    if (largest !== i) {
        await onSwap(i, largest);
        [array[i], array[largest]] = [array[largest], array[i]];
        
        await heapify(array, n, largest, onCompare, onSwap);
    }
}
