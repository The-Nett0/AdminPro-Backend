var express = require('express');
var app = express();
var UsuarioM = require( '../modelos/usuarioM' )
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../configuraciones/config')


app.post('/',(req,res)=>{
    var body = req.body;
    var email = body.email

    UsuarioM.findOne( {email:email},(err,usurDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'logeo, error servidor',
                errors: err
            });
        }

        if( !usurDB ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Correo invalido - email',
                errors: err
            });
        }

        //email existente , verifiquemos el correo
       
        if( !bcrypt.compareSync( body.password, usurDB.password ) ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Correo invalido - passs',
                errors: err
            });
            
        }else

        //creamos token:
        var tokencito = jwt.sign( {usuario:usurDB},SEED.SEED,{expiresIn:14400} )
        


        res.status(500).json({
                ok: true,
                mensaje: 'con ese email ah tmb pass, econtrmo a este ',
                bodi:usurDB,
                token:tokencito
            });




    })

   
})




module.exports = app