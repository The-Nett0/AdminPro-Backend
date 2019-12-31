var express = require('express');
var app = express();
var UsuarioM = require('../modelos/usuarioM')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../configuraciones/config')

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//77trayendo el 
var CLIENT_ID = require('../configuraciones/config').CLIENT_ID;

async function verify(el_loko_token) {
    const ticket = await client.verifyIdToken({
        idToken: (el_loko_token),
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


/*-----------------------------GOOLE LOGEO API-----------------*/
app.post('/google', async (req, res) => {

    var token = req.body.TOKENSASO;

    var google_usuario = await verify(token).then( (ola)=>{
        console.log('_________________OLA_______________')
        console.log(ola)

            UsuarioM.findOne({ email: ola.email }, (err, usuario) => {

                    if (err) {
                        return res.status(500).json({
                            ok: true,
                            mensaje: 'Error al buscar usuario - login',
                            errors: err
                        });
                    }

                    if (usuario){ //el usuario esta en la DB

                        if (usuario.google === false) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'debe uar su autenticacio normal',
                                //errors: e
                            });
                        } else {
                            //tonc si esta en mi base de datos demosle su token y q entre al sistema
                            //creamos token y lo mandamos estamos en login
                            //var tokencito = jwt.sign({ usuario: usuario }, SEED.SEED, { expiresIn: 14400 })
                            var tokencito = jwt.sign({ usuario: usuario }, SEED.SEED, { expiresIn: 14400 })

                            res.status(200).json({
                                ok: true,
                                menaje:"si esta en la base de datos",
                                usuario: usuario,
                                token: tokencito

                            });
                        }


                    }else{
                    //el usuario no existe , traemelo y almacenamelo

                        var usuario = new UsuarioM();

                        usuario.nombre_u =ola.nombre;
                        usuario.email =ola.email;
                        usuario.password = ':)';
                        usuario.img =ola.img;
                        usuario.google = true;

                        usuario.save((err, usuario) => {

                            if (err) {
                                return res.status(500).json({
                                    ok: true,
                                    mensaje: 'Error al crear usuario - google',
                                    errors: err
                                });
                            }
    
    
                            var token = jwt.sign({ usuario: usuario }, SEED.SEED, { expiresIn: 14400 }); // 4 horas
    
                             return res.status(200).json({
                                ok: true,
                                usuario: usuario,
                                token: token,
                                id: usuario._id
                            });
    
                        })


                    }


                })//findOne


    }).catch( (e) => {
        return res.status(403).json({
            ok: false,
            mensaje: 'Token no válido',
            errors: e
        });
    })


    

    
               


   
})



















































































app.post('/', (req, res) => {
    var body = req.body;
    var email = body.email

    UsuarioM.findOne({ email: email }, (err, usurDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'logeo, error servidor',
                errors: err
            });
        }

        if (!usurDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Correo invalido - email',
                errors: err
            });
        }

        //..............EL TOKEN( JSW ) Y ECRIPTADA SON COSAS DIFERENTES(bcrypt.hashSync(body.password, 10) usurR)...........//
        //email existente , verifiquemos el correo

        if (!bcrypt.compareSync(body.password, usurDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Correo invalido - passs',
                errors: err
            });

        } else

            //creamos token y lo mandamos estamos en login
            var tokencito = jwt.sign({ usuario: usurDB }, SEED.SEED, { expiresIn: 14400 })
        res.status(200).json({
            ok: true,
            mensaje: 'con ese email ah tmb pass, econtrmo a este ',
            bodi: usurDB,
            token: tokencito
        });




    })


})




module.exports = app