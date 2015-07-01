"use strict";

var _ = require('lodash');

var george = {};
var players = [];
var roles = ["arya", "asha", "brienne", "daenerys", "eddard", "jaime", "jaquen", "joffrey", "jon", "littlefinger", "melisandre", "osha", "robb", "samwell", "sandor", "timett", "tyrion", "tywin", "varys", "ygritte"];
var dirtyChanges = {
    movements: [],
    scores: [],
    arrivals: [],
    departures: []
};

function mainLoop(){
    setInterval(triggerQueue, 1000);

    function triggerQueue(){



        dirtyChanges.length = 0;
    }
}

function playerJoined(playerId, player){
    var anonymous = _.uniqueId("anon");
    var defaultPlayer = {
        id: anonymous,
        nick: anonymous,
        role: _.sample(roles),
        position: {
            x: _.random(750),
            y: _.random(550)
        },
        scores: {
            killScore: 0,
            survivalScore: 0
        },
        alive: true
    };
    var newPlayer = _.defaults(player || {}, defaultPlayer);
    players.push(newPlayer);
    dirtyChanges.arrivals.push(newPlayer);
}

function playerLeft(playerId){
    // _.remove always returns an array even if only one item was deleted
    var playersRemoved = _.remove(players, { id: playerId });
    dirtyChanges.departures.push(playersRemoved[0]);
}

function playerMoved(playerId, relativeMovement){
    var player = _.find(players, { id: playerId });

    player.position.x


    game.players.list[targetId].pos.x += 5 * (relative.x == 0 ? 0 : (relative.x > 0 ? 1 : -1));
    game.players.list[targetId].pos.y += 5 * (relative.y == 0 ? 0 : (relative.y > 0 ? -1 : 1));

    if (game.players.list[targetId].pos.x < 0)
        game.players.list[targetId].pos.x = 0;
    else if (game.players.list[targetId].pos.x > 750)
        game.players.list[targetId].pos.x = 750;

    if (game.players.list[targetId].pos.y < 0)
        game.players.list[targetId].pos.y = 0;
    else if (game.players.list[targetId].pos.y > 550)
        game.players.list[targetId].pos.y = 550;

    dirtyChanges.push(player);
}

function restartRound(){

}




/*
var muerte = {
    id:
    nick,
    role,
    pos: {
        x: 1,
        y: 1
    },
    score: {
        killScore,
        survivalScore
    }
}
*/

var io = {},
    game = {

        //Atributos
        timeout: false,
        shutdown: false,
        evilId: null,
        initInfo: function (socket) {
            socket.emit('players', game.players.list);
            socket.emit('scores', game.scores.list);
        },
        players: {
            list: {},
            roles: ["arya", "asha", "brienne", "daenerys", "eddard", "jaime", "jaquen", "joffrey", "jon", "littlefinger", "melisandre", "osha", "robb", "samwell", "sandor", "timett", "tyrion", "tywin", "varys", "ygritte"],
            push: function (targetId, player) {
                game.players.list[targetId] = player;
                io.sockets.emit('players', game.players.list);
            },
            remove: function (targetId) {
                delete game.players.list[targetId];
                if (game.players.isEvilPlayer(targetId)) {
                    game.evilId = "AFK"; //null
                    game.restartRound("AFK");
                }
                io.sockets.emit('players', game.players.list);
            },
            move: function (targetId, relative) {
                function killIntent(pos) {
                    if (!game.players.isEvilPlayer(pos)) { // para que no se intente matar a si mismo :P
                        var player = game.players.list[pos];
                        var evilPlayer = game.players.list[game.evilId];
                        if (evilPlayer && player.alive && (evilPlayer.pos.x - player.pos.x > -50) && (evilPlayer.pos.x - player.pos.x < 50)
                            && (evilPlayer.pos.y - player.pos.y > -50) && (evilPlayer.pos.y - player.pos.y < 50)) {

                            game.players.list[pos].alive = false;
                            game.players.list[pos].role = 'dead';

                            var wrapper = {};
                            wrapper[pos] = game.players.list[pos];
                            io.sockets.emit('update:player', wrapper);
                            game.scores.anotherOneBitesTheDust();
                        }
                    }
                }

                function moveIntent() {
                    game.players.list[targetId].pos.x += 5 * (relative.x == 0 ? 0 : (relative.x > 0 ? 1 : -1));
                    game.players.list[targetId].pos.y += 5 * (relative.y == 0 ? 0 : (relative.y > 0 ? -1 : 1));

                    if (game.players.list[targetId].pos.x < 0)
                        game.players.list[targetId].pos.x = 0;
                    else if (game.players.list[targetId].pos.x > 750)
                        game.players.list[targetId].pos.x = 750;

                    if (game.players.list[targetId].pos.y < 0)
                        game.players.list[targetId].pos.y = 0;
                    else if (game.players.list[targetId].pos.y > 550)
                        game.players.list[targetId].pos.y = 550;
                }

                if (game.players.list[targetId]) {
                    if (game.players.isEvilPlayer(targetId)) {
                        moveIntent();
                        for (var pos in game.players.list) {
                            killIntent(pos);
                        }
                    } else {
                        if (game.players.list[targetId].alive) {
                            moveIntent();
                            killIntent(targetId);
                        }
                    }

                    var wrapper = {};
                    wrapper[targetId] = game.players.list[targetId];
                    io.sockets.emit('update:player', wrapper);
                }
            },
            isEvilPlayer: function (targetId) {
                return game.evilId == targetId;
            }
        },
        scores: {
            list: {},
            push: function (targetId, score) {
                game.scores.list[targetId] = score;
                io.sockets.emit('scores', game.scores.list);
            },
            remove: function (targetId) {
                delete game.scores.list[targetId];
                io.sockets.emit('scores', game.scores.list);
            },
            anotherOneBitesTheDust: function () {
                game.scores.list[game.evilId].killScore++;
                if (game.players.list[game.evilId].id) {
                    userEntity.updateKillScore({
                        id: game.players.list[game.evilId].id,
                        killScore: game.scores.list[game.evilId].killScore
                    }, function (retorno) {
                    });
                }
                var wrapper = {};
                wrapper[game.evilId] = game.scores.list[game.evilId];
                io.sockets.emit('update:score', wrapper);
            },
            updateSurvivals: function () {
                for (var pos in game.players.list) {
                    if (!game.players.isEvilPlayer(pos) && game.players.list[pos].alive) {
                        game.scores.list[pos].survivalScore++;
                        if (game.players.list[pos].id) {
                            userEntity.updateSurvivalScore({
                                id: game.players.list[pos].id,
                                survivalScore: game.scores.list[pos].survivalScore
                            }, function (retorno) {
                            });
                        }
                    }
                }
                io.sockets.emit('scores', game.scores.list);
            }

        },

        //Métodos
        restartRound: function (mode) {
            function initRound() {
                for (var pos in game.players.list) {
                    var randomAux = Math.floor(Math.random() * game.players.roles.length);

                    game.players.list[pos].alive = true;
                    game.players.list[pos].role = game.players.roles[randomAux];
                    game.players.list[pos].pos.x = Math.floor(Math.random() * 750);
                    game.players.list[pos].pos.y = Math.floor(Math.random() * 550);

                }

                //elegimos un nuevo evilPlayer
                for (var pos in game.players.list) {
                    game.evilId = pos;
                    game.players.list[game.evilId].role = 'george';
                    game.players.list[game.evilId].pos.x = 400;
                    game.players.list[game.evilId].pos.y = 300;
                    break;
                }

                //actualizamos los datos de los players
                io.sockets.emit('players', game.players.list);

                //limpiamos timer en caso de haber y reiniciamos la ronda
                clearTimeout(game.timeout);
                game.timeout = setTimeout(function () {
                    console.log(">>> Reinicio de ronda");
                    if (!game.shutdown)
                        game.restartRound("NORMAL");
                }, 30000);
            }

            switch (mode) {
                case "INIT":
                    initRound();
                    break;
                case "NORMAL":
                    game.scores.updateSurvivals();
                    game.evilId = null;
                    initRound();
                    break;
                case "AFK":
                    console.log(">>> George R. R. Martin se ha desconectado :P");
                    io.sockets.emit('players', game.players.list);
                    game.scores.updateSurvivals();
                    clearTimeout(game.timeout); // corte el timer de la ronda
                    initRound();
                    break;
            }
        },
        newPlayer: function (targetId, user) {
            var randomName = "anon" + new Date();
            game.players.push(targetId, {
                id: user ? user._id : false,
                socketId: targetId,
                nick: user ? user.username : randomName,
                pos: {
                    x: Math.floor(Math.random() * 750),
                    y: Math.floor(Math.random() * 550)
                },
                role: game.players.roles[Math.floor(Math.random() * game.players.roles.length)],
                alive: true
            });
            game.scores.push(targetId, {
                nick: user ? user.username : randomName,
                killScore: user ? (user.killScore ? user.killScore : 0) : 0,
                survivalScore: user ? (user.survivalScore ? user.survivalScore : 0) : 0
            });
            if (!game.evilId) //arrancar el juego si todavía no empieza
                game.restartRound("INIT");
        }
    };

module.exports = function (refIO) {
    io = refIO;
    return game;
};
