var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/Usuario');

//google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ======================================
//     AUTENTICACION GOOGLE
// ======================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        payload
    }
}
app.post('/google', async(req, res) => {

    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                mensaje: "Token no valido !!!",
            });
        });
    console.log(googleUser);


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
            if (err) {
                console.log("ERROR 1");

                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al buscar usuarios",
                    errors: err
                });
            }
            console.log("USER", usuarioDB);

            if (usuarioDB) {
                console.log("EXISTE USUARIO");

                if (usuarioDB.google === false) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "debe de usar su atenticacion normal",
                    });
                } else {
                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })

                    res.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token: token,
                        id: usuarioDB._id
                    });
                }
            } else {
                console.log(" NO EXISTE USUARIO");

                // el usuario no existe  ... hay que crearlo
                var usuario = new Usuario;
                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.password = ':)';
                console.log(usuario);

                usuario.save((err, usuarioDB) => {
                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })

                    res.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token: token,
                        id: usuarioDB._id
                    });
                })

            }

        })
        // return res.status(200).json({
        //     ok: true,
        //     mensaje: "OK !!!",
        //     googleUser
        // });

})

// ======================================
//     AUTENTICACIO NORMAL
// ======================================
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
            id: usuarioBD._id
        });
    })
})

module.exports = app;