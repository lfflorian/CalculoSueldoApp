'use strict'

const services = require('../services')

function isAuth (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'No tienes autorización '})
    }
    
    const token = req.headers.authorization.split(' ')[1]
    if (token == undefined) return res.status(403).send({ message: 'No tienes autorización.'})
    
    services.decodeToken(token).then((response)=> {
        req.user = response
        next()
    }, (response) => {
        return res.status(response.status).send({ message : response.message })
    })
}

module.exports = isAuth