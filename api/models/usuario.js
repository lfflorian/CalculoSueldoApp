'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

var usuarioSchema = new Schema({
    Correo:{type: String, required: 'Email Requerido', unique: true},
    Password: {type: String, required: 'Contraseña requerida'},
    FechaRegistro: {type: Date, default: Date.now},
});

usuarioSchema.pre('save', function (next) {
    let usuario = this
    if (!usuario.isModified('Password')) return next()

    bcrypt.hash(usuario.Password, 10, function(err, hash){
        if (err) return next()
        usuario.Password = hash
        next()
    })
})

usuarioSchema.query.byCorreo = function(correo) {
    return this.where({ Correo: correo});
};

module.exports = mongoose.model('Usuario', usuarioSchema);