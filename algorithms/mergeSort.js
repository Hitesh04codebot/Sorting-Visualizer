// Merge Sort Algorithm
async function mergeSort(array, onCompare, onSwap, onSet, sleep, start = 0, end = array.length - 1) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    await mergeSort(array, onCompare, onSwap, onSet, sleep, start, mid);
    await mergeSort(array, onCompare, onSwap, onSet, sleep, mid + 1, end);

    await merge(array, start, mid, end, onCompare, onSwap, onSet, sleep);
}

async function merge(array, start, mid, end, onCompare, onSwap, onSet, sleep) {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        await checkPaused();
        await onCompare(k, mid + 1 + j);
        if (left[i] <= right[j]) {
            await onSet(k, left[i]);
            i++;
        } else {
            await onSet(k, right[j]);
            j++;
        }
        k++;
    }

    while (i < left.length) {
        await checkPaused();
        await onSet(k, left[i]);
        i++;
        k++;
    }

    while (j < right.length) {
        await checkPaused();
        await onSet(k, right[j]);
        j++;
        k++;
    }
}
