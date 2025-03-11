const fs = require("fs");
const path = require('path');

const cl_prd = require("./cl_producto");
const prd=new cl_prd.Producto;


class Tienda {
    constructor(p_adminEmps, p_carro) {
        this.registro_ventas=this.loadSales();
        this.productos = prd.cargarProductos();
        this.empleadoActivo=null;
        this.adminEmpleados=p_adminEmps;
        this.carro = p_carro;
        this.prd=new cl_prd.Producto();
    }


    loadSales() {
        try {
            return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/reporte_ventas.json')));
        } catch (error) {
            return [];
        }
    }

    saveSales() {
        fs.writeFileSync(path.resolve(__dirname, '../data/reporte_ventas.json'), JSON.stringify(this.registro_ventas, null, 2));
    }

    mostrarProductos() {
        console.log("\n=== Productos ===");
        this.productos.forEach((producto, index) => {
            console.log(`${index + 1}. ${producto.getDetalles()} - $${producto.precio} (Stock: ${producto.stock})`);
        });
    }


     addProductByType(selectedType, marca, modelo, precio, stock, rl1, menu) {

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
                    this.almacenarProducto(nuevoProducto, menu);
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
                        this.almacenarProducto(nuevoProducto, menu);
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
                        this.almacenarProducto(nuevoProducto, menu);
                    });
                });
            });
            break;
        }
    }


    almacenarProducto(nuevoProducto, menu) {
        menu.vec_prds.push(nuevoProducto);
        this.prd.guardarProductos(menu.vec_prds);
        console.log("\n✅ Producto agregado exitosamente!");
        console.log(`Detalles: ${nuevoProducto.getDetalles()}\n`);
        menu.menuPrincipal();
    }

    seleccionarEmpleado(rl1, mn, adminEmps) {
        adminEmps.mostrarEmpleados();
        rl1.question("Seleccionar nro de empleado: ", (index) => {
            this.empleadoActivo = adminEmps.empleados[parseInt(index) - 1];
            console.log(`\n Empleado a cargo: ${this.empleadoActivo.nombre}\n`);
            this.menuOperaciones(rl1, mn);
        });
    }

    mostrarReporte() {
        console.log("\n=== Reporte ===");
        console.log(JSON.stringify(this.registro_ventas, null, 2));
    }

    menuOperaciones(rl1, mn) {
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
                            this.carro.agregarItem(
                                mn.vec_prds[parseInt(index) - 1], 
                                parseInt(cantidad)
                            );
                            this.menuOperaciones(rl1, mn);
                        });
                    });
                    break;
                case "2":
                    this.carro.mostrarCarro();
                    this.menuOperaciones(rl1, mn);
                    break;
                case "3":
                    this.productos=mn.vec_prds;
                    this.saveSales(this.carro.checkout(this.productos, this.empleadoActivo, this.registro_ventas));
                    this.registro_ventas=this.loadSales();
                    mn.menuPrincipal();
                    break;
                case "4":
                    this.empleadoActivo = null;
                    mn.menuPrincipal();
                    break;
                default:
                    this.menuOperaciones(rl1, mn);
            }
        });
    }
}

module.exports = {Tienda }