var express = require('express');
var fs = require('fs');

var app = express();
var path = require('path')

app.get('/:tipo/:img', (req, res, next) => {
//ya veras como obtendfo el nombre exactio de esa imagen
    var tipo = req.params.tipo;
    var img = req.params.img;

var pathoInmagen = path.resolve( __dirname,`../uploadas/${tipo}/${img}` ) //path siempre corrento:__dirname node me da toda la rauta
    

    if(fs.existsSync(  pathoInmagen )){
        res.sendFile( pathoInmagen )
    }else{
        var pathoInmagen = path.resolve(__dirname,`../assetitos/no-img.jpeg` )
        res.sendFile(pathoInmagen)
    }

    // return res.status(200).json({
    //     ok: true,
    //     mensaje: 'Imagen de hospital actualizada',
    //     usuario: hospitalActualizado
    // });

});

module.exports = app;