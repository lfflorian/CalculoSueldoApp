'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pagoSchema = new Schema({
    FechaPago: Date,
    FechaRegistro: {type: Date, default: Date.now},
    Pago: Number,
    Dias: Number,
    Interes: Number,
    Amortizacion: Number,
    Saldo: Number,
    Negocio: [{type: mongoose.Schema.Types.ObjectId, ref: 'Negocio', required: 'Negocio requerido'}]
});

pagoSchema.query.byNegocio = function(negocio) {
    return this.where({ Negocio: negocio});
};

/*pagoSchema.pre('save', function (next) {
    let pago = this
    pagoSchema
    /* Listado de Pagos por negocio por ordenados por fecha 
    pago.Dias = (Date.now - pago.FechaPago)
    var tasaInteres = (3 * 12);
    tasaInteres = tasaInteres / 100;
    tasaInteres = tasaInteres / 365;
    pago.Interes = 0;
})*/

module.exports = mongoose.model('Pago', pagoSchema);