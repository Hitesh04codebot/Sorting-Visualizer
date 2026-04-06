// Bucket Sort Algorithm
async function bucketSort(array, onCompare, onSwap, onSet, sleep) {
    const n = array.length;
    if (n <= 1) return;

    // Find maximum element to determine the number of buckets
    let max = array[0];
    for (let i = 1; i < n; i++) {
        if (array[i] > max) max = array[i];
    }

    // Usually bucket sort uses 10 buckets for numbers 0-100
    const numBuckets = 10;
    const buckets = new Array(numBuckets).fill(null).map(() => []);

    // Scatter elements into buckets
    for (let i = 0; i < n; i++) {
        // Find bucket index. Ensure it handles the maximum cleanly.
        let bucketIndex = Math.floor((array[i] / max) * (numBuckets - 1));
        buckets[bucketIndex].push(array[i]);
    }

    // Place scattered elements back to the array (Partially Sorted)
    let index = 0;
    const boundaries = [];
    for (let i = 0; i < numBuckets; i++) {
        const start = index;
        for (let j = 0; j < buckets[i].length; j++) {
            await checkPaused();
            // We use onSet to visually place them in bucket order
            await onSet(index, buckets[i][j]);
            index++;
        }
        boundaries.push([start, index - 1]);
    }

    // Sort individual bucket segments using Insertion Sort
    for (let b = 0; b < boundaries.length; b++) {
        const [start, end] = boundaries[b];
        if (start >= end) continue;

        for (let i = start + 1; i <= end; i++) {
            await checkPaused();
            let j = i;
            while (j > start) {
                await onCompare(j - 1, j);
                if (array[j - 1] > array[j]) {
                    await onSwap(j - 1, j);
                    // Swap values in the underlying array
                    [array[j - 1], array[j]] = [array[j], array[j - 1]];
                    j--;
                } else {
                    break;
                }
            }
        }
    }
}
