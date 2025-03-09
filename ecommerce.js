const readline = require("readline");


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const cl_tienda = require("./cl_ecommerce/cl_tienda");
const cl_empleado = require("./cl_ecommerce/cl_empleado");



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
            console.log(`${index + 1}. ${item.producto.getDetalles()} - Cantidad: ${item.cantidad}`);
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
        menuPrincipal();
    }
}



const adminEmpleados = new cl_empleado.AdminEmpleados();
const carro = new Carro();
const tienda = new cl_tienda.Tienda(adminEmpleados, carro);

function menuPrincipal() {
    console.log("\n=== Menu Principal ===");
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
                        adminEmpleados.addEmpleado(new cl_empleado.Empleado(nombre, rol));
                        menuPrincipal();
                    });
                });
                break;
            case "2":
                adminEmpleados.mostrarEmpleados();
                menuPrincipal();
                break;
            case "3":
                tienda.seleccionarEmpleado();
                break;
            case "4":
                tienda.agregarProducto();
                menuPrincipal();
                break;
            case "5":
                tienda.mostrarProductos();
                menuPrincipal();
                break;
            case "6":
                tienda.mostrarReporte();
                menuPrincipal();
                break;
            case "7":
                console.log("Cerrando programa.");
                rl.close();
                break;
            default:
                menuPrincipal();
        }
    });
}

menuPrincipal();