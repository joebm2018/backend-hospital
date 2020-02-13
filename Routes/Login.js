var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/Usuario');
app.post('/', (req, res) => {
    var body = req.body;
    console.log("BODY", body);

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuarios",
                errors: err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrecto - email",
                errors: err
            });
        }
        // verificar la contraseña
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrecto - password",
                errors: err
            });
        }

        //crear Credenciales
        usuarioBD.password = ':)'
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD.id
        });
    })
})

module.exports = app;