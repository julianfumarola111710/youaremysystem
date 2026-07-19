const express = require('express');
const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const { permitirRoles } = require('../middleware/verificarRol');

const {
    getTickets,
    getTicket,
    crearTicket,
    actualizarTicket,
    eliminarTicket
} = require('../controllers/ticketController');

router.get('/', verificarToken, getTickets);
router.get('/:id', verificarToken, getTicket);
router.post('/', verificarToken, permitirRoles('admin', 'user'), crearTicket);
router.put('/:id', verificarToken, permitirRoles('admin', 'user'), actualizarTicket);
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarTicket);

module.exports = router;