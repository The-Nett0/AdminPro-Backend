var express = require('express')
var app = express();
//rutas
app.get('/',(req,res,next)=>{

    res.status(200).json({
        ok:true,
        mensaje:'ptecio realizada de maner correcta'
    });
});

module.exports = app; // exportando fuera de l ar chivo