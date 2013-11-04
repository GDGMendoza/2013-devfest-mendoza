"use strict";

/**
 * Sockets
 */

var io = {},
    game = {

        //Atributos
        timeout: {},
        shutdown: false,
        evil_id: null,
        players: {
            list: {},
            push: function(target_id, player){
                game.players.list[target_id] = player;
                io.sockets.emit('players', game.players.list);
            },
            remove: function(target_id){
                delete game.players.list[target_id];
                if(game.players.isEvilPlayer(target_id)){
                    game.evil_id = null;
                    game.restartRound("AFK");
                }
                io.sockets.emit('players', game.players.list);
            },
            move: function(target_id, relative) {
                function killIntent(id){
                    if(!game.players.isEvilPlayer(id)){ // para que no se intente matar a si mismo :P
                        var player = game.players.list[id];
                        var evilPlayer = game.players.list[game.evil_id];
                        if(player.alive && (evilPlayer.pos.x - player.pos.x > -50) && (evilPlayer.pos.x - player.pos.x < 50)
                            && (evilPlayer.pos.y - player.pos.y > -50) && (evilPlayer.pos.y - player.pos.y < 50)){

                            game.players.list[id].alive = false;
                            game.players.list[id].role = 'green';

                            var wrapper = {};
                            wrapper[id] = game.players.list[id];
                            io.sockets.emit('update:player', wrapper);
                            game.scores.anotherOneBitesTheDust();
                        }
                    }
                }
                function moveIntent(){
                    game.players.list[target_id].pos.x += 5 * (relative.x == 0 ? 0 : (relative.x > 0 ? 1 : -1));
                    game.players.list[target_id].pos.y += 5 * (relative.y == 0 ? 0 : (relative.y > 0 ? -1 : 1));

                    if(game.players.list[target_id].pos.x<0)
                        game.players.list[target_id].pos.x = 0;
                    else if(game.players.list[target_id].pos.x>750)
                        game.players.list[target_id].pos.x = 750;

                    if(game.players.list[target_id].pos.y<0)
                        game.players.list[target_id].pos.y = 0;
                    else if(game.players.list[target_id].pos.y>550)
                        game.players.list[target_id].pos.y = 550;
                }

                if(game.players.isEvilPlayer(target_id)){
                    moveIntent();
                    for(var id in game.players.list){
                        killIntent(id);
                    }
                } else {
                    if(game.players.list[target_id].alive){
                        moveIntent();
                        killIntent(target_id);
                    }
                }

                var wrapper = {};
                wrapper[target_id] = game.players.list[target_id];
                io.sockets.emit('update:player', wrapper);
            },
            isEvilPlayer: function(target_id){
                return game.evil_id == target_id;
            }
        },
        scores:{
            list: {},
            push: function(target_id, score){
                game.scores.list[target_id] = score;
                io.sockets.emit('scores', game.scores.list);
            },
            remove: function(target_id){
                delete game.scores.list[target_id];
                io.sockets.emit('scores', game.scores.list);
            },
            anotherOneBitesTheDust: function(){
                game.scores.list[game.evil_id].kill_score++;

                var wrapper = {};
                wrapper[game.evil_id] = game.scores.list[game.evil_id];
                io.sockets.emit('update:score', wrapper);
            },
            updateSurvivals: function(){
                for(var id in game.players.list){
                    if(!game.players.isEvilPlayer(id) && game.players.list[id].alive){
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
                for(var id in game.players.list){
                    game.players.list[id].alive = true;
                    game.players.list[id].role = 'blue';
                    game.players.list[id].pos.x = 0;
                    game.players.list[id].pos.y = 0;
                }

                //elegimos un nuevo evilPlayer
                for(var id in game.players.list){
                    game.evil_id = id;
                    game.players.list[game.evil_id].role = 'red';
                    game.players.list[game.evil_id].pos.x = 100;
                    game.players.list[game.evil_id].pos.y = 100;
                    break;
                }

                //actualizamos los datos de los players
                io.sockets.emit('players', game.players.list);

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
                    game.evil_id = null;
                    initRound();
                    break;
                case "AFK":
                    console.log("se desconecto el malo");
                    io.sockets.emit('players', game.players.list); //en 3 segundos se reinicia la ronda
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
        init: function(target_id){
            game.players.push(target_id, {
                id: false,
                socket_id: target_id,
                pos: {
                    x: 0,
                    y: 0
                },
                role: 'blue',
                alive: true
            });
            game.scores.push(target_id, {
                nick: "hodor",
                kill_score: 0,
                survival_score: 0
            });
            if(!game.evil_id) //arrancar el juego si todavía no empieza
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
            //console.log(">>> Movimiento satisfactorio al socket " + socket.id);
        });

    });
};