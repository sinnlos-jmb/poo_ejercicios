const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class NumberArray {
    constructor(size) {
        this.numbers = Array.from({ length: size }, function () {
            return Math.floor(Math.random() * 100);
        });
    }
    
    generateRandomNumbers() {
        this.numbers = Array.from({ length: 20 }, function () {
            return Math.floor(Math.random() * 100);
        });
    }
}

class Algorithm {
    constructor() {
        this.executionTime = 0;
    }
    
    execute(arr) {
        throw new Error("Method 'execute' must be implemented in subclasses");
    }
}

class BubbleSort extends Algorithm {
    execute(arr) {
        let sortedArr = arr.slice();
        let start = Date.now();
        for (let i = 0; i < sortedArr.length - 1; i++) {
            for (let j = 0; j < sortedArr.length - i - 1; j++) {
                if (sortedArr[j] > sortedArr[j + 1]) {
                    let temp = sortedArr[j];
                    sortedArr[j] = sortedArr[j + 1];
                    sortedArr[j + 1] = temp;
                }
            }
        }
        this.executionTime = Date.now() - start;
        return { sortedArray: sortedArr, time: this.executionTime };
    }
}

class QuickSort extends Algorithm {
    execute(arr) {
        let start = Date.now();
        function quickSort(arr) {
            if (arr.length <= 1) {
                return arr;
            }
            let pivot = arr[arr.length - 1];
            let left = arr.filter(function (num) { return num < pivot; });
            let right = arr.filter(function (num) { return num > pivot; });
            return quickSort(left).concat(pivot, quickSort(right));
        }
        let sortedArray = quickSort(arr);
        this.executionTime = Date.now() - start;
        return { sortedArray: sortedArray, time: this.executionTime };
    }
}

class LinearSearch extends Algorithm {
    execute(arr, value) {
        let start = Date.now();
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                this.executionTime = Date.now() - start;
                return { index: i, time: this.executionTime };
            }
        }
        this.executionTime = Date.now() - start;
        return { index: -1, time: this.executionTime };
    }
}

class BinarySearch extends Algorithm {
    execute(arr, value) {
        let start = Date.now();
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (arr[mid] === value) {
                this.executionTime = Date.now() - start;
                return { index: mid, time: this.executionTime };
            } else if (arr[mid] < value) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        this.executionTime = Date.now() - start;
        return { index: -1, time: this.executionTime };
    }
}

const numArray = new NumberArray(20);
const bubbleSort = new BubbleSort();
const quickSort = new QuickSort();
const linearSearch = new LinearSearch();
const binarySearch = new BinarySearch();

mainMenu();
