const Actividad = require('../models/Actividad');
const Usuario = require('../models/usuario');
const { esNivelIgualOInferior } = require('../utils/roles');

/* ===========================
   Obtener todas
=========================== */
exports.getActividades = async (req, res) => {

    try {

        const actividades = await Actividad.find()
            .populate('cliente', 'nombre')
            .populate('responsable', 'nombre');

        res.json(actividades);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

/* ===========================
   Obtener una por ID
=========================== */
exports.getActividad = async (req, res) => {

    try {

        const actividad = await Actividad.findById(req.params.id)
            .populate('cliente', 'nombre')
            .populate('responsable', 'nombre');

        if (!actividad) {

            return res.status(404).json({ error: 'Actividad no encontrada' });

        }

        res.json(actividad);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

/* ===========================
   Crear
=========================== */
exports.crearActividad = async (req, res) => {

    try {

        const responsableDestino = await Usuario.findById(req.body.responsable);

        if (!responsableDestino) {

            return res.status(404).json({ error: 'Usuario responsable no encontrado' });

        }

        const rolQuienAsigna = req.usuario.rol;

        if (!esNivelIgualOInferior(rolQuienAsigna, responsableDestino.rol)) {

            return res.status(403).json({

                error: 'No puedes asignar actividades a un usuario de nivel superior'

            });

        }

        const actividad = await Actividad.create(req.body);

        res.status(201).json(actividad);

    } catch (err) {

        res.status(400).json({ error: err.message });

    }

};

/* ===========================
   Actualizar
=========================== */
exports.actualizarActividad = async (req, res) => {

    try {

        const responsableDestino = await Usuario.findById(req.body.responsable);

        if (!responsableDestino) {

            return res.status(404).json({ error: 'Usuario responsable no encontrado' });

        }

        const rolQuienAsigna = req.usuario.rol;

        if (!esNivelIgualOInferior(rolQuienAsigna, responsableDestino.rol)) {

            return res.status(403).json({

                error: 'No puedes asignar actividades a un usuario de nivel superior'

            });

        }

        const actividad = await Actividad.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!actividad) {

            return res.status(404).json({ error: 'Actividad no encontrada' });

        }

        res.json(actividad);

    } catch (err) {

        res.status(400).json({ error: err.message });

    }

};

/* ===========================
   Eliminar
=========================== */
exports.eliminarActividad = async (req, res) => {

    try {

        const actividad = await Actividad.findByIdAndDelete(req.params.id);

        if (!actividad) {

            return res.status(404).json({ error: 'Actividad no encontrada' });

        }

        res.json({ ok: true });

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};