const express = require('express');
const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const { permitirRoles } = require('../middleware/verificarRol');

const {
    getVentas,
    getVenta,
    crearVenta,
    actualizarVenta,
    eliminarVenta
} = require('../controllers/ventaController');

router.get('/', verificarToken, getVentas);
router.get('/:id', verificarToken, getVenta);
router.post('/', verificarToken, permitirRoles('admin', 'user'), crearVenta);
router.put('/:id', verificarToken, permitirRoles('admin', 'user'), actualizarVenta);
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarVenta);

module.exports = router;