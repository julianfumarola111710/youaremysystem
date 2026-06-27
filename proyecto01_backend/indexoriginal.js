require('dotenv').config();

const express = require('express');
const path = require('path');
const conectarDB = require('./src/config/db');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const productosRoutes = require('./src/routes/productosRoutes');
const stakeholderRoutes = require('./src/routes/stakeholderRoutes');
const app = express();

// Conectar base de datos
conectarDB();

// Middleware para leer JSON
app.use(express.json());
const cors = require('cors');
app.use(cors());
// Registrar rutas
app.use('/api/usuario', usuarioRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/stakeholder', stakeholderRoutes);

//ESTO ES PRUEBA
app.use('/api/usuario', authRoutes);
require('./routes/authRoutes');

// Ruta de prueba
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nopostman.html'));

  //res.send('Servidor Express funcionando 🚀');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
