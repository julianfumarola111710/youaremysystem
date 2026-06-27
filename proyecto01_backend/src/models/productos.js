const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },

    codigo_sku: {
      type: String,
      required: [true, 'El código SKU es obligatorio'],
      unique: true,
      uppercase: true,
      trim: true,
      // Regex
      match: [
        /^[A-Z]{3}-\d{4}$/,
        'El SKU debe tener el formato AAA-0000 (3 letras mayúsculas, guion, 4 números). Ej: ELE-1234'
      ]
    },

    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      // Enum: solo se aceptan estos valores exactos
      enum: {
        values: ['Electronica', 'Hogar', 'Oficina', 'Ropa', 'Alimentos'],
        message: 'La categoría "{VALUE}" no es válida. Use: Electronica, Hogar, Oficina, Ropa o Alimentos'
      }
    },

    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },

    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },

    descripcion: {
      type: String,
      trim: true,
      default: ''
    },

    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    // timestamps: true → genera automáticamente createdAt y updatedAt
    timestamps: true
  }
);

module.exports = mongoose.model('Producto', ProductoSchema);
