//PENEME ELCRUD AQI

var MedicoM = require('../modelos/medicosM');
var express = require('express');
var  mdAthentication = require('../midelware/autenticacion');

var app = express();



app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    MedicoM.find({}).populate('usuario','nombre_u email')
    .skip(desde)
        .limit(5)
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                
                MedicoM.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });

                })

                

            });
});


app.put('/:id', mdAthentication.verficaTokencillo, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    MedicoM.findById(id, (err, medico) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }


        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id; // usamos el req salido del (verficaTokencillo)
        medico.hospital = body.hospital;  //del body de un selector TU MANDAS DEL FRINT

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});



app.post('/', mdAthentication.verficaTokencillo, (req, res) => {

    var body = req.body;

    var medico = new MedicoM({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital // DEL FRONT BIENE ESA VAINA
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });


    });

});

app.delete('/:id', mdAthentication.verficaTokencillo, (req, res) => {

    var id = req.params.id;

    MedicoM.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});





module.exports = app;