const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

// Crear nuevo usuario
const crearUsuario = async (req, res) => {

  try {

    const { nombre, email, password, rol } = req.body;

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      rol
    });

    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      ok: false,
      mensaje: 'Error al crear usuario',
      error: error.message
    });

  }

};

// Obtener todos los usuarios
const getUsers = async (req, res) => {

  try {

    const usuarios = await Usuario.find();

    res.json({
      ok: true,
      usuarios
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener usuarios',
      error: error.message
    });

  }

};

// Obtener usuario por ID
const getUserById = async (req, res) => {

  try {

    const user = await Usuario.findById(req.params.id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });

    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error obteniendo usuario',
      error: error.message
    });

  }

};
// Actualizar usuario
const actualizarUsuario = async (req, res) => {

  try {

    const { nombre, email, password, rol, activo } = req.body;

    const datosActualizar = {
      nombre,
      email,
      rol,
      activo
    };

    // Si enviaron contraseña nueva, volver a encriptarla
    if (password && password.trim() !== '') {

      const salt = bcrypt.genSaltSync(10);

      datosActualizar.password = bcrypt.hashSync(password, salt);

    }

    const usuario = await Usuario.findByIdAndUpdate(

      req.params.id,

      datosActualizar,

      {
        new: true,
        runValidators: true
      }

    );

    if (!usuario) {

      return res.status(404).json({

        ok: false,

        mensaje: 'Usuario no encontrado'

      });

    }

    res.json({

      ok: true,

      usuario

    });

  }

  catch (error) {

    res.status(500).json({

      ok: false,

      mensaje: 'Error actualizando usuario',

      error: error.message

    });

  }

};
// Eliminar usuario
const eliminarUsuario = async (req, res) => {

  try {

    const usuario = await Usuario.findByIdAndDelete(

      req.params.id

    );

    if (!usuario) {

      return res.status(404).json({

        ok: false,

        mensaje: 'Usuario no encontrado'

      });

    }

    res.json({

      ok: true,

      mensaje: 'Usuario eliminado'

    });

  }

  catch (error) {

    res.status(500).json({

      ok: false,

      mensaje: 'Error eliminando usuario',

      error: error.message

    });

  }

};
module.exports = {
  crearUsuario,
  getUsers,
  getUserById,
  actualizarUsuario,
  eliminarUsuario
};