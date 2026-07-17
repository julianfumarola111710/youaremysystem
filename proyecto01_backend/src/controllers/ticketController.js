const Ticket = require('../models/Ticket');

/* ===========================
   Obtener todos
=========================== */
exports.getTickets = async (req, res) => {

    try {

        const tickets = await Ticket.find()
            .populate('cliente', 'nombre')
            .populate('responsable', 'nombre');

        res.json(tickets);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

/* ===========================
   Obtener uno por ID
=========================== */
exports.getTicket = async (req, res) => {

    try {

        const ticket = await Ticket.findById(req.params.id)
            .populate('cliente', 'nombre')
            .populate('responsable', 'nombre');

        if (!ticket) {

            return res.status(404).json({ error: 'Ticket no encontrado' });

        }

        res.json(ticket);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

/* ===========================
   Crear
=========================== */
exports.crearTicket = async (req, res) => {

    try {

        const ticket = await Ticket.create(req.body);

        res.status(201).json(ticket);

    } catch (err) {

        res.status(400).json({ error: err.message });

    }

};

/* ===========================
   Actualizar
=========================== */
exports.actualizarTicket = async (req, res) => {

    try {

        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!ticket) {

            return res.status(404).json({ error: 'Ticket no encontrado' });

        }

        res.json(ticket);

    } catch (err) {

        res.status(400).json({ error: err.message });

    }

};

/* ===========================
   Eliminar
=========================== */
exports.eliminarTicket = async (req, res) => {

    try {

        const ticket = await Ticket.findByIdAndDelete(req.params.id);

        if (!ticket) {

            return res.status(404).json({ error: 'Ticket no encontrado' });

        }

        res.json({ ok: true });

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};