const express = require('express');

const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const {

    crearNotifi,

    getNotifis,

    getNotifiById,

    actualizarNotifi,

    eliminarNotifi

} = require('../controllers/notifiController');


/* ===========================
   Crear
=========================== */

router.post(
    '/',
    verificarToken,
    crearNotifi
);


/* ===========================
   Obtener todas
=========================== */

router.get(
    '/',
    verificarToken,
    getNotifis
);


/* ===========================
   Obtener por ID
=========================== */

router.get(
    '/:id',
    verificarToken,
    getNotifiById
);


/* ===========================
   Actualizar
=========================== */

router.put(
    '/:id',
    verificarToken,
    actualizarNotifi
);


/* ===========================
   Eliminar
=========================== */

router.delete(
    '/:id',
    verificarToken,
    eliminarNotifi
);

module.exports = router;