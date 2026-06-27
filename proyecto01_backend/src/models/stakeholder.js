const mongoose = require("mongoose");

// ── Sub-schema: historial de compras (solo Clientes) ──────────────────────────
const historialCompraSchema = new mongoose.Schema(
  {
    producto: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      trim: true,
    },
    monto: {
      type: Number,
      required: [true, "El monto es requerido"],
      min: [0, "El monto no puede ser negativo"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es requerida"],
    },
  },
  { _id: false }
);

// ── Schema principal ──────────────────────────────────────────────────────────
const stakeholderSchema = new mongoose.Schema(
  {
    // ── Discriminador de tipo ────────────────────────────────────────────────
    type: {
      type: String,
      enum: {
        values: ["CLIENTE", "PROVEEDOR"],
        message: "El tipo debe ser CLIENTE o PROVEEDOR",
      },
      required: [true, "El tipo de stakeholder es requerido"],
    },

    // ── Campos comunes ───────────────────────────────────────────────────────
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [100, "El nombre no puede superar 100 caracteres"],
      trim: true,
    },

    identificacion: {
      type: String,
      required: [true, "La identificación es requerida"],
      unique: true,
      trim: true,
      // Acepta formatos: CLI-90876 o PROV-5543
      match: [
        /^[A-Z]+-\d+$/,
        "La identificación debe tener el formato TIPO-NÚMERO (ej. CLI-12345)",
      ],
    },

    email: {
      type: String,
      required: [true, "El correo electrónico es requerido"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
        "Por favor ingrese un correo electrónico válido",
      ],
    },

    telefono: {
      type: String,
      required: [true, "El teléfono es requerido"],
      match: [
        /^\d{7,15}$/,
        "El teléfono debe contener solo dígitos (entre 7 y 15)",
      ],
    },

    direccion: {
      type: String,
      maxlength: [200, "La dirección no puede superar 200 caracteres"],
      trim: true,
    },

    estado: {
      type: String,
      enum: {
        values: ["activo", "inactivo", "suspendido"],
        message: "El estado debe ser activo, inactivo o suspendido",
      },
      default: "activo",
    },

    //  Campos exclusivos de CLIENTE 
    nivelFidelidad: {
      type: String,
      enum: {
        values: ["BRONCE", "PLATA", "ORO", "PLATINO"],
        message:
          "El nivel de fidelidad debe ser BRONCE, PLATA, ORO o PLATINO",
      },
      // Requerido solo si type === CLIENTE (validado en el controlador)
    },

    limiteCredito: {
      type: Number,
      min: [0, "El límite de crédito no puede ser negativo"],
      max: [10000, "El límite de crédito no puede superar 10,000.00"],
      default: 0,
    },

    tarjetaComercio: {
      type: Boolean,
      default: false,
    },

    historialCompras: {
      type: [historialCompraSchema],
      default: [],
    },

    // ── Campos exclusivos de PROVEEDOR ───────────────────────────────────────
    categoriaProveedor: {
      type: String,
      enum: {
        values: ["TECNOLOGIA", "LOGISTICA", "SERVICIOS", "MATERIA_PRIMA"],
        message:
          "La categoría debe ser TECNOLOGIA, LOGISTICA, SERVICIOS o MATERIA_PRIMA",
      },
    },

    paisOrigen: {
      type: String,
      match: [
        /^[A-Za-z\s]+$/,
        "El país de origen solo debe contener letras y espacios",
      ],
      trim: true,
    },

    certificaciones: {
      type: [String],
      default: [],
    },

    tiempoEntregaPromedio: {
      type: Number,
      min: [0, "El tiempo de entrega no puede ser negativo"],
    },
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
    collection: "stakeholders",
  }
);

// ── Validaciones cross-field antes de guardar
stakeholderSchema.pre("validate", function () {
  if (this.type === "CLIENTE") {
    if (!this.nivelFidelidad) {
      this.invalidate(
        "nivelFidelidad",
        "El nivel de fidelidad es requerido para CLIENTE"
      );
    }
  }

  if (this.type === "PROVEEDOR") {
    if (!this.categoriaProveedor) {
      this.invalidate(
        "categoriaProveedor",
        "La categoría del proveedor es requerida para PROVEEDOR"
      );
    }
    if (!this.paisOrigen) {
      this.invalidate(
        "paisOrigen",
        "El país de origen es requerido para PROVEEDOR"
      );
    }
  }
});

module.exports = mongoose.model("Stakeholder", stakeholderSchema);