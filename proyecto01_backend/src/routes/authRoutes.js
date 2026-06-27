const express = require('express');
const router = express.Router();

const { login, refreshToken, logout } = require('../controllers/authController');

// POST /api/auth/login          → Iniciar sesión
router.post('/login', login);

// POST /api/auth/refresh-token  → Renovar Access Token
router.post('/refresh-token', refreshToken);

// POST /api/auth/logout         → Cerrar sesión
router.post('/logout', logout);

module.exports = router;