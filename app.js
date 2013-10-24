
/**
 * Dependencias
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);


/**
 * Configuración
 */

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

if ('production' === app.get('env')) {
  // TODO
};


/**
 * Enrutamiento
 */

require('./routes/api')(app);
require('./routes/socket')(io);


/**
 * Ejecución de servidor
 */

server.listen(app.get('port'), function () {
  console.log('Servidor Express iniciado - puerto ' + app.get('port'));
});
