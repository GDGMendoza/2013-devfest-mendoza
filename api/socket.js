'use strict';

/**
 * Sockets
 */

module.exports = function (sessionSockets, io) {

    sessionSockets.on('connection', function (err, socket, session) {

        var game = require('./controllers/game')(io);

        // Al conectarse
        game.initInfo(socket);
        console.log(">>> Conexion satisfactoria al socket " + socket.id);

        socket.on('new:player', function(){
            sessionSockets.getSession(socket, function (err, realSession) {
                game.newPlayer(socket.id, realSession.user?realSession.user:undefined);
            });
            console.log(">>> Nuevo player con socket " + socket.id);
        });

        // Al desconectarse
        socket.on('disconnect', function () {
            game.players.remove(socket.id);
            game.scores.remove(socket.id);
            console.log(">>> Desconexion satisfactoria al socket " + socket.id);
        });

        // Al moverse un personaje - Núcleo del jueguito
        socket.on('move', function (relative) {
            game.players.move(socket.id, relative);
            //console.log(">>> Movimiento satisfactorio al socket " + socket.id);
        });

    });
};