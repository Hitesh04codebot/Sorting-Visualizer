// Insertion Sort Algorithm
async function insertionSort(array, onCompare, onSwap, onSet, sleep) {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        await checkPaused();
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            await checkPaused();
            await onCompare(j, j + 1);
            await onSwap(j, j + 1);
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = key;
    }
}
