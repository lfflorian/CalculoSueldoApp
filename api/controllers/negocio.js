'use strict'
const Negocio = require('../models/negocio')

function getNegocio (req, res) {
    let negocioId = req.params.negocioId

    Negocio.findById(negocioId).populate('Cliente').exec((err, negocio) => {
        if (err) return res.status(500).send({message: 'Error en la petición del negocio: ' + err})
        if (!negocio) return res.status(404).send({message: 'El negocio no existe'})
        res.status(200).send({ negocio })
    });
}

function getNegocios (req, res) {
    Negocio.find({}).populate('Cliente').exec((err, negocios) => {
        if (err) return res.status(500).send({message: 'Error al obtener los negocios: ' + err})
        if (!negocios) return res.status(404).send({message: 'No hay negocios registrados'})

        res.status(200).send({ negocios })
    })
}

function getNegocioPorCliente(req, res) {
    let clienteId = req.params.clienteId

    Negocio.find().byCliente(clienteId).populate('Cliente').exec((err, negocios) => {
        if (err) return res.status(500).send({message: 'Error al obtener los negocios: ' + err})
        if (!negocios) return res.status(404).send({message: 'No hay negocios registrados'})

        res.status(200).send({ negocios })
    })

}

function saveNegocio (req, res) {
    let negocio = new Negocio();
    negocio.NombreProducto = req.body.NombreProducto
    negocio.Descripcion = req.body.Descripcion
    negocio.PrecioContado = req.body.PrecioContado
    negocio.PorcentajeInteres = req.body.PorcentajeInteres
    negocio.FrecuenciaPago = 12
    negocio.Cliente = req.body.Cliente

    negocio.save((err, negocioSaved) => {
        if (err) return res.status(500).send({message: 'Error al almacenar el negocio: ' + err})
        res.status(200).send({ negocio: negocioSaved })
    })
}

function updateNegocio (req, res) {
    let negocioId = req.params.negocioId
    let update = req.body

    Negocio.findByIdAndUpdate(negocioId, update,{new: true}, (err, negocio) => {
        if (err) return res.status(500).send({message: 'Error al actualizar el negocio: ' + err})

        res.status(200).send( negocio )
    })
}

function deleteNegocio(req, res) {
    let negocioId = req.params.negocioId

    Negocio.findById(negocioId, (err, negocio) => {
        if (err) return res.status(500).send({message: 'Error en la petición del negocio: ' + err})
        if (!negocio) return res.status(404).send({message: 'El negocio no existe'})

        negocio.remove(err => {
            if (err) res.status(500).send({message: 'Error al borrar el negocio:' + err });
            res.status(200).send({message: 'El negocio a sido eliminado'})
        })
    })
}


module.exports = {
    getNegocio,
    getNegocios,
    getNegocioPorCliente,
    saveNegocio,
    updateNegocio,
    deleteNegocio

}