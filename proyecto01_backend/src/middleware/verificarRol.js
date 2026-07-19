const { esNivelIgualOInferior } = require('../utils/roles');

// Bloquea acceso si el rol del usuario no está en la lista permitida
function permitirRoles(...rolesPermitidos) {

    return (req, res, next) => {

        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {

            return res.status(403).json({

                ok: false,

                mensaje: 'No tienes permisos para realizar esta acción'

            });

        }

        next();

    };

}

module.exports = { permitirRoles };