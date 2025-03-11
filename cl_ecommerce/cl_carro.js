const cl_prd = require("./cl_producto");

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

    checkout(p_Tienda) {
        let total = 0;
        this.items.forEach(({ producto, cantidad }) => {
            let productIndex = p_Tienda.productos.findIndex(p => 
                p.marca === producto.marca && 
                p.modelo === producto.modelo
            );
            if (productIndex !== -1 && p_Tienda.productos[productIndex].stock >= cantidad) {
                p_Tienda.productos[productIndex].stock -= cantidad;
                total += producto.precio * cantidad;
            }
        });
        p_Tienda.registro_ventas.push({ 
            empleado: p_Tienda.empleadoActivo.nombre, 
            items: this.items, 
            total 
        });
        cl_prd.Producto.guardarProductos(p_Tienda.productos);
        p_Tienda.saveSales();
        console.log(`\nCheckout Realizado! Total: $${total}\n`);
        this.items = [];
        
    }
}

module.exports = { Carro }