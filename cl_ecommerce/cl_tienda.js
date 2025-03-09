const cl_prd = require("./cl_producto");
const fs = require("fs");
const path = require('path');


class Tienda {
    constructor(adminEmpleados, carro) {
        this.productos = this.cargarProductos();
        this.sales = this.loadSales();
        this.adminEmpleados = adminEmpleados;
        this.carro = carro;
        this.empleadoActivo = null;
        
        // Available product types
        this.productTypes = [
            { nombre: 'Pantalon', class: cl_prd.Pantalon },
            { nombre: 'Calzado', class: cl_prd.Calzado },
            { nombre: 'Campera', class: cl_prd.Campera }
        ];
    }

    cargarProductos() {
        try {
            // Parse JSON and reconstruct each product to its correct type
            const rawProducts = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/productos.json')));
            return rawProducts.map(productData => cl_prd.Producto.reconstruct(productData));
        } catch (error) {
            return [];
        }
    }

    guardarProductos() {
        fs.writeFileSync(path.resolve(__dirname, '../data/productos.json')), JSON.stringify(this.productos, null, 2);
    }

    loadSales() {
        try {
            return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/reporte_ventas.json')));
        } catch (error) {
            return [];
        }
    }

    saveSales() {
        fs.writeFileSync(path.resolve(__dirname, '../data/reporte_ventas.json')), JSON.stringify(this.sales, null, 2);
    }

    mostrarProductos() {
        console.log("\n=== Productos ===");
        this.productos.forEach((producto, index) => {
            console.log(`${index + 1}. ${producto.getDetalles()} - $${producto.precio} (Stock: ${producto.stock})`);
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
            case 'Pantalon':
                rl.question("ancho: ", (ancho) => {
                    rl.question("largo: ", (largo) => {
                        const nuevoProducto = new selectedType.class(
                        marca, 
                        modelo, 
                        parseFloat(precio), 
                        parseInt(stock),
                        ancho,
                        largo
                    );
                    this.almacenarProducto(nuevoProducto);
                });
            });
            break;
            
            case 'Calzado':
                rl.question("Ingresar talles: ", (talles) => {
                    rl.question("Ingresar material: ", (material) => {
                        const nuevoProducto = new selectedType.class(
                            marca, 
                            modelo, 
                            parseFloat(precio), 
                            parseInt(stock),
                            talles,
                            material
                        );
                        this.almacenarProducto(nuevoProducto);
                    });
                });
                break;
            
            case 'Campera':
                rl.question("Ingresar temporada: ", (temporada) => {
                    rl.question("Ingresar talles: ", (talles) => {
                        rl.question("Ingresar color: ", (color) => {
                            const nuevoProducto = new selectedType.class(
                            marca, 
                            modelo, 
                            parseFloat(precio), 
                            parseInt(stock),
                            temporada,
                            talles,
                            color
                        );
                        this.almacenarProducto(nuevoProducto);
                    });
                });
            });
                break;
        }
    }

    almacenarProducto(nuevoProducto) {
        this.productos.push(nuevoProducto);
        this.guardarProductos();
        console.log("\n✅ Producto agregado exitosamente!");
        console.log(`Detalles: ${nuevoProducto.getDetalles()}\n`);
    }

    seleccionarEmpleado() {
        this.adminEmpleados.mostrarEmpleados();
        rl.question("Seleccionar nro de empleado: ", (index) => {
            this.empleadoActivo = this.adminEmpleados.empleados[parseInt(index) - 1];
            console.log(`\n Empleado a cargo: ${this.empleadoActivo.nombre}\n`);
            this.menuOperaciones();
        });
    }

    mostrarReporte() {
        console.log("\n=== Reporte ===");
        console.log(JSON.stringify(this.sales, null, 2));
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
                    break;
                default:
                    this.menuOperaciones();
            }
        });
    }
}

module.exports = {Tienda }