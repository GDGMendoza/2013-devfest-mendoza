"use strict";

/**
 * Dependencias
 */

var http = require('http'),
    path = require('path'),
    express = new require('express'),
    mongoose = require('mongoose'),
    SessionSockets = require('session.socket.io'),
    app = express();


/**
 * Configuración
 */

// referencias
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var cookieParser = express.cookieParser('game of thrones');
var sessionStore = new express.session.MemoryStore({reapInterval: 5 * 60 * 1000});
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
var mongoDBoptions = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    user: 'devFest', // user de mongodb
    pass: 'devFest2013$' // password de mongodb
}; //esto solo si configuraron los usuarios en mongodb.

// configuración global
app.set('port', process.env.PORT || 3000);
app.use(express.logger());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride()); //delete y put
app.use(cookieParser);
app.use(express.session({ store: sessionStore }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
mongoose.connect('mongodb://localhost/devFest', mongoDBoptions, function(err, res) { // Conexion MongoDB
    err ? console.log('ERROR: connecting to Database. ' + err) : console.log('Connected to Database', res);
});

// configuración solo desarrollo
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// configuración solo producción
if ('production' === app.get('env')) {
  // TODO
}


/**
 * Enrutamiento
 */

require('./api/api')(app);
require('./api/socket')(sessionSockets, io);


/**
 * Ejecución de servidor
 */

server.listen(app.get('port'), function () {
  console.log('Servidor Express iniciado - puerto ' + app.get('port'));
});
