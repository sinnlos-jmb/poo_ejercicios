const express = require('express')
const session = require("express-session");

const app = express()
const port = 3060;

const options = { maxAge: '2h', etag: false };  //cambiar a 2d
app.use(express.static('public', options));
app.use(session({ secret: "1111", resave: false, saveUninitialized: false, }));

const { request } = require('http');
const lib_c = require("./code/consts");
const { Producto, Calzado, Campera, Pantalon } = require('./code/classes');


const grid1="<!DOCTYPE html><html><head><title>PRUEBA EXPRESS</title>"+
        "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"+
        "<link rel='stylesheet' href='/ecommerce.css'><script src='/ecommerce_scripts.js'></script></head>"+
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
          ""+
          grid2;        
res.send(rta);
  })


app.get('/productos', async function (req, res) {

if (!Producto.load) {
  Producto.cargar_vec();

}

const params = { op: req.query.op || '', query: '' , logged:true};  
const prd = { marca: req.query.marca || '', modelo:  req.query.modelo || '' , 
              precio:  req.query.precio || '', stock:  req.query.stock || '', 
              categ:  req.query.categ || '', talles:  req.query.talles || '', 
              material:  req.query.material || '', 
              temporada:  req.query.temporada || '', color:  req.query.color || '',
              ancho:  req.query.ancho || '', largo:  req.query.largo || ''};

              let rta=grid1;
if (params.op=='lista') {
    rta+="<h2>Lista de productos</h2><br>"+Producto.getProductos();
    }
else if (params.op=='nuevo') {
    rta+="<h2>Nuevo producto</h2><br>"+
          "<select name='s_rol' onchange='new_form(this.value);'><option value='0'>tipo producto</option><option value='1'>calzado</option><option value='2'>campera</option><option value='3'>pantalon</option></select>\n"+
          "<div id='new_f'></div>";

    }
else if (params.op=='submit') {
      rta+="<h2>Insertar producto en la dbase</h2><br>"+
          "<ul>datos del form: "+
          "<li>marca: "+prd.marca+"</li>"+
          "<li>modelo: "+prd.modelo+"</li>"+
          "<li>precio: "+prd.precio+"</li>"+
          "<li>stock: "+prd.stock+"</li>"+
          "<li>categ: "+prd.categ+"("+Producto.categs[prd.categ]+")</li></ul>";
          if (prd.categ==1) {Producto.addProducto(new Calzado(prd.id, prd.marca, prd.modelo, prd.precio, prd.stock, prd.talles, prd.material));}
          else if (prd.categ==2) {Producto.addProducto(new Campera(prd.id, prd.marca, prd.modelo, prd.precio, prd.stock, prd.talles, prd.temporada, prd.color));}
          else if (prd.categ==3) {Producto.addProducto(new Pantalon(prd.id, prd.marca, prd.modelo, prd.precio, prd.stock, prd.ancho, prd.largo));}

      try {
            const value = await Producto.insert_producto(prd);
            if (value != null) {
              rta+=value;
              }
            else {
              rta+="No se insertaron registros.";
              }
          }
      catch (error) { rta+=error; }          

    }    
else {
    rta+="<h2><a href='/productos?op=lista'>Listar Productos</a>  |  <a href='/productos?op=nuevo'>Nuevo producto</a></h2>"
    }
rta+=grid2;
res.send(rta);
  })  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
