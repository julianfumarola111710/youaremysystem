const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

const ITBMS_RATE = 0.07;

/* ===========================
   Obtener todas
=========================== */
exports.getVentas = async (req, res) => {

    try {

        const ventas = await Venta.find()
            .populate('cliente', 'nombre')
            .populate('usuario', 'nombre')
            .populate('producto', 'nombre precio');

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
            .populate('producto', 'nombre precio');

        if (!venta) {

            return res.status(404).json({ error: 'Venta no encontrada' });

        }

        res.json(venta);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

/* ===========================
   Crear (recalcula montos en backend por seguridad)
=========================== */
exports.crearVenta = async (req, res) => {

    try {

        const producto = await Producto.findById(req.body.producto);

        if (!producto) {

            return res.status(404).json({ error: 'Producto no encontrado' });

        }

        const cantidad = Number(req.body.cantidad);

        const precioUnitario = producto.precio;

        const subtotal = precioUnitario * cantidad;

        const itbms = subtotal * ITBMS_RATE;

        const total = subtotal + itbms;

        const venta = await Venta.create({

            cliente: req.body.cliente,

            usuario: req.body.usuario,

            producto: req.body.producto,

            fecha: req.body.fecha,

            cantidad,

            precioUnitario,

            subtotal,

            itbms,

            total

        });

        res.status(201).json(venta);

    } catch (err) {

        res.status(400).json({ error: err.message });

    }

};

/* ===========================
   Actualizar (recalcula montos)
=========================== */
exports.actualizarVenta = async (req, res) => {

    try {

        const producto = await Producto.findById(req.body.producto);

        if (!producto) {

            return res.status(404).json({ error: 'Producto no encontrado' });

        }

        const cantidad = Number(req.body.cantidad);

        const precioUnitario = producto.precio;

        const subtotal = precioUnitario * cantidad;

        const itbms = subtotal * ITBMS_RATE;

        const total = subtotal + itbms;

        const venta = await Venta.findByIdAndUpdate(
            req.params.id,
            {

                cliente: req.body.cliente,

                usuario: req.body.usuario,

                producto: req.body.producto,

                fecha: req.body.fecha,

                cantidad,

                precioUnitario,

                subtotal,

                itbms,

                total

            },
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