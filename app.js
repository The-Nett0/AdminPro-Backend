// Requires
var express = require('express');
var mongoose = require('mongoose');

//inicializar variables,
var app = express();


//escuchar peticio
app.listen(3000,()=>{
    console.log('Express serve corriendo en el puerto 3000')
});

//Conexiona la bas e de datos
mongoose.connection.openUri( 'mongodb://localhost:27017/',( err,res )=>{
    if(err) throw err;
    console.log( 'base de datos online' )
})



//rutas
app.get('/',(req,res,next)=>{

    res.status(200).json({
        ok:true,
        mensaje:'ptecio realizada de maner correcta'
    })
})