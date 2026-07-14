const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    empresa: {
        type: String,
        required: true,
        trim: true
    },

    telefono: {
        type: String,
        required: true,
        trim: true
    },

    correo: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Cliente', clienteSchema);