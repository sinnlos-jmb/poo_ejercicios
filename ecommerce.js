const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


class Producto {
    constructor(marca, modelo, precio, stock) {
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
        this.stock = stock;
        this.tipo = "";
    }

    getDetails() {
        return `${this.marca} ${this.modelo}`;
    }

    // Static method to reconstruct the correct product type
    static reconstruct(productData) {
        // Determine the product type based on additional properties
        if (productData.warrantyYears !== undefined) {
            return Object.assign(new Electronics(), productData);
        } else if (productData.talle !== undefined) {
            return Object.assign(new Clothing(), productData);
        } else if (productData.dimensions !== undefined) {
            return Object.assign(new Furniture(), productData);
        }
        // Default to base Product if no specific type is found
        return Object.assign(new Producto(), productData);
    }
}

// Subclasses de Producto
class Electronics extends Producto {
    constructor(marca, modelo, precio, stock, warrantyYears) {
        super(marca, modelo, precio, stock);
        this.warrantyYears = warrantyYears;
        this.category = 'Electronics';
    }

    getDetails() {
        return `${super.getDetails()} (${this.category}) - Warranty: ${this.warrantyYears} years`;
    }
}

class Clothing extends Producto {
    constructor(marca, modelo, precio, stock, talle, material) {
        super(marca, modelo, precio, stock);
        this.talle = talle;
        this.material = material;
        this.category = 'Clothing';
    }

    getDetails() {
        return `${super.getDetails()} (${this.category}) - talle: ${this.talle}, Material: ${this.material}`;
    }
}

class Furniture extends Producto {
    constructor(marca, modelo, precio, stock, dimensions, color) {
        super(marca, modelo, precio, stock);
        this.dimensions = dimensions;
        this.color = color;
        this.category = 'Furniture';
    }

    getDetails() {
        return `${super.getDetails()} (${this.category}) - Dimensions: ${this.dimensions}, Color: ${this.color}`;
    }
}

class Empleado {
    constructor(nombre, rol) {
        this.nombre = nombre;
        this.rol = rol;
    }
}

class AdminEmpleados {
    constructor() {
        this.empleados = this.cargarEmpleados();
    }

    cargarEmpleados() {
        try {
            return JSON.parse(fs.readFileSync("empleados.json"));
        } catch (error) {
            return [];
        }
    }

    guardarEmpleados() {
        fs.writeFileSync("empleados.json", JSON.stringify(this.empleados, null, 2));
    }

    addEmpleado(emp) {
        this.empleados.push(emp);
        this.guardarEmpleados();
        console.log("\n✅ Empleado agregado!\n");
    }

    mostrarEmpleados() {
        console.log("\n=== Empleados ===");
        this.empleados.forEach((empleado, index) => {
            console.log(`${index + 1}. ${empleado.nombre} - ${empleado.rol}`);
        });
    }
}

class Carro {
    constructor() {
        this.items = [];
    }

    agregarItem(producto, cantidad) {
        this.items.push({ producto, cantidad });
        console.log("\n✅ Producto agregado al carro!\n");
    }

    mostrarCarro() {
        console.log("\n=== Contenido del carro de compras ===");
        this.items.forEach((item, index) => {
            console.log(`${index + 1}. ${item.producto.getDetails()} - Cantidad: ${item.cantidad}`);
        });
    }

    checkout(tienda) {
        let total = 0;
        this.items.forEach(({ producto, cantidad }) => {
            let productIndex = tienda.productos.findIndex(p => 
                p.marca === producto.marca && 
                p.modelo === producto.modelo
            );
            if (productIndex !== -1 && tienda.productos[productIndex].stock >= cantidad) {
                tienda.productos[productIndex].stock -= cantidad;
                total += producto.precio * cantidad;
            }
        });
        tienda.sales.push({ 
            empleado: tienda.empleadoActivo.nombre, 
            items: this.items, 
            total 
        });
        tienda.guardarProductos();
        tienda.saveSales();
        console.log(`\n🛒 Checkout Realizado! Total: $${total}\n`);
        this.items = [];
    }
}

class Tienda {
    constructor(adminEmpleados, carro) {
        this.productos = this.cargarProductos();
        this.sales = this.loadSales();
        this.adminEmpleados = adminEmpleados;
        this.carro = carro;
        this.empleadoActivo = null;
        
        // Available product types
        this.productTypes = [
            { nombre: 'Electronics', class: Electronics },
            { nombre: 'Clothing', class: Clothing },
            { nombre: 'Furniture', class: Furniture }
        ];
    }

    cargarProductos() {
        try {
            // Parse JSON and reconstruct each product to its correct type
            const rawProducts = JSON.parse(fs.readFileSync("productos.json"));
            return rawProducts.map(productData => Producto.reconstruct(productData));
        } catch (error) {
            return [];
        }
    }

    guardarProductos() {
        fs.writeFileSync("productos.json", JSON.stringify(this.productos, null, 2));
    }

    loadSales() {
        try {
            return JSON.parse(fs.readFileSync("reporte_ventas.json"));
        } catch (error) {
            return [];
        }
    }

    saveSales() {
        fs.writeFileSync("reporte_ventas.json", JSON.stringify(this.sales, null, 2));
    }

    mostrarProductos() {
        console.log("\n=== Productos ===");
        this.productos.forEach((producto, index) => {
            console.log(`${index + 1}. ${producto.getDetails()} - $${producto.precio} (Stock: ${producto.stock})`);
        });
    }

    agregarProducto() {
        // List available product types
        console.log("\n=== Seleccionar tipo de producto ===");
        this.productTypes.forEach((type, index) => {
            console.log(`${index + 1}. ${type.nombre}`);
        });

        rl.question("Seleccionar tipo de producto: ", (typeChoice) => {
            const selectedType = this.productTypes[parseInt(typeChoice) - 1];
            
            if (!selectedType) {
                console.log("Tipo de producto seleccionado es invalido.");
                mainMenu();
                return;
            }

            // Common product details... preguntar primero type
            rl.question("Ingrese marca del producto: ", (marca) => {
                rl.question("Ingrese modelo del producto: ", (modelo) => {
                    rl.question("Ingrese precio: ", (precio) => {
                        rl.question("Enter stock cantidad: ", (stock) => {
                            // Additional details based on product type
                            this.addProductByType(selectedType, marca, modelo, precio, stock);
                        });
                    });
                });
            });
        });
    }

    addProductByType(selectedType, marca, modelo, precio, stock) {
        switch(selectedType.nombre) {
            case 'Electronics':
                rl.question("Ingresar años de garantia: ", (warrantyYears) => {
                    const nuevoProducto = new selectedType.class(
                        marca, 
                        modelo, 
                        parseFloat(precio), 
                        parseInt(stock),
                        parseInt(warrantyYears)
                    );
                    this.almacenarProducto(nuevoProducto);
                });
                break;
            
            case 'Clothing':
                rl.question("Ingresar talle: ", (talle) => {
                    rl.question("Ingresar material: ", (material) => {
                        const nuevoProducto = new selectedType.class(
                            marca, 
                            modelo, 
                            parseFloat(precio), 
                            parseInt(stock),
                            talle,
                            material
                        );
                        this.almacenarProducto(nuevoProducto);
                    });
                });
                break;
            
            case 'Furniture':
                rl.question("Ingresar dimensiones: ", (dimensions) => {
                    rl.question("Ingresar color: ", (color) => {
                        const nuevoProducto = new selectedType.class(
                            marca, 
                            modelo, 
                            parseFloat(precio), 
                            parseInt(stock),
                            dimensions,
                            color
                        );
                        this.almacenarProducto(nuevoProducto);
                    });
                });
                break;
        }
    }

    almacenarProducto(nuevoProducto) {
        this.productos.push(nuevoProducto);
        this.guardarProductos();
        console.log("\n✅ Producto agregado exitosamente!");
        console.log(`Detalles: ${nuevoProducto.getDetails()}\n`);
        mainMenu();
    }

    seleccionarEmpleado() {
        this.adminEmpleados.mostrarEmpleados();
        rl.question("Seleccionar nro de empleado: ", (index) => {
            this.empleadoActivo = this.adminEmpleados.empleados[parseInt(index) - 1];
            console.log(`\n👤 Logged in as: ${this.empleadoActivo.nombre}\n`);
            this.menuOperaciones();
        });
    }

    mostrarReporte() {
        console.log("\n=== Reporte ===");
        console.log(JSON.stringify(this.sales, null, 2));
        mainMenu();
    }

    menuOperaciones() {
        console.log("\n=== Operaciones ===");
        console.log("1. Agregar al carro");
        console.log("2. Mostrar contenido del carro");
        console.log("3. Checkout");
        console.log("4. Logout");
        
        rl.question("Seleccionar una opcion: ", (opc) => {
            switch (opc) {
                case "1":
                    this.mostrarProductos();
                    rl.question("Seleccione numero de producto: ", (index) => {
                        rl.question("Ingrese cantidad: ", (cantidad) => {
                            this.carro.agregarItem(
                                this.productos[parseInt(index) - 1], 
                                parseInt(cantidad)
                            );
                            this.menuOperaciones();
                        });
                    });
                    break;
                case "2":
                    this.carro.mostrarCarro();
                    this.menuOperaciones();
                    break;
                case "3":
                    this.carro.checkout(this);
                    this.menuOperaciones();
                    break;
                case "4":
                    this.empleadoActivo = null;
                    mainMenu();
                    break;
                default:
                    this.menuOperaciones();
            }
        });
    }
}

const adminEmpleados = new AdminEmpleados();
const carro = new Carro();
const tienda = new Tienda(adminEmpleados, carro);

function mainMenu() {
    console.log("\n=== Main Menu ===");
    console.log("1. Nuevo empleado");
    console.log("2. Lista de empleados");
    console.log("3. Cargar nuevas ventas");
    console.log("4. Nuevo Producto");
    console.log("5. Lista de productos");
    console.log("6. Reporte de ventas");
    console.log("7. Salir");
    rl.question("Seleccione una opcion: ", function (choice) {
        switch (choice) {
            case "1":
                rl.question("Ingrese nombre del empleado: ", function(nombre) {
                    rl.question("Ingrese funcion: ", function(rol) {
                        adminEmpleados.addEmpleado(new Empleado(nombre, rol));
                        mainMenu();
                    });
                });
                break;
            case "2":
                adminEmpleados.mostrarEmpleados();
                mainMenu();
                break;
            case "3":
                tienda.seleccionarEmpleado();
                break;
            case "4":
                tienda.agregarProducto();
                break;
            case "5":
                tienda.mostrarProductos();
                mainMenu();
                break;
            case "6":
                tienda.mostrarReporte();
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