'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var negocioSchema = new Schema({
    NombreProducto: String,
    Descripcion: String,
    FechaRegistro: {type: Date, default: Date.now},
    PrecioContado: Number,
    SaldoActual: Number,
    PorcentajeInteres: Number,
    FrecuenciaPago: Number,
    Cliente: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: 'cliente requerido'}]
});

negocioSchema.query.byCliente = function(cliente) {
    return this.where({ Cliente: cliente});
};

module.exports = mongoose.model('Negocio', negocioSchema);