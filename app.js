//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//Inicializar Variables
var app = express();

//bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Importar Rutas
var appRoutes = require('./Routes/app');
var usuarioRoutes = require('./Routes/Usuario');
var loginRoutes = require('./Routes/Login');
var hospitalRoutes = require('./Routes/hospital');
var medicoRoutes = require('./Routes/medico');
var busquedaRoutes = require('./Routes/busqueda');
var uploadRoutes = require('./Routes/upload');
var imagenRoutes = require('./Routes/imagenes')

//conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log("Base de Datos: \x1b[32m%s\x1b[0m", "online");

})

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', imagenRoutes);


app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3000, () => {
    console.log("Express server puerto 3000: \x1b[32m%s\x1b[0m", "online");

})