const express = require('express');
const router = express.Router();

const {
    getActividades,
    getActividad,
    crearActividad,
    actualizarActividad,
    eliminarActividad
} = require('../controllers/actividadController');

router.get('/', getActividades);
router.get('/:id', getActividad);
router.post('/', crearActividad);
router.put('/:id', actualizarActividad);
router.delete('/:id', eliminarActividad);

module.exports = router;