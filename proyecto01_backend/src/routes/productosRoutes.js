const express = require('express');
const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const { permitirRoles } = require('../middleware/verificarRol');

const {
  crearProducto,
  getProductos,
  getProductoById,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productoController');

// Crear producto: solo administrador
router.post('/', verificarToken, permitirRoles('admin'), crearProducto);

// Consultar productos: cualquier usuario autenticado
router.get('/', verificarToken, getProductos);

// Consultar un producto: cualquier usuario autenticado
router.get('/:id', verificarToken, getProductoById);

// Actualizar producto: solo administrador
router.put('/:id', verificarToken, permitirRoles('admin'), actualizarProducto);

// Eliminar producto: solo administrador
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarProducto);

module.exports = router;