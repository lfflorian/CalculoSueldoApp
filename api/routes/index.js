'use strict'

const express = require('express')
const clienteCtrl = require('../controllers/cliente')
const negocioCtrl = require('../controllers/negocio')
const pagoCtrl = require('../controllers/pago')
const usuarioCtrl = require('../controllers/ususario')
const auth = require('../middlewares/auth')
const api = express.Router()

api.get('/cliente', clienteCtrl.getClientes)
api.get('/cliente/:clienteId', clienteCtrl.getCliente)
api.post('/cliente',clienteCtrl.saveCliente)
api.put('/cliente/:clienteId', clienteCtrl.updateCliente)
api.delete('/cliente/:clienteId',clienteCtrl.deleteCliente)

api.post('/signin', usuarioCtrl.singIn)
api.post('/usuario', auth, usuarioCtrl.saveUsuario) 

api.get('/negocio/:negocioId',negocioCtrl.getNegocio)
api.get('/negocio',negocioCtrl.getNegocios)
api.get('/negocio/porcliente/:clienteId', negocioCtrl.getNegocioPorCliente)
api.post('/negocio',negocioCtrl.saveNegocio)
api.put('/negocio/:negocioId',negocioCtrl.updateNegocio)
api.delete('/negocio/:negocioId',negocioCtrl.deleteNegocio)

api.get('/pago/:pagoId',pagoCtrl.getPago)
api.get('/pago',pagoCtrl.getPagos)
api.get('/pago/pornegocio/:negocioId', pagoCtrl.getPagoPorNegocio)
api.post('/pago',pagoCtrl.savePago)
api.put('/pago/:pagoId',pagoCtrl.updatePago)
api.delete('/pago/:pagoId',pagoCtrl.deletePago)

module.exports = api 