var express = require('express');
var app = express();
//obtener toso lo uuario?
var UsuarioM = require( '../modelos/usuarioM' )
var bcrypt = require('bcryptjs');


var mdAthentication = require('../midelware/autenticacion');



//cada vez qentro  aesta ruta me trae toos lo usuarios de la base de  datos
app.get('/',(req,res,next)=>{

    UsuarioM.find({},'nombre_u email img role').exec((err,usuarios)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error cargando usuario',
                errors:err
            })
        }
            return res.status(200).json({
                ok:true,
                mensaje:'se trajo usuarios  usuario',
                mensaje :usuarios
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

    var usuario = new UsuarioM({
        nombre_u: body.nombre_u,
        email: body.email,
        password:bcrypt.hashSync(body.password, 10) ,
        img: body.img,
        role: body.role
    })

    usuario.save( (error,usuarioG)=>{
        if(error){
            return res.status(401).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        }

        //req es lo nos manda el :verficaTokencillo
        res.status(201).json({
            ok: true,
            usuario: usuarioG,
            usuarioToken:req.usuario
            
        });
    });


})


//Para actulizar amio;
app.put('/:id', (req,res,next)=>{
    var id = req.params.id;
    var body = req.body;
    

    UsuarioM.findById( id, (err,usuarioE)=>{
            if (err) {
            //error :este es un error de servidor
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!usuarioE){
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuarioE.nombre_u = body.nombre_u;
        usuarioE.email = body.email;
        usuarioE.role = body.role;
        //el pass no lo cambiare por aqui

             
            usuarioE.save( (err,usurG)=>{
                
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                }
                //usuarioGuardado.password = ':)';
                //mostrar lo que nos trajo ,aemas se puee manipular el pass(solo lo muestra manilpulao)
                res.status(200).json({
                    ok: true,
                    usuario: usurG
                });

               

        })  
    })
    


})


//Eliminar registro de usuario por id
app.delete('/:id',(req,res)=>{
    var id = req.params.id;
    UsuarioM.findByIdAndRemove( id,(err,usuarioBorrado)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });

        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    })
})

module.exports = app;