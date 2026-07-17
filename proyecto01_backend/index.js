require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const conectarDB = require('./src/config/db');

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const productosRoutes = require('./src/routes/productosRoutes');
const stakeholderRoutes = require('./src/routes/stakeholderRoutes');
const authRoutes = require('./src/routes/authRoutes');
const clientesRoutes = require('./src/routes/clientesRoutes');
const notifiRoutes = require('./src/routes/notifiRoutes');
const actividadRoutes = require('./src/routes/actividadRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');

const app = express();

// Conectar base de datos
conectarDB();

// Middleware
app.use(cors());
app.use(express.json());

// Registrar rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/stakeholder', stakeholderRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/notifi', notifiRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/ventas', ventaRoutes);

// Servir el build de Angular
app.use(express.static(path.join(__dirname, '../frontend/dist/frontend/browser')));

// Catch-all: cualquier ruta que no sea /api/* devuelve el index.html de Angular
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/frontend/browser/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});