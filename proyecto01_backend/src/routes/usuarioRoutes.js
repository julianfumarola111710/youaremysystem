const express = require('express');

const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const { permitirRoles } = require('../middleware/verificarRol');

const {

  crearUsuario,

  getUsers,

  getUserById,

  actualizarUsuario,

  eliminarUsuario

} = require('../controllers/usuarioController');


// Crear usuario: admin o user (user solo puede crear guest, validado en el controller)
router.post('/', verificarToken, permitirRoles('admin', 'user'), crearUsuario);

// Obtener todos los usuarios: cualquier autenticado
router.get('/', verificarToken, getUsers);

// Obtener usuario por ID: cualquier autenticado
router.get('/:id', verificarToken, getUserById);

// Actualizar usuario: admin o user
router.put('/:id', verificarToken, permitirRoles('admin', 'user'), actualizarUsuario);

// Eliminar usuario: solo admin
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarUsuario);

module.exports = router;