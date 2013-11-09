"use strict";

var user = require('./user');

var io = {},
    game = {

        //Atributos
        timeout: false,
        shutdown: false,
        evil_id: null,
        initInfo: function(socket){
            socket.emit('players', game.players.list);
            socket.emit('scores', game.scores.list);
        },
        players: {
            list: {},
            roles: ["arya", "asha", "brienne", "daenerys", "eddard", "jaime", "jaquen", "joffrey", "jon", "littlefinger", "melisandre", "osha", "robb", "samwell", "sandor", "timett", "tyrion", "tywin", "varys", "ygritte"],
            push: function(target_id, player){
                game.players.list[target_id] = player;
                io.sockets.emit('players', game.players.list);
            },
            remove: function(target_id){
                delete game.players.list[target_id];
                if(game.players.isEvilPlayer(target_id)){
                    game.evil_id = "AFK"; //null
                    game.restartRound("AFK");
                }
                io.sockets.emit('players', game.players.list);
            },
            move: function(target_id, relative) {
                function killIntent(id){
                    if(!game.players.isEvilPlayer(id)){ // para que no se intente matar a si mismo :P
                        var player = game.players.list[id];
                        var evilPlayer = game.players.list[game.evil_id];
                        if(evilPlayer && player.alive && (evilPlayer.pos.x - player.pos.x > -50) && (evilPlayer.pos.x - player.pos.x < 50)
                            && (evilPlayer.pos.y - player.pos.y > -50) && (evilPlayer.pos.y - player.pos.y < 50)){

                            game.players.list[id].alive = false;
                            game.players.list[id].role = 'dead';

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

                if(game.players.list[target_id]){
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
                }
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
                for(var id in game.players.list){
                    var randomAux = Math.floor(Math.random() * game.players.roles.length - 1);

                    console.log("Aux " + randomAux);
                    console.log("Rol " + game.players.roles[randomAux]);
                    game.players.list[id].alive = true;
                    game.players.list[id].role = game.players.roles[randomAux];
                    game.players.list[id].pos.x = Math.floor(Math.random() * 750);
                    game.players.list[id].pos.y = Math.floor(Math.random() * 550);

                    delete game.players.roles[randomAux];
                }

                //elegimos un nuevo evilPlayer
                for(var id in game.players.list){
                    game.evil_id = id;
                    game.players.list[game.evil_id].role = 'george';
                    game.players.list[game.evil_id].pos.x = 400;
                    game.players.list[game.evil_id].pos.y = 300;
                    break;
                }

                //actualizamos los datos de los players
                io.sockets.emit('players', game.players.list);

                //iniciamos secuencia de reinicio de ronda
                if(game.timeout)
                    clearTimeout(game.timeout);
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
                    if(game.timeout)
                        clearTimeout(game.timeout); // corte el timer de la ronda
                    setTimeout(function(){
                            initRound();
                            console.log("3 segundos después");
                        }, 3000
                    );
                    break;
            }
        },
        newplayer: function(target_id, user){
            game.players.push(target_id, {
                id: user ? user._id : false,
                socket_id: target_id,
                nick: user ? user.username : "anon",
                pos: {
                    x: 0,
                    y: 0
                },
                role: game.players.roles[Math.floor(Math.random() * game.players.roles.length - 1)],
                alive: true
            });
            game.scores.push(target_id, {
                nick: user ? user.username : "anon",
                kill_score: user ? (user.kill_score ? user.kill_score : 0) : 0,
                survival_score: user ? (user.survival_score ? user.survival_score : 0) : 0
            });
            if(!game.evil_id) //arrancar el juego si todavía no empieza
                game.restartRound("INIT");
        }
    };

module.exports = function(ref_io){
    io = ref_io;
    return game;
};