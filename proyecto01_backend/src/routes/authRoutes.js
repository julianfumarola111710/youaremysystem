const express = require('express');
const router = express.Router();

const {
  login,
  refreshToken,
  logout,
  existeUsuarios,
  crearAdminInicial
} = require('../controllers/authController');

// GET /api/auth/existe-usuarios     → Verificar si hay usuarios en la BD
router.get('/existe-usuarios', existeUsuarios);

// POST /api/auth/crear-admin-inicial → Crear el admin por defecto (solo si no hay usuarios)
router.post('/crear-admin-inicial', crearAdminInicial);

// POST /api/auth/login          → Iniciar sesión
router.post('/login', login);

// POST /api/auth/refresh-token  → Renovar Access Token
router.post('/refresh-token', refreshToken);

// POST /api/auth/logout         → Cerrar sesión
router.post('/logout', logout);

module.exports = router;