
/**
 * Dependencias
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = module.exports.app = express();
var server = module.exports.server = http.createServer(app); // require('http') ¿porque no se usa la referencia http ya cacheada?
var io = module.exports.io = require('socket.io').listen(server);

//var routes = require('./routes'); // no aplica
var routes_api = require('./routes/api');
var routes_socket = require('./routes/socket')(io);

/**
 * Configuración
 */

// global
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.urlencoded()); // bodyParser() va a ser deprecado con la version 3 de connect al salir node 0.12
app.use(express.json()); // bodyParser() va a ser deprecado con la version 3 de connect al salir node 0.12
app.use(express.methodOverride()); // habilita la recepción de métodos PUT y DELETE a través de formularios web
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// desarrollo
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// producción
if ('production' === app.get('env')) {
  // TODO
};


/**
 * Enrutamiento
 */

// JSON API
app.get('/api/scores', routes_api.scores);

// Socket.io Communication
io.sockets.on('connection', routes_socket); // require('./routes/socket') ¿porque no esta cacheado el recurso?

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
