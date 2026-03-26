// Selection Sort Algorithm
async function selectionSort(array, onCompare, onSwap, onSet, sleep) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        await checkPaused();
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            await checkPaused();
            await onCompare(minIdx, j);
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            await onSwap(i, minIdx);
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
        }
    }
}
