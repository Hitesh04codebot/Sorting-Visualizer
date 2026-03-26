// Bubble Sort Algorithm
async function bubbleSort(array, onCompare, onSwap, onSet, sleep) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        await checkPaused();
        for (let j = 0; j < n - i - 1; j++) {
            await checkPaused();
            // Compare
            await onCompare(j, j + 1);
            if (array[j] > array[j + 1]) {
                // Swap
                await onSwap(j, j + 1);
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }
    }
}
