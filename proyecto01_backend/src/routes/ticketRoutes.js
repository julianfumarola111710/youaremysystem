const express = require('express');
const router = express.Router();

const {
    getTickets,
    getTicket,
    crearTicket,
    actualizarTicket,
    eliminarTicket
} = require('../controllers/ticketController');

router.get('/', getTickets);
router.get('/:id', getTicket);
router.post('/', crearTicket);
router.put('/:id', actualizarTicket);
router.delete('/:id', eliminarTicket);

module.exports = router;