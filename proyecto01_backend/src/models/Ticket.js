const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({

    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cliente',
        required:true
    },

    problema:{
        type:String,
        required:true,
        trim:true
    },

    estado:{
        type:String,
        required:true,
        trim:true,
        enum: ['Abierto', 'En curso', 'En espera', 'Resuelto', 'Terminado', 'Cerrado'],
        default: 'Abierto'
    },

    prioridad:{
        type:String,
        required:true,
        trim:true,
        enum: ['Baja', 'Media', 'Alta', 'Urgente'],
        default: 'Media'
    },

    responsable:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuario'
    }

},{
    timestamps:true,
    collection :'Tickets'
});

module.exports=mongoose.model(
    'Ticket',
    ticketSchema
);