var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middleware/autenticacion');

var Usuario = require('./../models/Usuario');
// ======================================
//     GET DE USUARIOS
// ======================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: fase,
                        mensaje: 'Error Cargando Usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                })
            }
        )

});



// ======================================
//     ACTUALIZAR USUARIO
// ======================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
        var id = req.params.id;
        var body = req.body;

        Usuario.findById(id, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al buscar Usuario",
                    errors: err
                });
            }
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "El Usuario con el id:" + id + " no existe",
                    errors: { message: "No existe un usuario con este ID" }
                });
            }
            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Error al actualizar Usuario",
                        errors: err
                    });
                }
                usuarioGuardado.password = ':)';
                res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado
                });
            })

        })
    })
    // ======================================
    //     BORRAR UN USUARIO POR ID
    // ======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

        var id = req.params.id;

        Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al borrar Usuario",
                    errors: err
                });
            }
            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "No existe un Usuario con ese ID",
                    errors: { message: "No existe un usuario con este ID" }
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });

        })
    })
    // ======================================
    //     POST USUARIOS
    // ======================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear Usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario //USUARIO QUE HIZO LOS CAMBIOS EL QUE GENERO EL TOKEN
        });

    });
})


module.exports = app;