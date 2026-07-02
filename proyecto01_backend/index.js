require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const conectarDB = require('./src/config/db');

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const productosRoutes = require('./src/routes/productosRoutes');
const stakeholderRoutes = require('./src/routes/stakeholderRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '../frontend/dist/frontend/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/frontend/browser/index.html'));
});

// Conectar base de datos
conectarDB();

// Middleware
app.use(cors());
app.use(express.json());

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/stakeholder', stakeholderRoutes);

// Ruta de prueba
app.get('/', (req, res) => {

  res.sendFile(
    path.join(__dirname, 'public', 'nopostman.html')
  );

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});