const lib_c = require("./consts");

class Producto {

    static vec_productos=[];
    static load=false;
    static categs=["", "calzado", "campera", "pantalones"];
    constructor(id, marca, modelo, precio, stock) {
        this.id=id;
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
        this.stock = stock;
        this.tipo = "";
    }

    getDetalles() {
        return `${this.marca} ${this.modelo}`;
    }

    static addProducto(prd) {
        Producto.vec_productos.push(prd);
    }

    static getProductos(){
        let rta="";
        for (let i=0; i<Producto.vec_productos.length;i++) {rta+=Producto.vec_productos[i].getDetalles()+"<br>";}
        return rta;
        }

    static async cargar_vec() {
        let conn, rows;
        try {
            conn = await lib_c.pool.getConnection();
            rows = await conn.query("select id_producto, marca, modelo, id_categoria, precio, stock, talles, material, ancho, largo, temporada, color "+ 
                                    "from productos");
            for (let i in rows) {
                console.log("row"+i+"\ncateg: "+rows[i].id_categoria);
                if  (rows[i].id_categoria==1) {Producto.addProducto(new Calzado(rows[i].id_producto, rows[i].marca, rows[i].modelo, rows[i].precio, rows[i].stock, rows[i].talles, rows[i].material)); console.log("zapa: "+Producto.vec_productos[i].getDetalles()); }
                else if  (rows[i].id_categoria==2) {Producto.addProducto(new Campera(rows[i].id_producto, rows[i].marca, rows[i].modelo, rows[i].precio, rows[i].stock, rows[i].talles, rows[i].temporada, rows[i].color)); console.log("campe: "+Producto.vec_productos[i].getDetalles());}
                else if  (rows[i].id_categoria==3) {Producto.addProducto(new Pantalon(rows[i].id_producto, rows[i].marca, rows[i].modelo, rows[i].precio, rows[i].stock, rows[i].ancho, rows[i].largo)); }
                
            }

        } catch (err) {
            console.log(err);
            return{rta: false, msg: err};
        } finally {
            if (conn) await conn.release();
            }
        Producto.load=true;
        return {rta: true, msg:''};

        }

    static async insert_producto(prd) {
    let rta = "";
	const conn = await lib_c.pool.getConnection(), query="insert into productos  (marca, modelo, precio, stock, id_categoria, talles, material, temporada, color, ancho, largo) "+
                                    "Values ('"+prd.marca+"', '"+prd.modelo+"', "+prd.precio+", "+prd.stock+", "+prd.categ+", '"+prd.talles+"', '"+prd.material+"', '"+prd.temporada+"', '"+prd.color+"', '"+prd.ancho+"', '"+prd.largo+"')";


	try {
			const r=await conn.query(query);
			rta="OK. affectedRows:"+r.affectedRows.toString()+", insertId:"+r.insertId.toString();
		}
	catch (err) {console.log("error en funcion insert\n"+err);rta=err;} 
	finally { 
		if (conn)  await conn.end();
		return rta;
		}
}


    
    static cargarProductos() {
        try {
            // Parse JSON y reconstruye cada producto como un objeto
            const rawProducts = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/productos.json')));
            const temp = [];
            for (let i = 0; i < rawProducts.length; i++) {
                temp.push(Producto.reconstruct(rawProducts[i]));
                }

            return temp;
        } catch (error) {
            return [];
        }
    }

    guardarProductos(p_productos) {

    }

}

// Subclasses de Producto
class Pantalon extends Producto {
    constructor(id, marca, modelo, precio, stock, ancho, largo) {
        super(id, marca, modelo, precio, stock);
        this.ancho = ancho;
        this.largo = largo;
        this.category = 3;
    }

    getDetalles() {
        return `${super.getDetalles()} (${Producto.categs[this.category]}) - Ancho: ${this.ancho} - Largo: ${this.largo}`;
    }
}

class Calzado extends Producto {
    constructor(id, marca, modelo, precio, stock, talles, material) {
        super(id, marca, modelo, precio, stock);
        this.talles = talles;
        this.material = material;
        this.category = 1;
    }

    getDetalles() {
        return `${super.getDetalles()} (${Producto.categs[this.category]}) - talle: ${this.talles}, Material: ${this.material}`;
    }
}

class Campera extends Producto {
    constructor(id, marca, modelo, precio, stock, talles, temporada, color) {
        super(id, marca, modelo, precio, stock);
        this.temporada = temporada;
        this.talles = talles;
        this.color = color;
        this.category = 2;
    }

    getDetalles() {
        return `${super.getDetalles()} (${Producto.categs[this.category]}) - Temporada: ${this.temporada}, Talles: ${this.talles}, Color: ${this.color}`;
    }
}


module.exports = {Producto, Calzado, Campera, Pantalon }