require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const conectarDB = require('./src/config/db');
const Usuario = require('./src/models/usuario');

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const productosRoutes = require('./src/routes/productosRoutes');
const stakeholderRoutes = require('./src/routes/stakeholderRoutes');
const authRoutes = require('./src/routes/authRoutes');
const clientesRoutes = require('./src/routes/clientesRoutes');
const notifiRoutes = require('./src/routes/notifiRoutes');
const actividadRoutes = require('./src/routes/actividadRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');

const app = express();

// Conectar base de datos y crear admin inicial solo si NO hay ningún usuario
conectarDB().then(async () => {

    try {

        const totalUsuarios = await Usuario.countDocuments();

        if (totalUsuarios === 0) {

            const salt = bcrypt.genSaltSync(10);

            const passwordHash = bcrypt.hashSync('Admin123*', salt);

            await Usuario.create({

                nombre: 'Administrador',

                email: 'admin@crm.com',

                password: passwordHash,

                rol: 'admin',

                activo: true

            });

            console.log('Usuario admin inicial creado: admin@crm.com / Admin123*');

        }

    } catch (error) {

        console.error('Error al verificar/crear admin inicial:', error.message);

    }

});

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
app.use('/api/tickets', ticketRoutes);
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