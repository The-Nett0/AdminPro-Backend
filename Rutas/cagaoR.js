var express = require('express');
var app = express();
var cagaoM = require('../modelos/cagaoM')



app.post('/',(req,res,next)=>{
    var body = req.body;
    //antes de encrptar seria bueno verificar que haya algo

    var cagadero = new cagaoM({
        nombre: body.nombre,
        email: body.email,
        password:body.password ,
        img: body.img,
        role: body.role
    })

    cagadero.save( (error,cageG)=>{
        if(error){
            return res.status(401).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        }

        
        res.status(201).json({
            ok: true,
            cagdato: cageG,
            //usuarioToken:req.usuario//req es lo nos manda el :verficaTokencillo
            
        });
    });


})

module.exports = app;