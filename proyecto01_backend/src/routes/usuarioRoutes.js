const express = require('express');

const router = express.Router();

const verificarToken = require('../middleware/authMiddleware'); 

const {

  crearUsuario,

  getUsers,

  getUserById,

  actualizarUsuario,

  eliminarUsuario

} = require('../controllers/usuarioController');


// Crear usuario
router.post('/',verificarToken, crearUsuario);

// Obtener todos los usuarios
router.get('/',verificarToken, getUsers);

// Obtener usuario por ID
router.get('/:id',verificarToken, getUserById);

// Actualizar usuario

router.put(

  '/:id',

  verificarToken,

  actualizarUsuario

);


// Eliminar usuario

router.delete(

  '/:id',

  verificarToken,

  eliminarUsuario

);
module.exports = router;
