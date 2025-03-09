class Producto {
    constructor(marca, modelo, precio, stock) {
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
        this.stock = stock;
        this.tipo = "";
    }

    getDetalles() {
        return `${this.marca} ${this.modelo}`;
    }

    // Static method to reconstruct the correct product type
    static reconstruct(productData) {
        // Determine the product type based on additional properties
        if (productData.ancho !== undefined) {
            return Object.assign(new Pantalon(), productData);
        } else if (productData.talle !== undefined) {
            return Object.assign(new Calzado(), productData);
        } else if (productData.dimensions !== undefined) {
            return Object.assign(new Campera(), productData);
        }
        // Default to base Product if no specific type is found
        return Object.assign(new Producto(), productData);
    }
}

// Subclasses de Producto
class Pantalon extends Producto {
    constructor(marca, modelo, precio, stock, ancho, largo) {
        super(marca, modelo, precio, stock);
        this.ancho = ancho;
        this.largo = largo;
        this.category = 'Pantalon';
    }

    getDetalles() {
        return `${super.getDetalles()} (${this.category}) - Ancho: ${this.ancho} - Largo: ${this.largo}`;
    }
}

class Calzado extends Producto {
    constructor(marca, modelo, precio, stock, talle, material) {
        super(marca, modelo, precio, stock);
        this.talle = talle;
        this.material = material;
        this.category = 'Calzado';
    }

    getDetalles() {
        return `${super.getDetalles()} (${this.category}) - talle: ${this.talle}, Material: ${this.material}`;
    }
}

class Campera extends Producto {
    constructor(marca, modelo, precio, stock, temporada, talles, color) {
        super(marca, modelo, precio, stock);
        this.temporada = temporada;
        this.talles = talles;
        this.color = color;
        this.category = 'Campera';
    }

    getDetalles() {
        return `${super.getDetalles()} (${this.category}) - Temporada: ${this.temporada}, Talles: ${this.talles}, Color: ${this.color}`;
    }
}


module.exports = {Producto, Calzado, Campera, Pantalon }