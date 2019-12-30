var express = require('express');

var app = express();

var HospitalM = require('../modelos/hospitalM');
var MedicoM = require('../modelos/medicosM');
var UsuarioM = require('../modelos/usuarioM');

/*busqueda por tabla */
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var pomesa;
    switch ( tabla ){
        case 'usuario' :
            promesa = buscarUsuarios(busqueda,regex)
        break;

        case 'medico' :
            promesa = buscarMedicos(busqueda, regex);
        break;

        case 'hospital' :
            promesa = buscaEnHospital(busqueda,regex)
        break;

        default:
            return res.status(400).json({
                ok:false,
                mensajito:'buscaen las sgt tablas usuario hospital medico'
            })

    }

    promesa.then( data=>{
        res.status(200).json({
            ok:false,
            [tabla]:data //ES& resultado comutadps , el resultado de esa variable , porparmans
        })
    })
})





app.get('/todo/:busqueda',(req,res,next)=>{


    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

Promise.all([ 
            buscaEnHospital(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
])
.then( (respuesta)=>{
    res.status(200).json({
        ok:true,
        hospitales:respuesta[0],
        medicos: respuesta[1],
        usuarios: respuesta[2]
    })
})
});

function buscaEnHospital( busqueda,regex ){
    return new Promise( (resolve,reject)=>{

        HospitalM.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {

            if (err) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(hospitales)
            }
        });
        
    })


}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        MedicoM.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        UsuarioM.find({}, 'nombre_u email ')
            .or([{ 'nombre_u': regex }, { 'email': regex },{'role':regex}])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}




module.exports = app;