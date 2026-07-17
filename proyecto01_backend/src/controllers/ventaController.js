const Venta = require('../models/Venta');

/* ===========================
   Obtener todas
=========================== */
exports.getVentas = async (req, res) => {

    try {

        const ventas = await Venta.find()
            .populate('cliente', 'nombre')
            .populate('usuario', 'nombre')
            .populate('producto', 'nombre');

        res.json(ventas);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

/* ===========================
   Obtener una por ID
=========================== */
exports.getVenta = async (req, res) => {

    try {

        const venta = await Venta.findById(req.params.id)
            .populate('cliente', 'nombre')
            .populate('usuario', 'nombre')
            .populate('producto', 'nombre');

        if (!venta) {

            return res.status(404).json({ error: 'Venta no encontrada' });

        }

        res.json(venta);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

/* ===========================
   Crear
=========================== */
exports.crearVenta = async (req, res) => {

    try {

        const venta = await Venta.create(req.body);

        res.status(201).json(venta);

    } catch (err) {

        res.status(400).json({ error: err.message });

    }

};

/* ===========================
   Actualizar
=========================== */
exports.actualizarVenta = async (req, res) => {

    try {

        const venta = await Venta.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!venta) {

            return res.status(404).json({ error: 'Venta no encontrada' });

        }

        res.json(venta);

    } catch (err) {

        res.status(400).json({ error: err.message });

    }

};

/* ===========================
   Eliminar
=========================== */
exports.eliminarVenta = async (req, res) => {

    try {

        const venta = await Venta.findByIdAndDelete(req.params.id);

        if (!venta) {

            return res.status(404).json({ error: 'Venta no encontrada' });

        }

        res.json({ ok: true });

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};