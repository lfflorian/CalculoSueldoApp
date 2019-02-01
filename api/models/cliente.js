'use strict';
var mongoose = require('mongoose');
var Negocio = require('./negocio');
var Schema = mongoose.Schema;

var clienteSchema = new Schema({
    Nombre: String,
    Apellido: String,
    Telefono: [{type: String}],
    Direccion: String,
    FechaRegistro: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Cliente', clienteSchema);