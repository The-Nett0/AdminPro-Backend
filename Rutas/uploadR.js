var express = require('express')
var app = express();
const fileUpload = require('express-fileupload');

var HospitalM = require('../modelos/hospitalM');
var MedicoM = require('../modelos/medicosM');
var UsuarioM = require('../modelos/usuarioM');

var fs = require('fs')



//rutas
app.use(fileUpload());
//tipo , medico, usuario,hospital
app.put('/:tipo/:id',(req,res,next)=>{
    var tipo = req.params.tipo;
    var id = req.params.id
    //verfifcaione de tipos:
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if( tiposValidos.indexOf( tipo ) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        })
    }



    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'no selcciono nada',
            errors: { message: 'debe seleccionar una imagen' }
        });
    }
    //validaciones
    var archivo = req.files.imagencita ;
    var nombreSplit = archivo.name.split('.'); ///esta no me a sabia;
    var extension = nombreSplit[nombreSplit.length -1];

    var extensionesVAlidas = ['png', 'jpg', 'gif', 'jpeg'];
    if( extensionesVAlidas.indexOf( extension) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesVAlidas.join(', ') }
        });
    }

    //nombre de archivo personalizado:
    //id-usuario- + numero random ,prevenir caché,el numra
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extension}`;
    //movemos a una direccion segun tuto de expressfileupoad
    var rutaDeGuadado = `./uploadas/${tipo}/${nombreArchivo}`;



    //pasadel select file has aqui
     archivo.mv(rutaDeGuadado, (err)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        //so no hay error movio el archivo;
        SubirXTIpo( tipo ,id, nombreArchivo ,res);




        // res.status(200).json({
        //     ok:true,
        //     mensaje:'sse movio el archivo correctamente'
        // });
    })

   
});

function SubirXTIpo( tipo ,id, nombreNuevo ,res){
    //validaxion de imagen por algun usuario;
    if( tipo === 'usuarios'){
        UsuarioM.findById(id,(err,usurE)=>{
            //validar error xd
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'nada con ese id , error actualizar img ',
                    errors:err
                })
            }
            
            var pathViejito = './uploadas/usuarios/'+usurE.img;
            //si existe se borra ;)
            if (fs.existsSync(pathViejito)) {
                fs.unlink(pathViejito);
            }
            //sbir img nueva
            usurE.img = nombreNuevo; //ya se hizo el mv, ahora en este string se le la la pertenecia al usuario
            usurE.save( (err,confirm)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:'al quereral actualizar imgen',
                        errors:err
                    })
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: confirm
                });
                

            })

        })

    }

    if( tipo === 'medicos'){
        MedicoM.findById(id,(err,medE)=>{
            //validar error xd
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'nada con ese id , error medico img ',
                    errors:err
                })
            }
            
            var pathViejito = './uploadas/medicos/'+medE.img;
            //si existe se borra ;)
            if (fs.existsSync(pathViejito)) {
                fs.unlink(pathViejito);
            }
            //sbir img nueva
            medE.img = nombreNuevo; //ya se hizo el mv, ahora en este string se le la la pertenecia al usuario
            medE.save( (err,confirm)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:'al quereral actualizar  imgen de medico',
                        errors:err
                    })
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: confirm
                });
                

            })

        })

    }

    if( tipo === 'hospitales'){
        HospitalM.findById(id,(err,hospE)=>{
            //validar error xd
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'nada con ese id , error actualizar img ',
                    errors:err
                })
            }
                   
            
            var pathViejito = './uploadas/hospitales/'+hospE.img;
            //si existe se borra ;)
            if (fs.existsSync(pathViejito)) {
                fs.unlinkSync(pathViejito)
                // return res.status(200).json({
                //             ok: true,
                //             mensaje: 'se bporooo',
                //             usuario: pathViejito
                //         });
               
            }
            //sbir img nueva
            hospE.img = nombreNuevo; //ya se hizo el mv, ahora en este string se le la la pertenecia al usuario
            hospE.save( (err,confirm)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:'al quereral actualizar imgen de hiospital',
                        errors:err
                    })
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    usuario: confirm
                });
                

             })

        })

        
        
    }
}




module.exports = app; // exportando fuera de l ar chivo 