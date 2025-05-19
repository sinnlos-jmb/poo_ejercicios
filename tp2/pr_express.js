const express = require('express')
const session = require("express-session");

const app = express()
const port = 3060;

const options = { maxAge: '2h', etag: false };  //cambiar a 2d
app.use(express.static('public', options));
app.use(session({ secret: "1234", resave: false, saveUninitialized: false, }));

const { request } = require('http');
const lib_c = require("./code/consts");


const grid1="<!DOCTYPE html><html><head><title>PRUEBA EXPRESS</title>"+
        "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"+
        "<link rel='stylesheet' href='/ecommerce.css'></head>"+
        "<body>"+
        "<div class='grid-container'>"+
          "<header><h1>App de Ecommerce - POO</h1>"+
            "</header>"+
          "<nav>"+
            "<ul>"+
            "<li><a href='/segunda'>Home</a></li>"+
            "<li><a href='/productos'>Productos</a></li>"+
            "<li><a href='#'>Empleados</a></li>"+
            "<li><a href='#'>Ventas</a></li>"+
            "</ul>"+
          "</nav>"+
        "<main>",
      grid2="</main>"+
            "<footer>"+
              "<p>&copy; 2025 My Website</p>"+
            "</footer>"+
          "</div>"+
        "</body></html>";



app.get('/', (req, res) => {
  res.send('Hello World!<br>LOGIN!');
})

app.get('/segunda', (req, res) => {
let rta=grid1+
          "<h1>Modelo de app</h1><p>prueba en la segunda ruta</p>"+
          "<button onclick='alert();'>btn prueba</button><br>"+
          "<select name='s_rol'><option value='cajero'>cajero</option><option value='repositor'>repositor</option></select>"+
    grid2;        
res.send(rta);
  })


app.get('/productos', async function (req, res) {

const params = { op: req.query.op || '', query: '' , logged:true};  
let rta=grid1;
if (params.op=='lista') {
    rta+="<h2>Lista de productos</h2><br>";
    
try {
			const value = await lib_c.get_vec_productos();

			if (value != null) {
				rta+=value[0].id+", "+value[0].marca+", "+value[0].modelo+", "+value[0].precio+", "+value[0].stock;
        }
    }
		catch (error) { rta+=error; }

    
    }
else if (params.op=='nuevo') {
    rta+="<h2>Nuevo producto</h2>"
    }
else {
    rta+="<h2>Listar Productos  |  Nuevo producto</h2>"
    }
rta+=grid2;
res.send(rta);
  })  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
