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
// GET /api/auth/existe-usuarios
//
const existeUsuarios = async (req, res) => {

  try {

    const total = await Usuario.countDocuments();

    res.json({

      ok: true,

      existeUsuarios: total > 0

    });

  } catch (error) {

    res.status(500).json({

      ok: false,

      mensaje: 'Error al verificar usuarios'

    });

  }

};

//
// POST /api/auth/crear-admin-inicial
//
const crearAdminInicial = async (req, res) => {

  try {

    const total = await Usuario.countDocuments();

    if (total > 0) {

      return res.status(400).json({

        ok: false,

        mensaje: 'Ya existen usuarios registrados. No se puede crear el admin inicial.'

      });

    }

    const salt = bcrypt.genSaltSync(10);

    const passwordHash = bcrypt.hashSync('Admin123*', salt);

    const usuario = await Usuario.create({

      nombre: 'Administrador',

      email: 'admin@crm.com',

      password: passwordHash,

      rol: 'admin',

      activo: true

    });

    // Generar tokens y loguear automáticamente

    const accessToken = generarAccessToken(usuario);

    const refreshToken = generarRefreshToken(usuario);

    usuario.refreshToken = refreshToken;

    await usuario.save();

    res.status(201).json({

      ok: true,

      mensaje: 'Usuario administrador creado correctamente',

      accessToken,

      refreshToken,

      usuario: {

        id: usuario._id,

        nombre: usuario.nombre,

        email: usuario.email,

        rol: usuario.rol

      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      ok: false,

      mensaje: 'Error al crear el administrador inicial'

    });

  }

};

//
// POST /api/auth/login
//
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    const passwordValido = bcrypt.compareSync(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    const accessToken  = generarAccessToken(usuario);
    const refreshToken = generarRefreshToken(usuario);

    usuario.refreshToken = refreshToken;
    await usuario.save();

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
  logout,
  existeUsuarios,
  crearAdminInicial
};