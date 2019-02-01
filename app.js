'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('./api/routes')
var path = require('path');

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', api)

//app.use('/views', express.static(path.join(__dirname, 'dist', 'views')))

app.use(express.static('dist'));
app.use('/views',express.static('dist/views'));



/*app.use(express.static('js'))
app.use(express.static('css'))

app.use('index.js', express.static(path.join(__dirname,'dist', 'index.js')))
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/pages', express.static(path.join(__dirname, 'pages')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'))
})

console.log(path.join(__dirname,'dist', 'index.js'));*/

module.exports = app;