
const cl_tienda = require("./cl_tienda");
const cl_empleado = require("./cl_empleado");
const cl_carro = require("./cl_carro");
const cl_prd = require("./cl_producto");

const readline2 = require("readline");


    const adminEmpleados = new cl_empleado.AdminEmpleados();
    const carro = new cl_carro.Carro();
    const prd=new cl_prd.Producto();
    //const tienda = new cl_tienda.Tienda();
    //console.log("genero tienda!");
    //const tienda = new cl_tienda.Tienda(adminEmpleados, carro );
    //console.log("datos del objeto tienda: "+tienda.productos);

    class Menu {
        constructor(){
            this.msg="menu";
            this.vec_prds=prd.cargarProductos();
            //console.log("cargo prds de json: "+this.vec_prds);      
        }

        static str_menu="\n=== Menu Principal ===   \n"+
                "1. Nuevo empleado\n"+
                "2. Lista de empleados\n"+
                "3. Cargar nuevas ventas\n"+
                "4. Nuevo Producto\n"+
                "5. Lista de productos\n"+
                "6. Reporte de ventas\n"+
                "7. Salir\n";
            static s_rl=readline2.createInterface({
                input: process.stdin,
                output: process.stdout
            });

    menuPrincipal() {

        console.log(Menu.str_menu);
        Menu.s_rl.question("Seleccione una opcion: ", function (choice) {
            const mn2=new Menu();
            let rl2;
            switch (choice) {
                case "1":
                    Menu.s_rl.question("Ingrese nombre del empleado: ", function(nombre) {
                        Menu.s_rl.question("Ingrese funcion: ", function(rol) {
                            adminEmpleados.addEmpleado(new cl_empleado.Empleado(nombre, rol));
                            mn2.menuPrincipal();
                        });
                    });
                    break;
                case "2":
                    adminEmpleados.mostrarEmpleados();
                    mn2.menuPrincipal();
                    break;
                case "3":
                    cl_tienda.Tienda.seleccionarEmpleado(Menu.s_rl, mn2, adminEmpleados, carro);
                    break;
                case "4":
                    console.log("\n=== Seleccionar tipo de producto ===");
                    cl_prd.setProductTypes();
                    cl_prd.productTypes.forEach((type, index) => {
                        console.log(`${index + 1}. ${type.nombre}`);
                    });
                    Menu.s_rl.question("Seleccionar tipo de producto: ", (typeChoice) => {
                        const selectedType = cl_prd.productTypes[parseInt(typeChoice) - 1];
                        
                        if (!selectedType) {
                            console.log("Tipo de producto seleccionado es invalido.");
                            return;
                        }
            
                        // Common product details
                        Menu.s_rl.question("Ingrese marca del producto: ", (marca) => {
                            Menu.s_rl.question("Ingrese modelo del producto: ", (modelo) => {
                                Menu.s_rl.question("Ingrese precio: ", (precio) => {
                                    Menu.s_rl.question("Enter stock cantidad: ", (stock) => {
                                        // detalles adicionales por subproducto
                                        cl_tienda.Tienda.addProductByType(selectedType, marca, modelo, precio, stock, Menu.s_rl, mn2);
                    
                                    });
                                });
                            });
                        });
                    });
                    
                    break;
                case "5":
                    prd.mostrarProductos(mn2.vec_prds);
                    mn2.menuPrincipal();
                    break;
                case "6":
                    cl_tienda.Tienda.mostrarReporte();
                    mn2.menuPrincipal();
                    break;
                case "7":
                    console.log("Cerrando programa.");
                    Menu.s_rl.close();
                    break;
                default:
                    mn2.menuPrincipal();
            }
            
        });
        
    }
}

module.exports = { Menu }