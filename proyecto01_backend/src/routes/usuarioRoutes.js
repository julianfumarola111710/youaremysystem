const express = require('express');

const router = express.Router();

const verificarToken = require('../middleware/authMiddleware'); 

const {
  crearUsuario,
  getUsers,
  getUserById
} = require('../controllers/usuarioController');


// Crear usuario
router.post('/',verificarToken, crearUsuario);

// Obtener todos los usuarios
router.get('/',verificarToken, getUsers);

// Obtener usuario por ID
router.get('/:id',verificarToken, getUserById);

module.exports = router;
