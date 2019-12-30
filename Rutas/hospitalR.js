var express = require('express');
var app = express();
//obtener toso lo uuario?
var hospitalM = require( '../modelos/hospitalM' )



var mdAthentication = require('../midelware/autenticacion');



//cada vez qentro  aesta ruta me trae toos lo usuarios de la base de  datos
app.get('/',(req,res,next)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    hospitalM.find({})
    .populate('usuario' , 'nombre_u email')
    .skip(desde)
        .limit(5)
    .exec((err,hospitales)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error cargando usuario',
                errors:err
            })
        }

        hospitalM.count({}, (err, conteo) => {

            res.status(200).json({
                ok: true,
                hospitales: hospitales,
                total: conteo
            });
        })
    })
})

/* 
verficiar tken
*/
// app.use('/',(req,res,next)=>{
//     var token = req.query.token; //recibiendo por url
//     jwt.verify( token,SEED.SEED,  (error, confirm )=>{
//         if(error){
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'Error al crear usuario',
//                 errors: error
//             });
//         }

//         next()
//     })

// })




//crear un nuevo usuario
app.post('/', mdAthentication.verficaTokencillo ,(req,res,next)=>{
    var body = req.body;
    //antes de encrptar seria bueno verificar que haya algo

    var hospital = new hospitalM({
        nombre: body.nombre,
        usuario: req.usuario._id,
        //ecnriptar//password:bcrypt.hashSync(body.password, 10) ,
       
    })

    hospital.save( (error,hospitalG)=>{
        if(error){
            return res.status(401).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: error
            });
        }

        //req es lo nos manda el :verficaTokencillo
        res.status(201).json({
            ok: true,
            hospital: hospitalG,
            hospitalToken:req.hospital
            
        });
    });


})


//Para actulizar amio;
app.put('/:id', mdAthentication.verficaTokencillo,(req,res,next)=>{
    var id = req.params.id;
    var body = req.body;
    

    hospitalM.findById( id, (err,hospitalE)=>{
            if (err) {
            //error :este es un error de servidor
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if(!hospitalE){
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospitalE.nombre = body.nombre;
        //hospitalE.img = body.email;
        hospitalE.usuario = req.usuario._id ;
        //el pass no lo cambiare por aqui

             
            hospitalE.save( (err,hopiG)=>{
                
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                    });
                }
                //hospitalGuardado.password = ':)';
                //mostrar lo que nos trajo ,aemas se puee manipular el pass(solo lo muestra manilpulao)
                res.status(200).json({
                    ok: true,
                    hospital: hopiG
                });

               

        })  
    })
    


})


//Eliminar registro de hospital por id
app.delete('/:id',mdAthentication.verficaTokencillo,(req,res)=>{
    var id = req.params.id;
    hospitalM.findByIdAndRemove( id,(err,hospitalBorrado)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar hospital',
                errors: err
            });

        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    })
})


module.exports = app;