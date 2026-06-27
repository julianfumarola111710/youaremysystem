const express = require('express');
const router = express.Router();

const {
  crearProducto,
  getProductos,
  getProductoById,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productoController');

// POST   /api/producto          → Crear producto
router.post('/', crearProducto);

// GET    /api/producto          → Obtener todos
router.get('/', getProductos);

// GET    /api/producto/:id      → Obtener uno por ID
router.get('/:id', getProductoById);

// PUT    /api/producto/:id      → Actualizar
router.put('/:id', actualizarProducto);

// DELETE /api/producto/:id      → Eliminar
router.delete('/:id', eliminarProducto);

module.exports = router;