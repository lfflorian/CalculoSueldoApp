'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../../config')

function createToken(usuario) {
    const payload = {
        sub: usuario._id,
        iat: moment().unix(),
        exp: moment().add(38, 'days').unix()
    }
    return jwt.encode(payload, config.SECRET_TOKEN)
}

function decodeToken (token) {
    const decoded = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.SECRET_TOKEN)
            if (payload.exp <= moment().unix()) {
                reject({ status: 401, message: 'El token a expirado'})
            }

            resolve(payload.sub)
        } catch (err) {
            reject({ status: 500, message: 'Token Invalido'})
        }
    })
    return decoded
}

module.exports = {
    createToken,
    decodeToken
}