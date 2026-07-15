const Notifi = require('../models/Notifi');

/* ===========================
   Crear notificación
=========================== */

const crearNotifi = async (req, res) => {

    try {

        const notifi = new Notifi(req.body);

        await notifi.save();

        const resultado = await Notifi
            .findById(notifi._id)
            .populate('usuario', 'nombre email');

        res.status(201).json(resultado);

    } catch (error) {

        res.status(500).json({
            ok: false,
            mensaje: 'Error al crear la notificación',
            error: error.message
        });

    }

};

/* ===========================
   Obtener todas
=========================== */

const getNotifis = async (req, res) => {

    try {

        const notifis = await Notifi
            .find()
            .populate('usuario', 'nombre email')
            .sort({ fecha: -1 });

        res.json(notifis);

    } catch (error) {

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener las notificaciones',
            error: error.message
        });

    }

};

/* ===========================
   Obtener por ID
=========================== */

const getNotifiById = async (req, res) => {

    try {

        const notifi = await Notifi
            .findById(req.params.id)
            .populate('usuario', 'nombre email');

        if (!notifi) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Notificación no encontrada'
            });

        }

        res.json(notifi);

    } catch (error) {

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener la notificación',
            error: error.message
        });

    }

};

/* ===========================
   Actualizar
=========================== */

const actualizarNotifi = async (req, res) => {

    try {

        const notifi = await Notifi.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        ).populate('usuario', 'nombre email');

        if (!notifi) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Notificación no encontrada'
            });

        }

        res.json(notifi);

    } catch (error) {

        res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar la notificación',
            error: error.message
        });

    }

};

/* ===========================
   Eliminar
=========================== */

const eliminarNotifi = async (req, res) => {

    try {

        const notifi = await Notifi.findByIdAndDelete(req.params.id);

        if (!notifi) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Notificación no encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Notificación eliminada correctamente'
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar la notificación',
            error: error.message
        });

    }

};

module.exports = {

    crearNotifi,

    getNotifis,

    getNotifiById,

    actualizarNotifi,

    eliminarNotifi

};