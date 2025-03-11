
const cl_tienda = require("./cl_tienda");
const cl_empleado = require("./cl_empleado");
const cl_carro = require("./cl_carro");
const cl_prd = require("./cl_producto");


    const adminEmpleados = new cl_empleado.AdminEmpleados();
    const carro = new cl_carro.Carro();
    //console.log("genero tienda!");
    const tienda = new cl_tienda.Tienda(adminEmpleados, carro );
    //console.log("datos del objeto tienda: "+tienda.productos);

    class Menu {

     static menu="\n=== Menu Principal ===   \n"+
                "1. Nuevo empleado\n"+
                "2. Lista de empleados\n"+
                "3. Cargar nuevas ventas\n"+
                "4. Nuevo Producto\n"+
                "5. Lista de productos\n"+
                "6. Reporte de ventas\n"+
                "7. Salir\n";

    static menuPrincipal() {
        
        console.log(Menu.menu);
        cl_tienda.rl1.question("Seleccione una opcion: ", function (choice) {
            cl_tienda.Tienda.setMenu(Menu);
            switch (choice) {
                case "1":
                    cl_tienda.rl1.question("Ingrese nombre del empleado: ", function(nombre) {
                        cl_tienda.rl1.question("Ingrese funcion: ", function(rol) {
                            adminEmpleados.addEmpleado(new cl_empleado.Empleado(nombre, rol));
                            Menu.menuPrincipal();
                        });
                    });
                    break;
                case "2":
                    adminEmpleados.mostrarEmpleados();
                    Menu.menuPrincipal();
                    break;
                case "3":
                    cl_tienda.Tienda.seleccionarEmpleado(Menu);
                    break;
                case "4":
                    console.log("\n=== Seleccionar tipo de producto ===");
                    cl_prd.setProductTypes();
                    cl_prd.productTypes.forEach((type, index) => {
                        console.log(`${index + 1}. ${type.nombre}`);
                    });
            
                    cl_tienda.rl1.question("Seleccionar tipo de producto: ", (typeChoice) => {
                        const selectedType = cl_prd.productTypes[parseInt(typeChoice) - 1];
                        
                        if (!selectedType) {
                            console.log("Tipo de producto seleccionado es invalido.");
                            return;
                        }
            
                        // Common product details... preguntar primero type
                        cl_tienda.rl1.question("Ingrese marca del producto: ", (marca) => {
                            cl_tienda.rl1.question("Ingrese modelo del producto: ", (modelo) => {
                                cl_tienda.rl1.question("Ingrese precio: ", (precio) => {
                                    cl_tienda.rl1.question("Enter stock cantidad: ", (stock) => {
                                        // Additional details based on product type
                                        cl_tienda.Tienda.addProductByType(selectedType, marca, modelo, precio, stock, Menu);
                    
                                    });
                                });
                            });
                        });
                    });
                    
                    break;
                case "5":
                    cl_tienda.Tienda.mostrarProductos();
                    Menu.menuPrincipal();
                    break;
                case "6":
                    cl_tienda.Tienda.mostrarReporte();
                    Menu.menuPrincipal();
                    break;
                case "7":
                    console.log("Cerrando programa.");
                    cl_tienda.rl1.close();
                    break;
                default:
                    Menu.menuPrincipal();
            }
        });
    }
}

module.exports = { Menu }