// Quick Sort Algorithm
async function quickSort(array, onCompare, onSwap, onSet, sleep, start = 0, end = array.length - 1) {
    if (start >= end) return;

    const pivotIndex = await partition(array, start, end, onCompare, onSwap, onSet, sleep);

    await quickSort(array, onCompare, onSwap, onSet, sleep, start, pivotIndex - 1);
    await quickSort(array, onCompare, onSwap, onSet, sleep, pivotIndex + 1, end);
}

async function partition(array, start, end, onCompare, onSwap, onSet, sleep) {
    const pivot = array[end];
    let i = start - 1;

    for (let j = start; j < end; j++) {
        await checkPaused();
        await onCompare(j, end);
        if (array[j] < pivot) {
            i++;
            await onSwap(i, j);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    await onSwap(i + 1, end);
    [array[i + 1], array[end]] = [array[end], array[i + 1]];

    return i + 1;
}
