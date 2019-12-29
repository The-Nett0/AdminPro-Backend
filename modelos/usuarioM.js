var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuariochema= new Schema({
    nombre_u:{ type:String,required: [true,'nombre ess necesario'  ] },

    email:{ type:String,required: [true,'email ess necesario'  ] },
    password:{ type:String,required: [true,'password ess necesario'  ] },

    img:{ type:String,required:false},
    role:{ type:String,required:true,default:'admin' },

})

module.exports = mongoose.model('Usuario',usuariochema);