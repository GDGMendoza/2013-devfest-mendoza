"use strict";

/**
 * Sockets
 */

var io = {},
    game = {

        //Atributos
        timeout: {},
        shutdown: false,
        players: {
            list: {},
            evil_id: null,
            evilPlayer: {socket_id: null},
            otherPlayers:{},
            push: function(socket_id, player){
                game.players.otherPlayers[socket_id] = player;
                io.sockets.emit('players', game.players.toArray());
            },
            remove: function(socket_id){
                if(game.players.isEvilPlayer(socket_id)){
                    game.players.evilPlayer = {socket_id: null};
                    game.restartRound("AFK");
                } else {
                    delete game.players.otherPlayers[socket_id];
                }
                io.sockets.emit('players', game.players.toArray());
            },
            move: function(socket_id, relative) {
                function collided(player){
                    if (game.players.evilPlayer.pos != undefined){
                        return player.alive && (game.players.evilPlayer.pos.x - player.pos.x < 50) && (game.players.evilPlayer.pos.y - player.pos.y < 50);
                    }
                    return false;
                }
                if(game.players.isEvilPlayer(socket_id)){
                    //chequear limites de canvas
                    game.players.evilPlayer.pos.x += 5 * relative.x; //es cheateable
                    game.players.evilPlayer.pos.y += 5 * relative.y;
                    for(var id in game.players.otherPlayers){
                        if(collided(game.players.otherPlayers[id])){
                            game.players.otherPlayers[id].alive = false;
                            game.players.otherPlayers[id].role = 'green';
                            //lista única y en vez de tener un evilPlayer, reemplazar con evilPlayerId
                            game.scores.anotherOneBitesTheDust();
                        }
                    }
                } else {
                    if(game.players.otherPlayers[socket_id].alive){
                        //chequear limites de canvas
                        game.players.otherPlayers[socket_id].pos.x += 5 * relative.x;
                        game.players.otherPlayers[socket_id].pos.y += 5 * relative.y;
                        if(collided(game.players.otherPlayers[socket_id])){
                            game.players.otherPlayers[socket_id].alive = false;
                            game.players.otherPlayers[socket_id].role = 'green';
                            game.scores.anotherOneBitesTheDust();
                        }
                    }
                }
                //game.players.executeCollisions(socket_id);

                var retorno = {};
                retorno[socket_id] = game.players.toArray()[socket_id];
                io.sockets.emit('update:player', retorno);
            },
            toArray: function(){
                var list = game.players.otherPlayers;
                if(game.players.evilPlayer.socket_id) //&& (game.players.evilPlayer.socket_id != 'AFK') si tiene socket_id que lo agregue
                    list[game.players.evilPlayer.socket_id] = game.players.evilPlayer;
                return list;
            },
            isEvilPlayer: function(socket_id){
                return socket_id == game.players.evilPlayer.socket_id;
            }
        },
        scores:{
            list: {},
            push: function(socket_id, score){
                game.scores.list[socket_id] = score;
                io.sockets.emit('scores', game.scores.list);

            },
            remove: function(socket_id){
                delete game.scores.list[socket_id];
                io.sockets.emit('scores', game.scores.list);
            },
            anotherOneBitesTheDust: function(){
                var evil_id = game.players.evilPlayer.socket_id;
                game.scores.list[evil_id].kill_score++;

                var retorno = {};
                retorno[evil_id] = game.scores.list[evil_id];
                io.sockets.emit('update:score', retorno);
            },
            updateSurvivals: function(){
                for(var id in game.otherPlayers){
                    if(game.otherPlayers[id].alive){
                        game.scores.list[id].survival_score++;
                    }
                }
                io.sockets.emit('scores', game.scores.list);
            }

        },

        //Métodos
        restartRound: function(mode){
            function initRound(){
                //reiniciamos a los jugadores
                for(var id in game.players.otherPlayers){
                    game.players.otherPlayers[id].alive = true;
                    game.players.otherPlayers[id].role = 'blue';
                    game.players.otherPlayers[id].pos.x = 0;
                    game.players.otherPlayers[id].pos.y = 0;
                }

                //elegimos un nuevo evilPlayer
                for(var id in game.players.otherPlayers){
                    game.players.evilPlayer = game.players.otherPlayers[id];
                    game.players.evilPlayer.role = 'red';
                    game.players.evilPlayer.pos.x = 100;
                    game.players.evilPlayer.pos.y = 100;
                    delete game.players.otherPlayers[id];
                    break;
                }

                //actualizamos los datos de los players
                io.sockets.emit('players', game.players.toArray());

                //iniciamos secuencia de reinicio de ronda
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
                    game.players.evilPlayer = {socket_id: null};
                    initRound();
                    break;
                case "AFK":
                    console.log("se desconecto el malo");
                    io.sockets.emit('players', game.players.toArray()); //en 3 segundos se reinicia la ronda
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

module.exports = function (sessionSockets, ref_io) {

    io = ref_io;

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
            console.log(">>> Movimiento satisfactorio al socket " + socket.id);
        });

    });
};