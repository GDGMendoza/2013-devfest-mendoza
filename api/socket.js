"use strict";

/**
 * Sockets
 */

var game = {

    //Atributos
    io: {},
    timeout: {},
    shutdown: false,
    players: {
        evilPlayer: {socket_id: null},
        otherPlayers:{},
        push: function(socket_id, player){
            game.players.otherPlayers[socket_id] = player;
            game.io.sockets.emit('players', game.players.toArray());
        },
        remove: function(socket_id){
            if(game.players.isEvilPlayer(socket_id)){
                game.restartRound("AFK");
                game.players.evilPlayer = {socket_id: 'AFK'};
            } else {
                delete game.players.otherPlayers[socket_id];
            }
            game.io.sockets.emit('players', game.players.toArray());
        },
        move: function(socket_id, relative) {
            if(game.players.isEvilPlayer(socket_id)){
                game.players.evilPlayer.pos.x += 5 * relative.x;
                game.players.evilPlayer.pos.y += 5 * relative.y;
                //checkear limites
            } else {
                game.players.otherPlayers[socket_id].pos.x += 5 * relative.x;
                game.players.otherPlayers[socket_id].pos.y += 5 * relative.y;
                //checkear limites
            }
            game.players.executeCollisions(socket_id);
            game.io.sockets.emit('update:player', {}[socket_id] = game.players.toArray()[socket_id]);
        },
        toArray: function(){
            var list = game.players.otherPlayers;
            if(game.players.evilPlayer.socket_id && (game.players.evilPlayer.socket_id != 'AFK')) //si tiene socket_id que lo agregue
                list[game.players.evilPlayer.socket_id] = game.players.evilPlayer;
            return list;
        },
        isEvilPlayer: function(socket_id){
            return socket_id == game.players.evilPlayer.socket_id;
        },
        executeCollisions: function(socket_id){
            function collided(player){
                return player.status.alive && (game.players.evilPlayer.pos.x - player.pos.x < 50) && (game.players.evilPlayer.pos.y - player.pos.y < 50);
            }
            if(game.players.isEvilPlayer(socket_id)){
                for(var id in game.players.otherPlayers){
                    if(collided(game.players.otherPlayers[id])){
                        game.players.otherPlayers[id].status.alive = false;
                        game.scores.anotherOneBitesTheDust();
                    }
                }
            } else {
                if(collided(game.players.otherPlayers[socket_id])){
                    game.players.otherPlayers[socket_id].status.alive = false;
                    game.scores.anotherOneBitesTheDust();
                }
            }
        }
    },
    scores:{
        list: {},
        push: function(socket_id, score){
            game.scores.list[socket_id] = score;
            game.io.sockets.emit('scores', game.scores.list);

        },
        remove: function(socket_id){
            delete game.scores.list[socket_id];
            game.io.sockets.emit('scores', game.scores.list);
        },
        anotherOneBitesTheDust: function(){
            var evil_id = game.players.evilPlayer.socket_id;
            game.scores.list[evil_id].kill_score++;
            game.io.sockets.emit('update:score', {}[evil_id] = game.scores.list[evil_id]);
        },
        updateSurvivals: function(){
            for(var id in game.otherPlayers){
                if(game.otherPlayers[id].alive){
                    game.scores.list[id].survival_score++;
                }
            }
        }

    },

    //Métodos
    restartRound: function(mode){
        function initRound(){
            for(var id in game.players.otherPlayers){
                if(id!=undefined){
                    game.players.otherPlayers[id].alive = true;
                    game.players.otherPlayers[id].role = 'blue';
                    game.players.otherPlayers[id].pos.x = 0;
                    game.players.otherPlayers[id].pos.y = 0;
                }
            }
            //elegimos un nuevo evilPlayer
            for(var id in game.players.otherPlayers){
                game.players.evilPlayer = game.players.otherPlayers[id];
                game.players.evilPlayer.role = 'red';
                game.players.evilPlayer.pos.x = 500;
                game.players.evilPlayer.pos.y = 500;
                delete game.players.otherPlayers[id];
                break;
            }
            //iniciamos secuencia de ronda
            game.timeout = setTimeout(function(){
                console.log("pasaron 30 segundos");
                if(!game.shutdown)
                    game.restartRound("NORMAL");
            }, 30000);
        }

        switch(mode){
            case "INIT":
                initRound();
                break;
            case "NORMAL":
                game.scores.updateSurvivals();
                game.players.otherPlayers[game.players.evilPlayer.socket_id] = game.players.evilPlayer;
                initRound();
                break;
            case "AFK":
                //posible emit para que sepan que en 3 segundos se reinicia la ronda
                console.log("se desconecto el malo");
                game.scores.updateSurvivals();
                clearTimeout(game.timeout); // corte el timer de la ronda
                setTimeout(function(){
                    initRound();
                    console.log("3 segundos después");
                }, 3000
                );
                break;
        }
    },
    init: function(socket_id){
        game.players.push(socket_id, {
            id: false,
            socket_id: socket_id,
            pos: {
                x: 0,
                y: 0
            },
            role: 'blue',
            alive: true
        });
        game.scores.push(socket_id, {
            nick: "hodor",
            kill_score: 0,
            survival_score: 0
        });
        if(!game.players.evilPlayer.socket_id) //arrancar el juego si todavía no empieza
            game.restartRound("INIT");
    }
};

module.exports = function (sessionSockets, io) {

    game.io = io;

    sessionSockets.on('connection', function (err, socket, session) {

        // Al conectarse
        console.log(">>> Conexion satisfactoria al socket " + socket.id);
        game.init(socket.id);

        // Al desconectarse
        socket.on('disconnect', function () {
            console.log(">>> Desconexion satisfactoria al socket " + socket.id);
            game.players.remove(socket.id);
            game.scores.remove(socket.id);
        });

        // Al moverse un personaje - Núcleo del jueguito
        socket.on('move', function (relative) {
            console.log(">>> Movimiento satisfactorio al socket " + socket.id);
            game.players.move(socket.id, relative);
        });

    });
};