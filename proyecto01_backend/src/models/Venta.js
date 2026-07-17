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

    cantidad:{
        type:Number,
        required:true,
        min:1
    },

    precioUnitario:{
        type:Number,
        required:true,
        min:0
    },

    subtotal:{
        type:Number,
        required:true,
        min:0
    },

    itbms:{
        type:Number,
        required:true,
        min:0
    },

    total:{
        type:Number,
        required:true,
        min:0
    }

},{
    timestamps:true,
    collection: 'Ventas'
});

module.exports=mongoose.model(
    'Venta',
    ventaSchema
);