const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//
// Función auxiliar: genera Access Token (15 min)
//
const generarAccessToken = (usuario) => {
  return jwt.sign(
    {
      uid: usuario._id,
      nombre: usuario.nombre,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

//
// Función auxiliar: genera Refresh Token (7 días)
//
const generarRefreshToken = (usuario) => {
  return jwt.sign(
    {
      uid: usuario._id
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

//
// POST /api/auth/login
//
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // 2. Validar contraseña
    const passwordValido = bcrypt.compareSync(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // 3. Generar Access Token y Refresh Token
    const accessToken  = generarAccessToken(usuario);
    const refreshToken = generarRefreshToken(usuario);

    // 4. Guardar Refresh Token en la base de datos
    usuario.refreshToken = refreshToken;
    await usuario.save();

    // 5. Respuesta
    res.json({
      ok: true,
      mensaje: 'Login exitoso',
      accessToken,
      refreshToken,
      usuario: {
        id:     usuario._id,
        nombre: usuario.nombre,
        email:  usuario.email,
        rol:    usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error en login'
    });
  }
};

//
// POST /api/auth/refresh-token
//
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Refresh Token requerido'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Refresh Token inválido o expirado'
      });
    }

    const usuario = await Usuario.findById(decoded.uid);
    if (!usuario || usuario.refreshToken !== refreshToken) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Refresh Token no reconocido'
      });
    }

    const nuevoAccessToken = generarAccessToken(usuario);

    res.json({
      ok: true,
      mensaje: 'Access Token renovado',
      accessToken: nuevoAccessToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al renovar token'
    });
  }
};

//
// POST /api/auth/logout
//
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Refresh Token requerido'
      });
    }

    const usuario = await Usuario.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null }
    );

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Token no encontrado'
      });
    }

    res.json({
      ok: true,
      mensaje: 'Sesión cerrada correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al cerrar sesión'
    });
  }
};

module.exports = {
  login,
  refreshToken,
  logout
};