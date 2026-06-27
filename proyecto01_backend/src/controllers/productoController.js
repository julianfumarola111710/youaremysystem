const Producto = require('../models/productos');

// ─────────────────────────────────────────────
// POST  /api/producto  →  Crear nuevo producto
// ─────────────────────────────────────────────
const crearProducto = async (req, res) => {
  try {
    const { nombre, codigo_sku, categoria, precio, stock, descripcion } = req.body;

    const nuevoProducto = new Producto({
      nombre,
      codigo_sku,
      categoria,
      precio,
      stock,
      descripcion
    });

    const productoGuardado = await nuevoProducto.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Producto creado exitosamente',
      producto: productoGuardado
    });

  } catch (error) {
    // Mongoose lanza ValidationError cuando falla Regex o Enum
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        ok: false,
        mensaje: 'Error de validación',
        errores: mensajes
      });
    }

    // Error de clave duplicada (SKU repetido)
    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El código SKU ya existe en la base de datos'
      });
    }

    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────
// GET  /api/producto  →  Obtener todos los productos
// ─────────────────────────────────────────────
const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find();

    res.status(200).json({
      ok: true,
      total: productos.length,
      productos
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener productos',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────
// GET  /api/producto/:id  →  Obtener producto por ID
// ─────────────────────────────────────────────
const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      ok: true,
      producto
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener el producto',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────
// PUT  /api/producto/:id  →  Actualizar producto
// ─────────────────────────────────────────────
const actualizarProducto = async (req, res) => {
  try {
    const { nombre, codigo_sku, categoria, precio, stock, descripcion, activo } = req.body;

    // runValidators: true → aplica las reglas de Regex y Enum también en el UPDATE
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, codigo_sku, categoria, precio, stock, descripcion, activo },
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado para actualizar'
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: 'Producto actualizado correctamente',
      producto: productoActualizado
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        ok: false,
        mensaje: 'Error de validación al actualizar',
        errores: mensajes
      });
    }

    res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar producto',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────
// DELETE  /api/producto/:id  →  Eliminar producto
// ─────────────────────────────────────────────
const eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado para eliminar'
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: 'Producto eliminado correctamente',
      producto: productoEliminado
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al eliminar producto',
      error: error.message
    });
  }
};

module.exports = {
  crearProducto,
  getProductos,
  getProductoById,
  actualizarProducto,
  eliminarProducto
};
