const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({

    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cliente',
        required:true
    },

    usuario:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuario',
        required:true
    },

    producto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Producto',
        required:true
    },

    fecha:{
        type:Date,
        required:true
    },

    total:{
        type:Number,
        required:true
    }

},{
    timestamps:true,
    collection: 'Ventas'
});

module.exports=mongoose.model(
    'Venta',
    ventaSchema
);