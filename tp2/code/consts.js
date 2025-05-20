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




module.exports = { pool, get_connection, int_l };