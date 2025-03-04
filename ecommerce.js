const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Product Class (Encapsulation)
class Product {
    #price;
    constructor(name, price, stock) {
        this.name = name;
        this.#price = price;
        this.stock = stock;
    }
    getPrice() {
        return this.#price;
    }
    updateStock(quantity) {
        this.stock -= quantity;
    }
}

// Inheritance Example (Perishable Product)
class PerishableProduct extends Product {
    constructor(name, price, stock, expirationDate) {
        super(name, price, stock);
        this.expirationDate = expirationDate;
    }
}

// Store Class (Encapsulation & Abstraction)
class Store {
    #transactions = [];
    constructor() {
        this.products = [];
    }
    addProduct(product) {
        this.products.push(product);
    }
    listProducts() {
        console.log("\nAvailable Products:");
        this.products.forEach((p, index) => {
            console.log(`${index + 1}. ${p.name} - $${p.getPrice()} - Stock: ${p.stock}`);
        });
    }
    buyProduct(index, quantity) {
        const product = this.products[index];
        if (product && product.stock >= quantity) {
            product.updateStock(quantity);
            const total = product.getPrice() * quantity;
            this.#transactions.push({ name: product.name, quantity, total });
            console.log(`\n✅ Purchase successful! Total: $${total}\n`);
        } else {
            console.log("\n❌ Insufficient stock!\n");
        }
    }
    generateReport() {
        console.log("\n📊 Day's Sales Report:");
        let totalSales = 0;
        this.#transactions.forEach((t, index) => {
            console.log(`${index + 1}. ${t.name} - ${t.quantity} pcs - $${t.total}`);
            totalSales += t.total;
        });
        console.log(`\n💰 Total Sales: $${totalSales}\n`);
    }
}

const store = new Store();

function mainMenu() {
    console.log("\nSelect an action:");
    console.log("1. Add Product");
    console.log("2. List Products");
    console.log("3. Register Purchase");
    console.log("4. Close Day");
    console.log("5. Generate Report");
    console.log("6. Exit");
    rl.question("Enter choice: ", (choice) => {
        if (choice === "1") {
            rl.question("Product Name: ", (name) => {
                rl.question("Product Price: ", (price) => {
                    rl.question("Stock Quantity: ", (stock) => {
                        store.addProduct(new Product(name, parseFloat(price), parseInt(stock)));
                        console.log("\n✅ Product added!\n");
                        mainMenu();
                    });
                });
            });
        } else if (choice === "2") {
            store.listProducts();
            mainMenu();
        } else if (choice === "3") {
            store.listProducts();
            rl.question("Enter product number: ", (index) => {
                rl.question("Quantity to buy: ", (quantity) => {
                    store.buyProduct(parseInt(index) - 1, parseInt(quantity));
                    mainMenu();
                });
            });
        } else if (choice === "4") {
            console.log("\n🛒 Store is now closed!\n");
            rl.close();
        } else if (choice === "5") {
            store.generateReport();
            mainMenu();
        } else if (choice === "6") {
            console.log("\n👋 Exiting program!\n");
            rl.close();
        } else {
            console.log("\n❌ Invalid choice! Try again.\n");
            mainMenu();
        }
    });
}

mainMenu();
