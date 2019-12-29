var express = require('express');
var jwt = require('jsonwebtoken');
var SEED = require('../configuraciones/config')
var app = express();


exports.verficaTokencillo = function (req, res, next) {

    var token = req.query.token; //recibiendo por url
    jwt.verify(token, SEED.SEED, (error, confirm) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorredto',
                errors: error
            });
        }
 //colocar la informacion del usuario solicitante o quien envio el token:
        req.usuario = confirm.usuario

        next()

        
       
    })


}

