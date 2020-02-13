var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');

var fs = require('fs');

var Usuario = require('../models/Usuario');
var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');

// default options
app.use(fileUpload());


//RUTAS
app.put('/:tabla/:id', (req, res, next) => {
    var tabla = req.params.tabla;
    var id = req.params.id;
    var tablasAceptadas = ['hospitales', 'medicos', 'usuarios'];
    if (tablasAceptadas.indexOf(tabla) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: ' Tabla No Valida',
            errors: { message: 'las coleccion validas son  ' + tablasAceptadas.join(', ') }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: ' No selecciono nada',
            errors: { message: 'debe seleccioar una imagen' }
        })
    }

    //obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];

    //solo estas extencones aceptams
    var extensionesAceptadas = ['jpg', 'gif', 'png', 'jpeg'];

    if (extensionesAceptadas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: ' Extension No Valida',
            errors: { message: 'las extenciones validas son  ' + extensionesAceptadas.join(', ') }
        })
    }
    // nombre del archivo personalizado
    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extension}`;

    // Mover el archivo del temportal a un path
    var path = `./upload/${tabla}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: ' Erro al mover archivo',
                errors: err
            })
        }
        subirPorTipo(tabla, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'archivo movido correctamente',
        //     nombreArchivo
        // });
    })

});

function subirPorTipo(tabla, id, nombreArchivo, res) {

    // console.log(tabla, id);

    if (tabla === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            var pathViejo = './upload/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) throw err;
                    console.log(pathViejo + ' was deleted');
                });
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario Actualizado',
                    usuario: usuarioActualizado
                });
            })
        });
        // return
    }
    if (tabla === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            var pathViejo = './upload/hospitales/' + hospital.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) throw err;
                    console.log(pathViejo + ' was deleted');
                });
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital Actualizado',
                    hospital: hospitalActualizado
                });
            })
        });
        // return
    }
    if (tabla === 'medicos') {
        Medico.findById(id, (err, medico) => {
            var pathViejo = './upload/medicos/' + medico.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) throw err;
                    console.log(pathViejo + ' was deleted');
                });
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico Actualizado',
                    medico: medicoActualizado
                });
            })
        });

    }
}

module.exports = app;