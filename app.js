"use strict";

/**
 * Dependencias
 */

var http = require('http');
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var app = express();


/**
 * Configuración
 */

//Variables de entorno de session tanto para http como para socket
var cookieParser = express.cookieParser('game of thrones');
var sessionStore = new express.session.MemoryStore({reapInterval: 5 * 60 * 1000});

// Conexion MongoDB
mongoose.connect('mongodb://localhost/devFest', function(err) {
    err ? console.log('ERROR: connecting to Database. ' + err) : console.log('Connected to Database');
});

// configuración global
app.set('port', 3000);
app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser);
app.use(express.session({store: sessionStore}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

// Referencias
var server = http.createServer(app);
var io = require('socket.io').listen(server, { log: false });

var SessionSockets = require('session.socket.io');
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser);


/**
 * Enrutamiento y Sockets
 */

require('./api/api')(app);
require('./api/socket')(sessionSockets, io);


/**
 * Ejecución de servidor
 */

server.listen(app.get('port'), function () {
  console.log('Servidor Express iniciado - puerto ' + app.get('port'));
});
