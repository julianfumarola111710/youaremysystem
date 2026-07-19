const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//
// Función auxiliar: genera Access Token (15 min)
3
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

    // Si no existe ningún usuario en la BD, crear un admin
    // por defecto con el correo y contraseña enviados en este login

    const totalUsuarios = await Usuario.countDocuments();

    if (totalUsuarios === 0) {

      const salt = bcrypt.genSaltSync(10);

      const passwordHash = bcrypt.hashSync(password, salt);

      await Usuario.create({

        nombre: 'Administrador',

        email,

        password: passwordHash,

        rol: 'admin',

        activo: true

      });

    }

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

    //  Verificar que se envió el token
    if (!refreshToken) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Refresh Token requerido'
      });
    }

    //  Verificar que el token es válido y no expiró
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Refresh Token inválido o expirado'
      });
    }

    //  Buscar usuario y validar que el token coincide con el guardado en BD
    const usuario = await Usuario.findById(decoded.uid);
    if (!usuario || usuario.refreshToken !== refreshToken) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Refresh Token no reconocido'
      });
    }

    // 4. Generar nuevo Access Token
    const nuevoAccessToken = generarAccessToken(usuario);

    // 5. Respuesta
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

    // Eliminar el Refresh Token de la BD (invalida la sesión)
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