const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({

    tipo:{
        type:String,
        required:true,
        trim:true
    },

    descripcion:{
        type:String,
        required:true,
        trim:true
    },

    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cliente',
        required:true
    },

    responsable:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuario'
    }

},{
    timestamps: true,

    collection: 'Actividades'
});

module.exports=mongoose.model(
    'Actividad',
    actividadSchema
);