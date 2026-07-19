const express = require('express');

const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const { permitirRoles } = require('../middleware/verificarRol');

const {

    crearCliente,
    getClientes,
    getClienteById,
    actualizarCliente,
    eliminarCliente

} = require('../controllers/clienteController');

router.post('/', verificarToken, permitirRoles('admin', 'user'), crearCliente);

router.get('/', verificarToken, getClientes);

router.get('/:id', verificarToken, getClienteById);

router.put('/:id', verificarToken, permitirRoles('admin', 'user'), actualizarCliente);

router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarCliente);

module.exports = router;