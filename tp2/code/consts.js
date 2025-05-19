const mariadb = require('mariadb');

const host_db = "localhost";
const user_db = "manu";
const pwd_db = "1234";
const dbase = "Poo_ecommerce";
const pool_size = 3;
const port = 3306;

const int_l=new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
    });

const pool = mariadb.createPool({
    host: host_db,
    user: user_db,
    password: pwd_db,
    database: dbase,
    connectionLimit: pool_size
});


function get_connection() {

    return mariadb.createConnection({
        host: host_db,
        user: user_db,
        password: pwd_db,
        database: dbase
    });
}

async function get_vec_productos() {
    let conn, rta = [];
    try {
        conn = await pool.getConnection();
        rows = await conn.query("select id_producto, marca, modelo, id_categoria, precio, stock, talles, material, ancho, largo, temporada, color "+ 
                                "from productos");
        for (var i in rows) {
            rta.push({id: rows[i].id_producto, marca: rows[i].marca, modelo:rows[i].modelo, precio:rows[i].precio, stock: rows[i].stock});
        }

    } catch (err) {
        console.log(err);
        rta = "error!" + err;
    } finally {
        if (conn) await conn.release();
    }
    return rta;
}

async function insert_producto(prd) {
    let rta = "";
	const conn = await pool.getConnection(), query="insert into productos  (marca, modelo, precio, stock, id_categoria) "+
                                    "Values ('"+prd.marca+"', '"+prd.modelo+"', "+prd.precio+", "+prd.stock+", "+prd.categ+")";


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

module.exports = {
    pool, get_connection, get_vec_productos, int_l, insert_producto
};