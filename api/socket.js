"use strict";

/**
 * Sockets
 */

module.exports = function (sessionSockets, ref_io) {

    sessionSockets.on('connection', function (err, socket, session) {

        console.log("sesionActual " + JSON.stringify(session));
        var game = require('./controllers/game.js')(ref_io, session);

        // Al conectarse
        game.initInfo(socket);
        console.log(">>> Conexion satisfactoria al socket " + socket.id);

        socket.on('newplayer', function(){
            console.log("sesionSocket " + JSON.stringify(session));
            if(session){
                var realSession = JSON.parse(session.req.sessionStore.sessions[session.id]);
            }
            game.newplayer(socket.id, realSession.user);
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