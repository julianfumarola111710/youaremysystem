const express = require('express');

const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const {

    crearCliente,
    getClientes,
    getClienteById,
    actualizarCliente,
    eliminarCliente

} = require('../controllers/clienteController');

router.post('/', verificarToken, crearCliente);

router.get('/', verificarToken, getClientes);

router.get('/:id', verificarToken, getClienteById);

router.put('/:id', verificarToken, actualizarCliente);

router.delete('/:id', verificarToken, eliminarCliente);

module.exports = router;