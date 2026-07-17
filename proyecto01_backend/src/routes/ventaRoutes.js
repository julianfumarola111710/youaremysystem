const express = require('express');
const router = express.Router();

const {
    getVentas,
    getVenta,
    crearVenta,
    actualizarVenta,
    eliminarVenta
} = require('../controllers/ventaController');

router.get('/', getVentas);
router.get('/:id', getVenta);
router.post('/', crearVenta);
router.put('/:id', actualizarVenta);
router.delete('/:id', eliminarVenta);

module.exports = router;