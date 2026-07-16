const express = require('express');
const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const {
  crearProducto,
  getProductos,
  getProductoById,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productoController');

const verificarAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({
      ok: false,
      mensaje: 'No tiene permisos para realizar esta acción'
    });
  }

  next();
};

// Crear producto: solo administrador
router.post(
  '/',
  verificarToken,
  verificarAdmin,
  crearProducto
);

// Consultar productos: cualquier usuario autenticado
router.get(
  '/',
  verificarToken,
  getProductos
);

// Consultar un producto: cualquier usuario autenticado
router.get(
  '/:id',
  verificarToken,
  getProductoById
);

// Actualizar producto: solo administrador
router.put(
  '/:id',
  verificarToken,
  verificarAdmin,
  actualizarProducto
);

// Eliminar producto: solo administrador
router.delete(
  '/:id',
  verificarToken,
  verificarAdmin,
  eliminarProducto
);

module.exports = router;