var express = require('express');

var app = express();


var mdAutenticacion = require('../middleware/autenticacion');

var Hospital = require('./../models/Hospital');
// ======================================
//     GET DE HOSPITAL
// ======================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: fase,
                        mensaje: 'Error Cargando hospitales',
                        errors: err
                    });
                }
                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        hospitales,
                        total: conteo
                    });
                })
            }
        )
});

// ======================================
//     ACTUALIZAR HOSPITAL
// ======================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
        var id = req.params.id;
        var body = req.body;

        Hospital.findById(id, (err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al buscar hospital",
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "El Hospital con el id:" + id + " no existe",
                    errors: { message: "No existe un hospital con este ID" }
                });
            }
            hospital.nombre = body.nombre;
            hospital.usuario = req.usuario._id;

            hospital.save((err, hospitalGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Error al actualizar Hospital",
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    hospital: hospitalGuardado
                });
            })

        })
    })
    // ======================================
    //     BORRAR UN HOSPITAL POR ID
    // ======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

        var id = req.params.id;

        Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al borrar Hospital",
                    errors: err
                });
            }
            if (!hospitalBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "No existe un Hospital con ese ID",
                    errors: { message: "No existe un hospital con este ID" }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalBorrado
            });

        })
    })
    // ======================================
    //     POST HOSPITAL
    // ======================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    })
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear Hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,

        });

    });
})


module.exports = app;