
/**
 * Dependencias
 */

var express = new require('express');
var http = require('http');
var path = require('path');
var MemoryStore = express.session.MemoryStore;
//requiere npm install mongoose
var mongoose = require('mongoose');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);


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

/////////////////////////// AUTH //////////////////////////////////////
// Esta lista podira venir de la base de datos, pero no nos importa ahora
var myClients = {
    '1': '1secret'
};
// temporary grant storage
var myGrants = {};
var myOAP = new OAuth2Provider({crypt_key: 'encryption secret', sign_key: 'signing secret'});
// Antes de mostrar la pagina de autorizacion, tenemos que loguear al usuario
myOAP.on('enforce_login', function(req, res, authorize_url, next) {
    if(req.session.user) {
        next(req.session.user);
    } else {
        //Redireccionamiento
        res.writeHead(303, {Location: '/login?next=' + encodeURIComponent(authorize_url)});
        res.end();
    }
});
// Hay que darle estilo a este html, tambien podemos cargarlo con angular desde el cliente
// La forma seria delvolver un json o algo con esta informacion, asi le quedan las opciones de Denny y de Allow
myOAP.on('authorize_form', function(req, res, client_id, authorize_url) {
    res.end('<html>Necesita aprobar el acceso de esta aplicacion a su cuenta <form method="post" action="' + authorize_url + '"><button name="allow">Permitir</button><button name="deny">Denegar</button></form>');
});
// Esto guarda la opcion que haya elegido el usuario.
myOAP.on('save_grant', function(req, client_id, code, next) {
    if(!(req.session.user in myGrants))
        myGrants[req.session.user] = {};
    myGrants[req.session.user][client_id] = code;
    next();
});
// Cuando ya mande el token, elino el grant.
myOAP.on('remove_grant', function(user_id, client_id, code) {
    if(myGrants[user_id] && myGrants[user_id][client_id])
        delete myGrants[user_id][client_id];
});
// find the user for a particular grant
myOAP.on('lookup_grant', function(client_id, client_secret, code, next) {
    // verify that client id/secret pair are valid
    if(client_id in myClients && myClients[client_id] == client_secret) {
        for(var user in myGrants) {
            var clients = myGrants[user];
            if(clients[client_id] && clients[client_id] == code)
                return next(null, user);
        }
    }
    next(new Error('no such grant found'));
});
// embed an opaque value in the generated access token
myOAP.on('create_access_token', function(user_id, client_id, next) {
    var data = 'blah'; // can be any data type or null
    next(data);
});
// (optional) do something with the generated access token
myOAP.on('save_access_token', function(user_id, client_id, access_token) {
    console.log('saving access token %s for user_id=%s client_id=%s', access_token, user_id, client_id);
});
// an access token was received in a URL query string parameter or HTTP header
myOAP.on('access_token', function(req, token, next) {
    var TOKEN_TTL = 10 * 60 * 1000; // 10 minutes
    if(token.grant_date.getTime() + TOKEN_TTL > Date.now()) {
        req.session.user = token.user_id;
        req.session.data = token.extra_data;
    } else {
        console.warn('access token for user %s has expired', token.user_id);
    }
    next();
});

// (optional) client authentication (xAuth) for trusted clients
myOAP.on('client_auth', function(client_id, client_secret, username, password, next) {
    if(client_id == '1' && username == 'guest') {
        var user_id = '1337';
        return next(null, user_id);
    }
    return next(new Error('client authentication denied'));
});

//////////////////////// END AUTH //////////////////////////////////

// global
app.set('port', process.env.PORT || 3000);
//app.use(express.logger('dev'));
app.use(express.urlencoded()); // bodyParser() va a ser deprecado con la version 3 de connect al salir node 0.12
app.use(express.json()); // bodyParser() va a ser deprecado con la version 3 de connect al salir node 0.12
app.use(express.methodOverride()); // habilita la recepción de métodos PUT y DELETE a través de formularios web
app.use(express.cookieParser());
app.use(myOAP.oauth());
app.use(myOAP.login());
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
}


/**
 * Enrutamiento
 */

require('./api/api')(app);
require('./api/socket')(io);


/**
 * Ejecución de servidor
 */

server.listen(app.get('port'), function () {
  console.log('Servidor Express iniciado - puerto ' + app.get('port'));
});
