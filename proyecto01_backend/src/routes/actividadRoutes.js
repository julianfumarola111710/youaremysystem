const express = require('express');
const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const { permitirRoles } = require('../middleware/verificarRol');

const {
    getActividades,
    getActividad,
    crearActividad,
    actualizarActividad,
    eliminarActividad
} = require('../controllers/actividadController');

router.get('/', verificarToken, getActividades);
router.get('/:id', verificarToken, getActividad);
router.post('/', verificarToken, permitirRoles('admin', 'user'), crearActividad);
router.put('/:id', verificarToken, permitirRoles('admin', 'user'), actualizarActividad);
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarActividad);

module.exports = router;