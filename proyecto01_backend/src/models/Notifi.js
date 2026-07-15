const mongoose = require('mongoose');

const notifiSchema = new mongoose.Schema({

    mensaje: {

        type: String,

        required: true,

        trim: true

    },

    usuario: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Usuario',

        required: true

    },

    fecha: {

        type: Date,

        required: true,

        default: Date.now

    }

},
{

    timestamps: false,

    collection: 'Notifi'

});

module.exports = mongoose.model('Notifi', notifiSchema);