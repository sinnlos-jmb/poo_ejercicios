const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Employee {
    constructor(name, role) {
        this.name = name;
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

    addEmployee(emp) {

        {
            this.employees.push(emp);
            this.saveEmployees();
            console.log("\n✅ Employee added!\n");
        }


    }

    listEmployees() {
        console.log("\n=== Employee List ===");
        this.employees.forEach((employee, index) => {
            console.log(`${index + 1}. ${employee.name} - ${employee.role}`);
        });
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
            console.log(`${index + 1}. ${product.brand} ${product.model} - $${product.price} (Stock: ${product.stock})`);
        });
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
            console.log(`${index + 1}. ${item.product.brand} ${item.product.model} - Quantity: ${item.quantity}`);
        });
    }

    checkout(store) {
        let total = 0;
        this.items.forEach(({ product, quantity }) => {
            let productIndex = store.products.findIndex(p => p.brand === product.brand && p.model === product.model);
            if (productIndex !== -1 && store.products[productIndex].stock >= quantity) {
                store.products[productIndex].stock -= quantity;
                total += product.price * quantity;
            }
        });
        store.sales.push({ employee: currentEmployee.name, items: this.items, total });
        store.saveProducts();
        store.saveSales();
        console.log(`\n🛒 Checkout Complete! Total: $${total}\n`);
        this.items = [];
    }
}

const employeeManager = new EmployeeManager();
const store = new Store();
const cart = new Cart();
let currentEmployee = null;

function mainMenu() {
    console.log("\n=== Main Menu ===");
    console.log("1. Add Employee");
    console.log("2. List Employees");
    console.log("3. Select Employee");
    console.log("4. Add Product");
    console.log("5. List Products");
    console.log("6. Show Sales Report");
    console.log("7. Exit");
    rl.question("Choose an option: ", function (choice) {
        switch (choice) {
            case "1":
                rl.question("Enter Employee Name: ", function(name) {
                    rl.question("Enter Role: ", function(role) {
                        employeeManager.addEmployee(new Employee(name, role));
                        mainMenu();
                    });
                });
                break;
            case "2":
                employeeManager.listEmployees();
                mainMenu();
                break;
            case "3":
                selectEmployee();
                break;
            case "4":
                addProduct();
                break;
            case "5":
                store.listProducts();
                mainMenu();
                break;
            case "6":
                showSalesReport();
                break;
            case "7":
                console.log("Exiting program.");
                rl.close();
                break;
            default:
                mainMenu();
        }
    });
}

function addProduct() {
    rl.question("Enter product brand: ", function (brand) {
        rl.question("Enter product model: ", function (model) {
            rl.question("Enter price: ", function (price) {
                rl.question("Enter stock quantity: ", function (stock) {
                    const newProduct = { brand, model, price: parseFloat(price), stock: parseInt(stock) };
                    store.products.push(newProduct);
                    store.saveProducts();
                    console.log("\n✅ Product added successfully!\n");
                    mainMenu();
                });
            });
        });
    });
}

function selectEmployee() {
    employeeManager.listEmployees();
    rl.question("Select Employee Number: ", function (index) {
        currentEmployee = employeeManager.employees[parseInt(index) - 1];
        console.log(`\n👤 Logged in as: ${currentEmployee.name}\n`);
        employeeMenu();
    });
}

function showSalesReport() {
    console.log("\n=== Sales Report ===");
    console.log(JSON.stringify(store.sales, null, 2));
    mainMenu();
}

function employeeMenu() {
    console.log("\n=== Employee Menu ===");
    console.log("1. Add to Cart");
    console.log("2. List Cart");
    console.log("3. Checkout");
    console.log("4. Logout");
    rl.question("Choose an option: ", function (choice) {
        switch (choice) {
            case "1":
                store.listProducts();
            rl.question("Select product number: ", function(index) {
                rl.question("Enter quantity: ", function(quantity) {
                    cart.addToCart(store.products[parseInt(index) - 1], parseInt(quantity));
                    employeeMenu();
                });
            });
                break;
            case "2":
                cart.listCart();
                employeeMenu();
                break;
            case "3":
                cart.checkout(store);
                employeeMenu();
                break;
            case "4":
                currentEmployee = null;
                mainMenu();
                break;
            default:
                employeeMenu();
        }
    });
}

mainMenu();
