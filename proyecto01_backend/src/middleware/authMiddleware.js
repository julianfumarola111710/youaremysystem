const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {

    try {

        const authHeader = req.headers['authorization'];

        if (!authHeader) {

            return res.status(401).json({
                ok: false,
                mensaje: 'Token requerido'
            });

        }

        const token = authHeader.split(' ')[1];

        if (!token) {

            return res.status(401).json({
                ok: false,
                mensaje: 'Token inválido'
            });

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            ok: false,
            mensaje: 'Token no válido'
        });

    }

};

module.exports = verificarToken;