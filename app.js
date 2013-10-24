
/**
 * Dependencias
 */

var express = require('express');
var http = require('http');
var path = require('path');
//requiere npm install mongoose
var mongoose = require('mongoose');

var app = module.exports.app = express();
var server = module.exports.server = http.createServer(app); // require('http') ¿porque no se usa la referencia http ya cacheada?
var io = module.exports.io = require('socket.io').listen(server);

//var routes = require('./routes'); // no aplica
var routes_api = require('./routes/api');
var routes_socket = require('./routes/socket')(io);

// Configurando la validacion de la api con oauth2
var OAuth2Provider = require('oauth2-provider').OAuth2Provider,
    MemoryStore = express.session.MemoryStore;
/**
 * Configuración
 */
///// Tener instalado mongodb y hacer npm install mongoose //////////////
var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    user: 'devFest', // user de mongodb
    pass: 'dev2013$' // password de mongodb
}; //esto solo si configuraron los usuarios en mongodb.

//Conexion a la base de datos Mongo Db - NoSQL
mongoose.connect('mongodb://localhost/devFest',options, function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log('Connected to Database',res);
    }
});
// global
app.set('port', process.env.PORT || 3000);
app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.urlencoded()); // bodyParser() va a ser deprecado con la version 3 de connect al salir node 0.12
    app.use(express.json()); // bodyParser() va a ser deprecado con la version 3 de connect al salir node 0.12
    app.use(express.methodOverride()); // habilita la recepción de métodos PUT y DELETE a través de formularios web
    app.use(express.session({store: new MemoryStore({reapInterval: 5 * 60 * 1000}), secret: 'claudioesungenioytodosloaman'}));
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
});
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
////// LO MEJOR EN ESTE CASO, ES CREAR UN MODULO REST EN EL FOLDER node_modules PARA MANEJAR DEPENDENCIAS //////////
// JSON API
app.get('/api/scores', routes_api.scores); //¿La utentificamos con oauth2 ???

// Socket.io Communication
io.sockets.on('connection', routes_socket); // require('./routes/socket') ¿porque no esta cacheado el recurso?

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
