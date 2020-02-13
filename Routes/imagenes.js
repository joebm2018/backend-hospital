var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');

//RUTAS
app.get('/:tabla/:img', (req, res, next) => {
    var tabla = req.params.tabla;
    var img = req.params.img;
    var pathImg = path.resolve(__dirname, `../upload/${tabla}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        var pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg')
        res.sendFile(pathNoImg);
    }




    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Peticion realizada correctamente'
    // });
});

module.exports = app;