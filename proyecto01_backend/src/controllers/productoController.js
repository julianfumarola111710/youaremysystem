const Producto = require('../models/productos');

// Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      codigo_sku,
      categoria,
      precio,
      stock,
      descripcion,
      activo
    } = req.body;

    const skuNormalizado = codigo_sku
      ? codigo_sku.trim().toUpperCase()
      : '';

    // Comprobar si el SKU ya está registrado
    const productoExistente = await Producto.findOne({
      codigo_sku: skuNormalizado
    });

    if (productoExistente) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El código SKU ya existe en la base de datos'
      });
    }

    const nuevoProducto = new Producto({
      nombre,
      codigo_sku: skuNormalizado,
      categoria,
      precio,
      stock,
      descripcion,
      activo
    });

    const productoGuardado =
      await nuevoProducto.save();

    return res.status(201).json({
      ok: true,
      mensaje: 'Producto creado exitosamente',
      producto: productoGuardado
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors)
        .map(item => item.message);

      return res.status(400).json({
        ok: false,
        mensaje: 'Error de validación',
        errores: mensajes
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El código SKU ya existe en la base de datos'
      });
    }

    console.error(error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const productos = await Producto
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      total: productos.length,
      productos
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener productos'
    });
  }
};

// Obtener un producto por ID
const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(
      req.params.id
    );

    if (!producto) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado'
      });
    }

    return res.status(200).json({
      ok: true,
      producto
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener el producto'
    });
  }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
  try {
    const {
      nombre,
      codigo_sku,
      categoria,
      precio,
      stock,
      descripcion,
      activo
    } = req.body;

    const skuNormalizado = codigo_sku
      ? codigo_sku.trim().toUpperCase()
      : '';

    // Buscar otro producto que ya tenga ese SKU
    const productoConMismoSku =
      await Producto.findOne({
        codigo_sku: skuNormalizado,
        _id: {
          $ne: req.params.id
        }
      });

    if (productoConMismoSku) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El código SKU ya pertenece a otro producto'
      });
    }

    const productoActualizado =
      await Producto.findByIdAndUpdate(
        req.params.id,
        {
          nombre,
          codigo_sku: skuNormalizado,
          categoria,
          precio,
          stock,
          descripcion,
          activo
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!productoActualizado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado para actualizar'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Producto actualizado correctamente',
      producto: productoActualizado
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors)
        .map(item => item.message);

      return res.status(400).json({
        ok: false,
        mensaje: 'Error de validación al actualizar',
        errores: mensajes
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El código SKU ya pertenece a otro producto'
      });
    }

    console.error(error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar producto'
    });
  }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
  try {
    const productoEliminado =
      await Producto.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado para eliminar'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Producto eliminado correctamente',
      producto: productoEliminado
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error al eliminar producto'
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