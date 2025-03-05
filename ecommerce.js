const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Base Product class (atributo tipo en vez de subclases?)
class Product {
    constructor(brand, model, price, stock) {
        this.brand = brand;
        this.model = model;
        this.price = price;
        this.stock = stock;
    }

    getDetails() {
        return `${this.brand} ${this.model}`;
    }

    // Static method to reconstruct the correct product type
    static reconstruct(productData) {
        // Determine the product type based on additional properties
        if (productData.warrantyYears !== undefined) {
            return Object.assign(new Electronics(), productData);
        } else if (productData.size !== undefined) {
            return Object.assign(new Clothing(), productData);
        } else if (productData.dimensions !== undefined) {
            return Object.assign(new Furniture(), productData);
        }
        // Default to base Product if no specific type is found
        return Object.assign(new Product(), productData);
    }
}

// Subclasses of Product
class Electronics extends Product {
    constructor(brand, model, price, stock, warrantyYears) {
        super(brand, model, price, stock);
        this.warrantyYears = warrantyYears;
        this.category = 'Electronics';
    }

    getDetails() {
        return `${super.getDetails()} (${this.category}) - Warranty: ${this.warrantyYears} years`;
    }
}

class Clothing extends Product {
    constructor(brand, model, price, stock, size, material) {
        super(brand, model, price, stock);
        this.size = size;
        this.material = material;
        this.category = 'Clothing';
    }

    getDetails() {
        return `${super.getDetails()} (${this.category}) - Size: ${this.size}, Material: ${this.material}`;
    }
}

class Furniture extends Product {
    constructor(brand, model, price, stock, dimensions, color) {
        super(brand, model, price, stock);
        this.dimensions = dimensions;
        this.color = color;
        this.category = 'Furniture';
    }

    getDetails() {
        return `${super.getDetails()} (${this.category}) - Dimensions: ${this.dimensions}, Color: ${this.color}`;
    }
}

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
        this.employees.push(emp);
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
            console.log(`${index + 1}. ${item.product.getDetails()} - Quantity: ${item.quantity}`);
        });
    }

    checkout(store) {
        let total = 0;
        this.items.forEach(({ product, quantity }) => {
            let productIndex = store.products.findIndex(p => 
                p.brand === product.brand && 
                p.model === product.model
            );
            if (productIndex !== -1 && store.products[productIndex].stock >= quantity) {
                store.products[productIndex].stock -= quantity;
                total += product.price * quantity;
            }
        });
        store.sales.push({ 
            employee: store.currentEmployee.name, 
            items: this.items, 
            total 
        });
        store.saveProducts();
        store.saveSales();
        console.log(`\n🛒 Checkout Complete! Total: $${total}\n`);
        this.items = [];
    }
}

class Store {
    constructor(employeeManager, cart) {
        this.products = this.loadProducts();
        this.sales = this.loadSales();
        this.employeeManager = employeeManager;
        this.cart = cart;
        this.currentEmployee = null;
        
        // Available product types
        this.productTypes = [
            { name: 'Electronics', class: Electronics },
            { name: 'Clothing', class: Clothing },
            { name: 'Furniture', class: Furniture }
        ];
    }

    loadProducts() {
        try {
            // Parse JSON and reconstruct each product to its correct type
            const rawProducts = JSON.parse(fs.readFileSync("products.json"));
            return rawProducts.map(productData => Product.reconstruct(productData));
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
            console.log(`${index + 1}. ${product.getDetails()} - $${product.price} (Stock: ${product.stock})`);
        });
    }

    addProduct() {
        // List available product types
        console.log("\n=== Select Product Type ===");
        this.productTypes.forEach((type, index) => {
            console.log(`${index + 1}. ${type.name}`);
        });

        rl.question("Choose Product Type: ", (typeChoice) => {
            const selectedType = this.productTypes[parseInt(typeChoice) - 1];
            
            if (!selectedType) {
                console.log("Invalid product type selected.");
                mainMenu();
                return;
            }

            // Common product details... preguntar primero type
            rl.question("Enter product brand: ", (brand) => {
                rl.question("Enter product model: ", (model) => {
                    rl.question("Enter price: ", (price) => {
                        rl.question("Enter stock quantity: ", (stock) => {
                            // Additional details based on product type
                            this.addProductByType(selectedType, brand, model, price, stock);
                        });
                    });
                });
            });
        });
    }

    addProductByType(selectedType, brand, model, price, stock) {
        switch(selectedType.name) {
            case 'Electronics':
                rl.question("Enter warranty years: ", (warrantyYears) => {
                    const newProduct = new selectedType.class(
                        brand, 
                        model, 
                        parseFloat(price), 
                        parseInt(stock),
                        parseInt(warrantyYears)
                    );
                    this.saveNewProduct(newProduct);
                });
                break;
            
            case 'Clothing':
                rl.question("Enter size: ", (size) => {
                    rl.question("Enter material: ", (material) => {
                        const newProduct = new selectedType.class(
                            brand, 
                            model, 
                            parseFloat(price), 
                            parseInt(stock),
                            size,
                            material
                        );
                        this.saveNewProduct(newProduct);
                    });
                });
                break;
            
            case 'Furniture':
                rl.question("Enter dimensions: ", (dimensions) => {
                    rl.question("Enter color: ", (color) => {
                        const newProduct = new selectedType.class(
                            brand, 
                            model, 
                            parseFloat(price), 
                            parseInt(stock),
                            dimensions,
                            color
                        );
                        this.saveNewProduct(newProduct);
                    });
                });
                break;
        }
    }

    saveNewProduct(newProduct) {
        this.products.push(newProduct);
        this.saveProducts();
        console.log("\n✅ Product added successfully!");
        console.log(`Details: ${newProduct.getDetails()}\n`);
        mainMenu();
    }

    selectEmployee() {
        this.employeeManager.listEmployees();
        rl.question("Select Employee Number: ", (index) => {
            this.currentEmployee = this.employeeManager.employees[parseInt(index) - 1];
            console.log(`\n👤 Logged in as: ${this.currentEmployee.name}\n`);
            this.employeeMenu();
        });
    }

    showSalesReport() {
        console.log("\n=== Sales Report ===");
        console.log(JSON.stringify(this.sales, null, 2));
        mainMenu();
    }

    employeeMenu() {
        console.log("\n=== Employee Menu ===");
        console.log("1. Add to Cart");
        console.log("2. List Cart");
        console.log("3. Checkout");
        console.log("4. Logout");
        
        rl.question("Choose an option: ", (choice) => {
            switch (choice) {
                case "1":
                    this.listProducts();
                    rl.question("Select product number: ", (index) => {
                        rl.question("Enter quantity: ", (quantity) => {
                            this.cart.addToCart(
                                this.products[parseInt(index) - 1], 
                                parseInt(quantity)
                            );
                            this.employeeMenu();
                        });
                    });
                    break;
                case "2":
                    this.cart.listCart();
                    this.employeeMenu();
                    break;
                case "3":
                    this.cart.checkout(this);
                    this.employeeMenu();
                    break;
                case "4":
                    this.currentEmployee = null;
                    mainMenu();
                    break;
                default:
                    this.employeeMenu();
            }
        });
    }
}

const employeeManager = new EmployeeManager();
const cart = new Cart();
const store = new Store(employeeManager, cart);

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
                store.selectEmployee();
                break;
            case "4":
                store.addProduct();
                break;
            case "5":
                store.listProducts();
                mainMenu();
                break;
            case "6":
                store.showSalesReport();
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

mainMenu();