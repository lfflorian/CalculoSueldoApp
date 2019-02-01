'use strict'

const Cliente = require('../models/cliente')

function getCliente (req, res) {
    let clienteId = req.params.clienteId
    Cliente.findById(clienteId, (err, cliente) => {
        if (err) return res.status(500).send({message: 'Error en la petición del cliente: ' + err})
        if (!cliente) return res.status(404).send({message: 'El cliente no existe'})

        res.status(200).send({ cliente })
    })
}

function getClientes (req, res) {
    Cliente.find({}, (err, clientes) => {
        if (err) return res.status(500).send({message: 'Error al obtener los clientes: ' + err})
        if (!clientes) return res.status(404).send({message: 'No hay clientes registrados'})

        res.status(200).send({ clientes })
    })
}

function saveCliente (req, res) {
    let cliente = new Cliente({
        Nombre: req.body.Nombre,
        Apellido: req.body.Apellido,
        Telefono: req.body.Telefono,
        Direccion: req.body.Direccion
    })

    cliente.save((err, clienteSaved) => {
        if (err) return res.status(500).send({message: 'Error al almacenar el cliente: ' + err})
        res.status(200).send({ cliente: clienteSaved })
    })
}

function updateCliente (req, res) {
    let clienteId = req.params.clienteId
    let update = req.body

    Cliente.findByIdAndUpdate(clienteId, update,{new: true}, (err, cliente) => {
        if (err) return res.status(500).send({message: 'Error al actualizar al cliente: ' + err})

        res.status(200).send( cliente )
    })
}

function deleteCliente(req, res) {
    let clienteId = req.params.clienteId

    Cliente.findById(clienteId, (err, cliente) => {
        if (err) return res.status(500).send({message: 'Error en la petición del cliente: ' + err})
        if (!cliente) return res.status(404).send({message: 'El cliente no existe'})

        cliente.remove(err => {
            if (err) res.status(500).send({message: 'Error al borrar el cliente:' + err });
            res.status(200).send({message: 'El cliente a sido eliminado'})
        })
    })
}

module.exports = {
    getCliente,
    getClientes,
    saveCliente,
    updateCliente,
    deleteCliente
}