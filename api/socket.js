"use strict";

/**
 * Sockets
 */

module.exports = function (sessionSockets, ref_io) {

    var game = require('./controllers/game.js')(ref_io);

    sessionSockets.on('connection', function (err, socket, session) {

        // Al conectarse
        game.init(socket.id);
        console.log(">>> Conexion satisfactoria al socket " + socket.id);

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