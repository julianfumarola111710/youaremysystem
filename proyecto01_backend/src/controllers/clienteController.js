const Cliente = require('../models/Clientes');

// Crear
const crearCliente = async (req, res) => {

    try {

        const cliente = await Cliente.create(req.body);

        res.status(201).json(cliente);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

// Obtener todos

const getClientes = async (req, res) => {

    try {

        const clientes = await Cliente.find();

        res.json(clientes);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

// Obtener por id

const getClienteById = async (req, res) => {

    try {

        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {

            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });

        }

        res.json(cliente);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

// Actualizar

const actualizarCliente = async (req, res) => {

    try {

        const cliente = await Cliente.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true
            }

        );

        if (!cliente) {

            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });

        }

        res.json(cliente);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

// Eliminar

const eliminarCliente = async (req, res) => {

    try {

        const cliente = await Cliente.findByIdAndDelete(req.params.id);

        if (!cliente) {

            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });

        }

        res.json({
            mensaje: "Cliente eliminado"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

module.exports = {

    crearCliente,
    getClientes,
    getClienteById,
    actualizarCliente,
    eliminarCliente

};