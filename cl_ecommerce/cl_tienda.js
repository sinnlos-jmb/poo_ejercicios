const fs = require("fs");
const path = require('path');

const cl_prd = require("./cl_producto");

const prd=new cl_prd.Producto();

const readline2 = require("readline");
const rl1 = readline2.createInterface({
    input: process.stdin,
    output: process.stdout
});


class Tienda {

    static productos=[];
    static registro_ventas=[];
    static empleadoActivo;
    static adminEmpleados;
    static carro;
    static Menu;
    constructor(adminEmpleados, carro, p_menu) {
        Tienda.productos = prd.cargarProductos();
        console.log("cargo prds de json: "+Tienda.productos);
        Tienda.registro_ventas = this.loadSales();
        Tienda.adminEmpleados = adminEmpleados;
        Tienda.carro = carro;
        Tienda.empleadoActivo = null;
        Tienda.Menu=p_menu;
        

    }

    static setMenu(p_menu) {
     Tienda.Menu=p_menu;
    }

    loadSales() {
        try {
            return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/reporte_ventas.json')));
        } catch (error) {
            return [];
        }
    }

    static saveSales() {
        fs.writeFileSync(path.resolve(__dirname, '../data/reporte_ventas.json'), JSON.stringify(Tienda.registro_ventas, null, 2));
    }

    static mostrarProductos() {
        console.log("\n=== Productos ===");
        Tienda.productos.forEach((producto, index) => {
            console.log(`${index + 1}. ${producto.getDetalles()} - $${producto.precio} (Stock: ${producto.stock})`);
        });
    }


    static addProductByType(selectedType, marca, modelo, precio, stock, p_menu) {
        switch(selectedType.nombre) {
            case 'Pantalon':
                rl1.question("ancho: ", (ancho) => {
                    rl1.question("largo: ", (largo) => {
                        const nuevoProducto = new selectedType.class(
                        marca, 
                        modelo, 
                        parseFloat(precio), 
                        parseInt(stock),
                        ancho,
                        largo
                    );
                    Tienda.almacenarProducto(nuevoProducto, p_menu);
                });
            });
            break;
            
            case 'Calzado':
                rl1.question("Ingresar talles: ", (talles) => {
                    rl1.question("Ingresar material: ", (material) => {
                        const nuevoProducto = new selectedType.class(
                            marca, 
                            modelo, 
                            parseFloat(precio), 
                            parseInt(stock),
                            talles,
                            material
                        );
                        Tienda.almacenarProducto(nuevoProducto, p_menu);
                    });
                });
                break;
            
            case 'Campera':
                rl1.question("Ingresar temporada: ", (temporada) => {
                    rl1.question("Ingresar talles: ", (talles) => {
                        rl1.question("Ingresar color: ", (color) => {
                            const nuevoProducto = new selectedType.class(
                            marca, 
                            modelo, 
                            parseFloat(precio), 
                            parseInt(stock),
                            temporada,
                            talles,
                            color
                        );
                        Tienda.almacenarProducto(nuevoProducto, p_menu);
                        
                    });
                });
            });
                break;
        }
        
    }

    static almacenarProducto(nuevoProducto, p_menu) {
        Tienda.productos.push(nuevoProducto);
        cl_prd.Producto.guardarProductos(Tienda.productos);
        console.log("\n✅ Producto agregado exitosamente!");
        console.log(`Detalles: ${nuevoProducto.getDetalles()}\n`);
        Tienda.Menu.menuPrincipal();
    }

    static seleccionarEmpleado(p_menu) {
        Tienda.adminEmpleados.mostrarEmpleados();
        rl1.question("Seleccionar nro de empleado: ", (index) => {
            Tienda.empleadoActivo = this.adminEmpleados.empleados[parseInt(index) - 1];
            console.log(`\n Empleado a cargo: ${Tienda.empleadoActivo.nombre}\n`);
            Tienda.menuOperaciones(p_menu);
        });
    }

    static mostrarReporte() {
        console.log("\n=== Reporte ===");
        console.log(JSON.stringify(Tienda.registro_ventas, null, 2));
    }

    static menuOperaciones(p_menu) {
        //Tienda.Menu.menuPrincipal();
        console.log("\n=== Operaciones ===");
        console.log("1. Agregar al carro");
        console.log("2. Mostrar contenido del carro");
        console.log("3. Checkout");
        console.log("4. Logout");
        
        rl1.question("Seleccionar una opcion: ", (opc) => {
            //console.log("menu: "+p_menu.menuPrincipal());
            switch (opc) {
                case "1":
                    Tienda.mostrarProductos();
                    rl1.question("Seleccione numero de producto: ", (index) => {
                        rl1.question("Ingrese cantidad: ", (cantidad) => {
                            Tienda.carro.agregarItem(
                                Tienda.productos[parseInt(index) - 1], 
                                parseInt(cantidad)
                            );
                            Tienda.menuOperaciones();
                        });
                    });
                    break;
                case "2":
                    Tienda.carro.mostrarCarro();
                    Tienda.menuOperaciones();
                    break;
                case "3":
                    Tienda.carro.checkout(Tienda);
                    Tienda.Menu.menuPrincipal();
                    break;
                case "4":
                    Tienda.empleadoActivo = null;
                    Tienda.Menu.menuPrincipal();
                    break;
                default:
                    Tienda.menuOperaciones();
            }
        });
    }
}

module.exports = {Tienda, rl1 }