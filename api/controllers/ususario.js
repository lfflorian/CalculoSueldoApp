'user strict'

const Usuario = require('../models/usuario')
const service = require('../services')
const bcrypt = require('bcryptjs')

function singIn (req, res) {
    let parametros = req.body
    if (parametros.Correo == undefined) return res.status(404).send({ message: 'No hay usuario ingresado'})

    Usuario.findOne().byCorreo(parametros.Correo).exec(function(err, usuario){
        if (err) return res.status(500).send({message: 'Error en la petición del usuario: ' + err})
        if (!usuario) return res.status(404).send({message: 'El usuario no existe'})
        
        bcrypt.compare(parametros.Password, usuario.Password, (err, result)=> {
            if (err) return res.status(401).json({ error : 'Acceso no autorizado' })
            if (result) {
                req.usuario = usuario
                return res.status(200).send({
                    message: 'Te has logeado correctamente',
                    token: service.createToken(usuario)
                })
            } 
            return res.status(401).json({ error : 'El usuario o contraseña es incorrecta' })
        })
    });
}

function saveUsuario (req, res) {
    let usuario = new Usuario({
        Correo: req.body.Correo,
        Password: req.body.Password
    })

    usuario.save((err, usuarioSaved) => {
        if (err) res.status(500).send({ message: 'Error al crear el usuario: ' + err })
        return res.status(200).send({ usuario: {  'Correo': usuarioSaved.Correo } })
    })
}

module.exports = {
    singIn,
    saveUsuario
}