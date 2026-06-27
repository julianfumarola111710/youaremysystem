const Stakeholder = require("../models/Stakeholder");

// ── 1. Crear Stakeholder (POST) ───────────────────────────────────────────────
const crearStakeholder = async (req, res) => {
  try {
    const nuevoStakeholder = new Stakeholder(req.body);
    const guardado = await nuevoStakeholder.save();

    return res.status(201).json({
      success: true,
      mensaje: `${guardado.type} creado exitosamente`,
      data: guardado,
    });
  } catch (error) {
    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        mensaje: "Error de validación",
        errores: mensajes,
      });
    }
    // Clave duplicada (email o identificacion repetida)
    if (error.code === 11000) {
      const campo = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        mensaje: `Ya existe un registro con ese ${campo}`,
      });
    }
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// ── 2. Obtener todos los stakeholders (GET) ────────────────────────────────────
const obtenerTodos = async (req, res) => {
  try {
    const stakeholders = await Stakeholder.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      total: stakeholders.length,
      data: stakeholders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mensaje: "Error al obtener los stakeholders",
      error: error.message,
    });
  }
};

// Obtener todos los CLIENTES (GET) 
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Stakeholder.find({ type: "CLIENTE" }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      total: clientes.length,
      data: clientes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mensaje: "Error al obtener los clientes",
      error: error.message,
    });
  }
};

// Obtener todos los PROVEEDORES (GET) 
const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Stakeholder.find({ type: "PROVEEDOR" }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      total: proveedores.length,
      data: proveedores,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mensaje: "Error al obtener los proveedores",
      error: error.message,
    });
  }
};

// Obtener un stakeholder por ID (GET)
const obtenerPorId = async (req, res) => {
  try {
    const stakeholder = await Stakeholder.findById(req.params.id);
    if (!stakeholder) {
      return res.status(404).json({
        success: false,
        mensaje: "Stakeholder no encontrado",
      });
    }
    return res.status(200).json({
      success: true,
      data: stakeholder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mensaje: "Error al obtener el stakeholder",
      error: error.message,
    });
  }
};

// Actualizar Stakeholder (PUT) 
const actualizarStakeholder = async (req, res) => {
  try {
    const actualizado = await Stakeholder.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          // devuelve el documento actualizado
        runValidators: true, // ejecuta las validaciones del schema
      }
    );

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: "Stakeholder no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      mensaje: "Stakeholder actualizado correctamente",
      data: actualizado,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        mensaje: "Error de validación",
        errores: mensajes,
      });
    }
    return res.status(500).json({
      success: false,
      mensaje: "Error al actualizar el stakeholder",
      error: error.message,
    });
  }
};

// Eliminar Stakeholder 
const eliminarStakeholder = async (req, res) => {
  try {
    const eliminado = await Stakeholder.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        mensaje: "Stakeholder no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      mensaje: "Stakeholder eliminado correctamente",
      data: eliminado,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mensaje: "Error al eliminar el stakeholder",
      error: error.message,
    });
  }
};

// ── Exportar funciones ────────────────────────────────────────────────────────
module.exports = {
  crearStakeholder,
  obtenerTodos,
  obtenerClientes,
  obtenerProveedores,
  obtenerPorId,
  actualizarStakeholder,
  eliminarStakeholder,
};
