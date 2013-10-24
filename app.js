
/**
 * Dependencias
 */

var express = require('express');
var http = require('http');
var path = require('path');
var MemoryStore = express.session.MemoryStore;
//requiere npm install mongoose
//var mongoose = require('mongoose');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);


// Configurando la validacion de la api con oauth2
//var OAuth2Provider = require('oauth2-provider').OAuth2Provider,
//    MemoryStore = express.session.MemoryStore;
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
/*mongoose.connect('mongodb://localhost/devFest',options, function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log('Connected to Database',res);
    }
});*/
/*
    En realidad prefiero mongoskin antes que mongoose 
    ya que no requiere preestablecer esquemas con lo que 
    no se pierde la principal ventaja de mongodb :) 
    pero después lo discutimos entre todos y vemos
*/

// global
app.set('port', process.env.PORT || 3000);
//app.use(express.logger('dev'));
app.use(express.urlencoded()); // bodyParser() va a ser deprecado con la version 3 de connect al salir node 0.12
app.use(express.json()); // bodyParser() va a ser deprecado con la version 3 de connect al salir node 0.12
app.use(express.methodOverride()); // habilita la recepción de métodos PUT y DELETE a través de formularios web
app.use(express.cookieParser());
app.use(express.session({
    store: new MemoryStore({
        reapInterval: 5 * 60 * 1000
    }), 
    secret: 'gameofthrones'
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router); // debe ser la última línea de la configuración global

// solo desarrollo
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// solo producción
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
