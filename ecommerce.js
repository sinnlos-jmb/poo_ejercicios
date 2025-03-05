const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Person {
    constructor(name) {
        this.name = name;
    }
}

class Employee extends Person {
    constructor(name, role) {
        super(name);
        this.role = role;
    }
}

class EmployeeManager {
    constructor() {
        this.employees = this.loadEmployees();
    }

    loadEmployees() {
        try {
            return JSON.parse(fs.readFileSync("employees.json"));
        } catch (error) {
            return [];
        }
    }

    saveEmployees() {
        fs.writeFileSync("employees.json", JSON.stringify(this.employees, null, 2));
    }

    addEmployee(employee) {
        this.employees.push(employee);
        this.saveEmployees();
        console.log("\n✅ Employee added!\n");
    }

    listEmployees() {
        console.log("\n=== Employee List ===");
        this.employees.forEach((employee, index) => {
            console.log(`${index + 1}. ${employee.name} - ${employee.role}`);
        });
    }
}

class Product {
    constructor(name, brand, model, price, stock) {
        this.name = name;
        this.brand = brand;
        this.model = model;
        this.price = price;
        this.stock = stock;
    }
}

class Shoes extends Product {
    constructor(name, brand, model, price, stock, size) {
        super(name, brand, model, price, stock);
        this.size = size;
    }
}

class Shirt extends Product {
    constructor(name, brand, model, price, stock, size) {
        super(name, brand, model, price, stock);
        this.size = size;
    }
}

class Coat extends Product {
    constructor(name, brand, model, price, stock, material) {
        super(name, brand, model, price, stock);
        this.material = material;
    }
}

class Trousers extends Product {
    constructor(name, brand, model, price, stock, waistSize) {
        super(name, brand, model, price, stock);
        this.waistSize = waistSize;
    }
}

class Socks extends Product {
    constructor(name, brand, model, price, stock, length) {
        super(name, brand, model, price, stock);
        this.length = length;
    }
}

class Hat extends Product {
    constructor(name, brand, model, price, stock, circumference) {
        super(name, brand, model, price, stock);
        this.circumference = circumference;
    }
}

class Cart {
    constructor() {
        this.items = [];
    }

    addToCart(product, quantity) {
        this.items.push({ product, quantity });
        console.log("\n✅ Product added to cart!\n");
    }

    listCart() {
        console.log("\n=== Cart Contents ===");
        this.items.forEach((item, index) => {
            console.log(`${index + 1}. ${item.product.name} - Quantity: ${item.quantity}`);
        });
    }

    checkout(store) {
        let total = 0;
        this.items.forEach(({ product, quantity }) => {
            let productIndex = store.products.findIndex(p => p.name === product.name);
            if (productIndex !== -1 && store.products[productIndex].stock >= quantity) {
                store.products[productIndex].stock -= quantity;
                total += product.price * quantity;
            }
        });
        store.saveProducts();
        store.sales.push({ employee: currentEmployee.name, items: this.items, total });
        store.saveSales();
        console.log(`\n🛒 Checkout Complete! Total: $${total}\n`);
        this.items = [];
    }
}

class Store {
    constructor() {
        this.products = this.loadProducts();
        this.sales = this.loadSales();
    }

    loadProducts() {
        try {
            return JSON.parse(fs.readFileSync("products.json"));
        } catch (error) {
            return [];
        }
    }

    saveProducts() {
        fs.writeFileSync("products.json", JSON.stringify(this.products, null, 2));
    }

    loadSales() {
        try {
            return JSON.parse(fs.readFileSync("sales.json"));
        } catch (error) {
            return [];
        }
    }

    saveSales() {
        fs.writeFileSync("sales.json", JSON.stringify(this.sales, null, 2));
    }

    listProducts() {
        console.log("\n=== Product List ===");
        this.products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ${product.brand} - ${product.price} - Stock: ${product.stock}`);
        });
    }
}

let currentEmployee = null;
let cart = new Cart();
const store = new Store();
const employeeManager = new EmployeeManager();

function storeMenu() {
    console.log("\n=== Store Menu ===");
    console.log("1. Add Product to Cart");
    console.log("2. List Cart Items");
    console.log("3. Checkout");
    console.log("4. Show Report");
    console.log("5. Logout");
    console.log("6. Exit");
    rl.question("Enter choice: ", function(choice) {
        if (choice === "1") {
            store.listProducts();
            rl.question("Select product number: ", function(index) {
                rl.question("Enter quantity: ", function(quantity) {
                    cart.addToCart(store.products[parseInt(index) - 1], parseInt(quantity));
                    storeMenu();
                });
            });
        } else if (choice === "2") {
            cart.listCart();
            storeMenu();
        } else if (choice === "3") {
            cart.checkout(store);
            storeMenu();
        } else if (choice === "4") {
            console.log("\n=== Sales Report ===");
            console.log(store.sales);
            storeMenu();
        } else if (choice === "5") {
            mainMenu();
        } else if (choice === "6") {
            console.log("\n👋 Exiting program!");
            rl.close();
        } else {
            console.log("\n❌ Invalid choice! Try again.");
            storeMenu();
        }
    });
}

function mainMenu() {
    console.log("\n=== Main Menu ===");
    console.log("1. Add Employee");
    console.log("2. List Employees");
    console.log("3. Select Employee");
    console.log("4. Exit");
    rl.question("Enter choice: ", function(choice) {
        if (choice === "1") {
            rl.question("Enter Employee Name: ", function(name) {
                rl.question("Enter Role: ", function(role) {
                    employeeManager.addEmployee(new Employee(name, role));
                    mainMenu();
                });
            });
        } else if (choice === "2") {
            employeeManager.listEmployees();
            mainMenu();
        } else if (choice === "3") {
            employeeManager.listEmployees();
            rl.question("Select employee number: ", function(index) {
                currentEmployee = employeeManager.employees[parseInt(index) - 1];
                if (currentEmployee) {
                    console.log(`\n✅ ${currentEmployee.name} selected!\n`);
                    storeMenu();
                } else {
                    console.log("❌ Invalid selection.");
                    mainMenu();
                }
            });
        } else if (choice === "4") {
            console.log("\n👋 Exiting program!");
            rl.close();
        } else {
            console.log("\n❌ Invalid choice! Try again.");
            mainMenu();
        }
    });
}

mainMenu();
