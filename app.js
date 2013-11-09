"use strict";

/**
 * Dependencias
 */

var http = require('http'),
    path = require('path'),
    express = new require('express'),
    mongoose = require('mongoose'),
    SessionSockets = require('session.socket.io'),
    MemoryStore = express.session.MemoryStore,
    app = express();


/**
 * Configuración
 */

// referencias
var server = http.createServer(app);
var io = require('socket.io').listen(server, {log: false});

//Variables de entorno de session tanto para http como para socket
var cookieParser = express.cookieParser('game of thrones');
var sessionStore = new MemoryStore({reapInterval: 5 * 60 * 1000});
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

//LA CONEXION LA MUEVO ACA, POR QUE NECESITO UN LISTADO DE CLIENTES QUE PUEDAN ACCEDER POR TOQUEN
mongoose.connect('mongodb://localhost/devFest', function(err) { // Conexion MongoDB
    err ? console.log('ERROR: connecting to Database. ' + err) : console.log('Connected to Database');
});

// carga del custom oauth provider
var myOAP = require('./custom_oauth');

// configuración global
app.set('port', process.env.PORT || 3000);
//app.use(express.bodyParser());
app.use(express.urlencoded())
app.use(express.json())
app.use(express.methodOverride());
app.use(express.logger());
app.use(express.query());
app.use(cookieParser);
app.use(express.session({store: sessionStore, secret: 'game of thrones'}));
app.use(myOAP.oauth());
app.use(myOAP.login());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


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
