const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class NumberArray {
    constructor(size) {
        this.numbers = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    }
    
    generateRandomNumbers() {
        this.numbers = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
    }
}

class Sorting {
    static bubbleSort(arr) {
        let sortedArr = [...arr];
        let start = Date.now();
        for (let i = 0; i < sortedArr.length - 1; i++) {
            for (let j = 0; j < sortedArr.length - i - 1; j++) {
                if (sortedArr[j] > sortedArr[j + 1]) {
                    [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
                }
            }
        }
        let end = Date.now();
        return { sortedArray: sortedArr, time: end - start };
    }
    
    static quickSort(arr) {
        if (arr.length <= 1) return arr;
        let pivot = arr[arr.length - 1];
        let left = arr.filter(num => num < pivot);
        let right = arr.filter(num => num > pivot);
        return [...Sorting.quickSort(left), pivot, ...Sorting.quickSort(right)];
    }
}

class Searching {
    static linearSearch(arr, value) {
        let start = Date.now();
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                return { index: i, time: Date.now() - start };
            }
        }
        return { index: -1, time: Date.now() - start };
    }
    
    static binarySearch(arr, value) {
        let start = Date.now();
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (arr[mid] === value) {
                return { index: mid, time: Date.now() - start };
            } else if (arr[mid] < value) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return { index: -1, time: Date.now() - start };
    }
}

const numArray = new NumberArray(20);

function mainMenu() {
    console.log("\nSelect an action:");
    console.log("1. Generate random numbers");
    console.log("2. Choose sorting method");
    console.log("3. Choose searching method");
    console.log("4. Generate report");
    console.log("5. Exit");
    rl.question("Enter choice: ", function (choice) {
        if (choice === "1") {
            numArray.generateRandomNumbers();
            console.log("Generated numbers:", numArray.numbers);
            mainMenu();
        } else if (choice === "2") {
            chooseSorting();
        } else if (choice === "3") {
            chooseSearching();
        } else if (choice === "4") {
            generateReport();
        } else if (choice === "5") {
            console.log("\n👋 Exiting program!");
            rl.close();
        } else {
            console.log("\n❌ Invalid choice! Try again.");
            mainMenu();
        }
    });
}

function chooseSorting() {
    console.log("\nChoose a sorting method:");
    console.log("1. Bubble Sort");
    console.log("2. Quick Sort");
    rl.question("Enter choice: ", function (choice) {
        let result;
        if (choice === "1") {
            result = Sorting.bubbleSort(numArray.numbers);
        } else if (choice === "2") {
            let start = Date.now();
            let sortedArray = Sorting.quickSort(numArray.numbers);
            let end = Date.now();
            result = { sortedArray, time: end - start };
        } else {
            console.log("Invalid choice");
            return mainMenu();
        }
        console.log("Sorted Array:", result.sortedArray);
        console.log("Execution Time:", result.time, "ms");
        mainMenu();
    });
}

function chooseSearching() {
    let testValues = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    console.log("\nSearch for values:", testValues);
    let sortedArray = Sorting.quickSort(numArray.numbers);
    
    console.log("\nLinear Search:");
    testValues.forEach(value => {
        let result = Searching.linearSearch(numArray.numbers, value);
        console.log(`Value ${value} - Index: ${result.index}, Time: ${result.time}ms`);
    });
    
    console.log("\nBinary Search:");
    testValues.forEach(value => {
        let result = Searching.binarySearch(sortedArray, value);
        console.log(`Value ${value} - Index: ${result.index}, Time: ${result.time}ms`);
    });
    mainMenu();
}

function generateReport() {
    console.log("\nGenerating Performance Report...");
    
    let bubbleSortResult = Sorting.bubbleSort(numArray.numbers);
    let startQuick = Date.now();
    let quickSortedArray = Sorting.quickSort(numArray.numbers);
    let endQuick = Date.now();
    let quickSortTime = endQuick - startQuick;
    
    let testValues = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    
    console.log("\nSorting Performance:");
    console.log(`Bubble Sort Time: ${bubbleSortResult.time}ms`);
    console.log(`Quick Sort Time: ${quickSortTime}ms`);
    
    console.log("\nSearching Performance:");
    testValues.forEach(value => {
        let linearResult = Searching.linearSearch(numArray.numbers, value);
        let binaryResult = Searching.binarySearch(quickSortedArray, value);
        console.log(`Value ${value}: Linear Search Time: ${linearResult.time}ms, Binary Search Time: ${binaryResult.time}ms`);
    });
    
    mainMenu();
}

mainMenu();
