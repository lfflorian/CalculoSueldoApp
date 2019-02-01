'use strict'
const Pago = require('../models/pago')
const Negocio = require('../models/negocio')

function getPago(req, res) {
    let pagoId = req.params.pagoId

    Pago.findById(pagoId).populate('Negocio').exec((err, pago) => {
        if (err) return res.status(500).send({message: 'Error en la petición del pago: ' + err})
        if (!pago) return res.status(404).send({message: 'El pago no existe'})
        res.status(200).send({ pago })
    });
}

function getPagos(req, res) {
    Pago.find({}).sort('FechaPago').populate('Negocio').exec((err, pagos) => {
        if (err) return res.status(500).send({message: 'Error al obtener los pagos: ' + err})
        if (!pagos) return res.status(404).send({message: 'No hay pagos registrados'})

        res.status(200).send({ pagos })
    })
}

function getPagoPorNegocio(req, res) {
    let negocioId = req.params.negocioId

    Pago.find().byNegocio(negocioId).sort('FechaPago').populate('Negocio').exec((err, pagos) => {
        if (err) return res.status(500).send({message: 'Error al obtener los pagos: ' + err})
        if (!pagos) return res.status(404).send({message: 'No hay pagos registrados'})

        res.status(200).send({ pagos })
    })
}

function savePago(req, res) {
    let pago = new Pago() 
    pago.FechaPago = req.body.FechaPago
    pago.Pago = req.body.Pago
    pago.Negocio = req.body.Negocio
    
    if (req.body.Enganche == 'true')
    {
        pago.Saldo = pago.Pago

        Negocio.findById(pago.Negocio).exec((err,negocio) => {
            pago.Saldo = negocio.PrecioContado - pago.Pago;
            pago.save((err, pagoSaved) => {
                if (err) return res.status(500).send({message: 'Error al almacenar el pago: ' + err})
                res.status(200).send({ pago: pagoSaved })
            })
        });
    } else 
    {
        CicloDePagos(pago, res)
    }
    
}

function CicloDePagos(pago, res) {
    var resultado = Pago.find({}).byNegocio(pago.Negocio)
    .sort('FechaPago')
    .where('FechaPago').lte(pago.FechaPago)
    .populate('Negocio').exec((err, pagos) => {
        if (err) return res.status(500).send({message: 'Error al obtener los pagos: ' + err})
        if (!pagos) return res.status(404).send({message: 'No hay pagos registrados'})

        let pagoAnterior = pagos[pagos.length - 1];
        let negocio = pagoAnterior.Negocio[0];
        pago = CalculoDelPago(pagoAnterior, pago, negocio);

        let pagoActual = pago;
        /* codigo repetido */
        Pago.find({}).byNegocio(pago.Negocio)
        .sort('FechaPago')
        .where('FechaPago').gte(pago.FechaPago)
        .exec((err, pagos) => {
            pagos.forEach(element => {
                CalculoDelPago(pagoActual, element, negocio);
                pagoActual = element;
            });
        })

        pago.save((err, pagoSaved) => {
            if (err) return res.status(500).send({message: 'Error al almacenar el pago: ' + err})
            res.status(200).send({ pago: pagoSaved })
        })
    })
}


function CalculoDelPago(pagoAnterior, pago, negocio) {
    pago.Dias = (pago.FechaPago - pagoAnterior.FechaPago) / 86400000
    var tasaInteres = (negocio.PorcentajeInteres * negocio.FrecuenciaPago);
    tasaInteres = tasaInteres / 100;
    tasaInteres = tasaInteres / 365;
    pago.Interes = (pagoAnterior.Saldo * tasaInteres * pago.Dias).toFixed(4);
    pago.Amortizacion = (pago.Pago - pago.Interes).toFixed(4);
    pago.Saldo = (pagoAnterior.Saldo - pago.Amortizacion).toFixed(4);

    Pago.findByIdAndUpdate(pago._id, pago).exec();

    return pago;
}



function updatePago(req, res) {
    let pagoId = req.params.pagoId
    let update = req.body 

    Pago.findById(pagoId, (err, pago) => {
        if (err) return res.status(500).send({message: 'Error al actualizar el pago: ' + err})

        Pago.find({}).byNegocio(pago.Negocio)
        .sort('FechaPago')
        .where('FechaPago').lt(pago.FechaPago)
        .populate('Negocio').exec((err, pagos) => {
            if (err) return res.status(500).send({message: 'Error al obtener los pagos: ' + err})
            if (!pagos) return res.status(404).send({message: 'No hay pagos registrados'})

            let pagoAnterior = pagos[pagos.length - 1];
            let negocio = pagoAnterior.Negocio[0];

            if (update.Pago != undefined) pago.Pago = update.Pago;
            if (update.FechaPago != undefined) pago.Pago = update.FechaPago;

            pago = CalculoDelPago(pagoAnterior, pago, negocio);

            let pagoActual = pago;
            /* codigo repetido */
            Pago.find({}).byNegocio(pago.Negocio)
            .sort('FechaPago')
            .where('FechaPago').gte(pago.FechaPago)
            .exec((err, pagos) => {
                pagos.forEach(element => {
                    CalculoDelPago(pagoActual, element, negocio);
                    pagoActual = element;
                });
            })

            res.status(200).send( pago );
        })
    })
}

function deletePago(req, res) {
    let pagoId = req.params.pagoId

    Pago.findById(pagoId, (err, pago) => {
        if (err) return res.status(500).send({message: 'Error en la petición del pago: ' + err})
        if (!pago) return res.status(404).send({message: 'El pago no existe'})
        /* codigo repetido */
        Pago.find({}).byNegocio(pago.Negocio)
        .sort('FechaPago')
        .where('FechaPago').lt(pago.FechaPago)
        .populate('Negocio').exec((err, pagos) => {
            if (err) return res.status(500).send({message: 'Error al obtener los pagos: ' + err})
            if (!pagos) return res.status(404).send({message: 'No hay pagos registrados'})

            let pagoAnterior = pagos[pagos.length - 1];
            let negocio;
            try {
                negocio = pagoAnterior.Negocio[0];
            } catch (error) {
                /* codigo repetido */
                pago.remove(err => {
                    if (err) res.status(500).send({message: 'Error al borrar el pago:' + err });
                    res.status(200).send({message: 'El pago a sido eliminado'})
                })
            }

            let pagoActual = pagoAnterior;
            Pago.find({}).byNegocio(pago.Negocio)
            .sort('FechaPago')
            .where('FechaPago').gte(pago.FechaPago)
            .exec((err, pagos) => {
                pagos.forEach(element => {
                    CalculoDelPago(pagoActual, element, negocio);
                    pagoActual = element;
                });
            })
        })

        pago.remove(err => {
            if (err) res.status(500).send({message: 'Error al borrar el pago:' + err });
            res.status(200).send({message: 'El pago a sido eliminado'})
        })
    })
}

module.exports = {
    getPago,
    getPagos,
    getPagoPorNegocio,
    savePago,
    updatePago,
    deletePago
}