const fs = require("fs");
const path = require('path');

const cl_prd = require("./cl_producto");
const cl_menu = require("./cl_menu");
const cl_carro = require("./cl_carro");

const prd=new cl_prd.Producto();
const readline2 = require("readline");


class Tienda {

    static productos=[];
    static registro_ventas=[];
    static empleadoActivo;
    static adminEmpleados;
    static carro= new cl_carro.Carro();
    constructor(adminEmpleados, carro) {
        Tienda.productos = prd.cargarProductos();
        console.log("cargo prds de json: "+Tienda.productos);
        Tienda.registro_ventas = this.loadSales();
        Tienda.adminEmpleados = adminEmpleados;
        Tienda.carro = carro;
        Tienda.empleadoActivo = null;
        //this.mn=new cl_menu.Menu();
        //console.log("constructor de tienda, carga menu? "+this.mn.msg);

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


    static addProductByType(selectedType, marca, modelo, precio, stock, rl1, menu) {

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
                    Tienda.almacenarProducto(nuevoProducto, menu);
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
                        Tienda.almacenarProducto(nuevoProducto, menu);
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
                        Tienda.almacenarProducto(nuevoProducto, menu);
                        
                    });
                });
            });
            break;
        }
        
    }

    static almacenarProducto(nuevoProducto, menu) {
        menu.vec_prds.push(nuevoProducto);
        cl_prd.Producto.guardarProductos(menu.vec_prds);
        console.log("\n✅ Producto agregado exitosamente!");
        console.log(`Detalles: ${nuevoProducto.getDetalles()}\n`);
        menu.menuPrincipal();
    }

    static seleccionarEmpleado(rl1, mn, adminEmps) {
        adminEmps.mostrarEmpleados();
        rl1.question("Seleccionar nro de empleado: ", (index) => {
            Tienda.empleadoActivo = adminEmps.empleados[parseInt(index) - 1];
            console.log(`\n Empleado a cargo: ${Tienda.empleadoActivo.nombre}\n`);
            Tienda.menuOperaciones(rl1, mn);
        });
    }

    static mostrarReporte() {
        console.log("\n=== Reporte ===");
        console.log(JSON.stringify(Tienda.registro_ventas, null, 2));
    }

    static menuOperaciones(rl1, mn) {
        console.log("\n=== Operaciones ===");
        console.log("1. Agregar al carro");
        console.log("2. Mostrar contenido del carro");
        console.log("3. Checkout");
        console.log("4. Logout");
        
        rl1.question("Seleccionar una opcion: ", (opc) => {
            //console.log("menu: "+p_menu.menuPrincipal());
            switch (opc) {
                case "1":
                    prd.mostrarProductos(mn.vec_prds);
                    rl1.question("Seleccione numero de producto: ", (index) => {
                        rl1.question("Ingrese cantidad: ", (cantidad) => {
                            Tienda.carro.agregarItem(
                                mn.vec_prds[parseInt(index) - 1], 
                                parseInt(cantidad)
                            );
                            Tienda.menuOperaciones(rl1, mn);
                        });
                    });

                    break;
                case "2":
                    Tienda.carro.mostrarCarro();
                    Tienda.menuOperaciones(rl1, mn);
                    break;
                case "3":
                    Tienda.productos=mn.vec_prds;
                    Tienda.carro.checkout(Tienda);
                    mn.menuPrincipal();
                    break;
                case "4":
                    Tienda.empleadoActivo = null;
                    mn.menuPrincipal();
                    break;
                default:
                    Tienda.menuOperaciones(rl1, mn);
            }

        });
    }
}

module.exports = {Tienda }