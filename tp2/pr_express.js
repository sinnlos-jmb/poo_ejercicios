const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/segunda', (req, res) => {
//    res.send('prueba de la segunda ruta!');
let rta="<!DOCTYPE html><html><head><title>PRUEBA EXPRESS</title></head><body><h1>Modelo de app</h1><p>prueba en la segunda ruta</p>"+
        "<button onclick='alert();'>btn prueba</button><br>"+
        "<select name='s_rol'><option value='cajero'>cajero</option><option value='repositor'>repositor</option></select></body></html>";
res.send(rta);
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
