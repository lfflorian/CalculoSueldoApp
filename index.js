'use strict'


const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')

mongoose.connect(config.db, (err, res) => {
    if (err) {
        console.log('Error en la conexión hacia la base de datos: ' + err)
    }
    console.log('Conexión a la base d datos establecida')
})

app.listen(config.port, () => {
    console.log('Inicio de api rest Calculo Sueldos');
})