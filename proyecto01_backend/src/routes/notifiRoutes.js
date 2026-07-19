const express = require('express');

const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const { permitirRoles } = require('../middleware/verificarRol');

const {

    crearNotifi,

    getNotifis,

    getNotifiById,

    actualizarNotifi,

    eliminarNotifi

} = require('../controllers/notifiController');


router.post('/', verificarToken, permitirRoles('admin', 'user'), crearNotifi);

router.get('/', verificarToken, getNotifis);

router.get('/:id', verificarToken, getNotifiById);

router.put('/:id', verificarToken, permitirRoles('admin', 'user'), actualizarNotifi);

router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarNotifi);

module.exports = router;