var express = require('express');

var app = express();

var mdAutenticacion = require('../middleware/autenticacion');

var Medico = require('./../models/Medico');
// ======================================
//     GET DE Medico
// ======================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email ')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: fase,
                        mensaje: 'Error Cargando Medicos',
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        medicos,
                        total: conteo
                    });
                })
            }
        )

})

// ======================================
//     ACTUALIZAR MEDICO
// ======================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
        var id = req.params.id;
        var body = req.body;

        Medico.findById(id, (err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al buscar Medico",
                    errors: err
                });
            }
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "El medico con el id:" + id + " no existe",
                    errors: { message: "No existe un medico con este ID" }
                });
            }
            medico.nombre = body.nombre;
            medico.usuario = req.usuario._id;
            medico.hospital = body.hospital;

            medico.save((err, medicoGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Error al actualizar medico",
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    medico: medicoGuardado
                });
            })

        })
    })
    // ======================================
    //     BORRAR UN MEDICO POR ID
    // ======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

        var id = req.params.id;

        Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al borrar Medico",
                    errors: err
                });
            }
            if (!medicoBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "No existe un Medico con ese ID",
                    errors: { message: "No existe un Medico con este ID" }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: medicoBorrado
            });

        })
    })
    // ======================================
    //     POST HOSPITAL
    // ======================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital,
    })
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,

        });

    });
})


module.exports = app;