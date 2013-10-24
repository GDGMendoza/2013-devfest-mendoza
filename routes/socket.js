/**
 * Sockets
 */

var evilPlayer = {}

var otherPlayers = {
/*	list: {},
	toArray: function(){
		var auxArray = [];
		for()
	}*/
} // mudar lógica a métodos internos

var scores = {

} // mudar lógica a métodos internos

var timeout = "";

function checkCollision(player){
	return player.status.life && ((evilPlayer.pos.x - player.pos.x < 50) || (evilPlayer.pos.y - player.pos.y < 50));
}

function setRandomEvilPlayer(){
	for(id in otherPlayers){
		evilPlayer = otherPlayers[id];
		delete otherPlayers[id];
		break;
	}
}

module.exports = function(io) {
	io.sockets.on('connection', function(socket) {

		// Al conectarse
		console.log(">>> Conexion satisfactoria al socket " + socket.id);
		otherPlayers[socket.id] = {
			id: false,
			socket_id: socket.id,
			pos: {
				x: 0, 
				y: 0
			},
			status: {
				role: 'blue',
				life: true
			}
		}
		scores[socket.id] = {
			nick: "hodor",
			kill_score: 0,
			survival_score: 0
		}
		if(isEmpty(evilPlayer)){
			setRandomEvilPlayer();
		}
		if(socket.id == evilPlayer.socket_id){
			timeout = setTimeout(function(){
				otherPlayers[evilPlayer.socket_id] = evilPlayer;
				setRandomEvilPlayer();
			}, 30000);
		}
		io.sockets.emit('update', {
			evilPlayer: evilPlayer,
			otherPlayers: otherPlayers
		});
		io.sockets.emit('scores', scores);

		// Al desconectarse
		socket.on('disconnect',function(){
			console.log(">>> Desconexion satisfactoria al socket " + socket.id);
			if(timeout != "")
				clearTimeout(timeout);
			if(socket.id == evilPlayer.socket_id){
				setTimeout(function(){
					setRandomEvilPlayer();
				}, 3000);
			} else {
				delete otherPlayers[socket.id];
			}
			delete scores[socket.id];
			io.sockets.emit('update', {
				evilPlayer: evilPlayer,
				otherPlayers: otherPlayers
			});
			io.sockets.emit('scores', scores);
		});

		// Al moverse un personaje - Núcleo del jueguito
		socket.on('move', function(relative){
			console.log(">>> Movimiento satisfactorio al socket " + socket.id);
			if(socket.id == evilPlayer.socket_id){
				evilPlayer.pos.x += relative.x;
				evilPlayer.pos.y += relative.y;
				for(id in otherPlayers){
					if(checkCollision(otherPlayers[id])){
						otherPlayers[id].status.life = false;
						scores[evilPlayer.socket_id].kill_score += 1;
						io.sockets.emit('scores', scores);
					}
				}
			} else {
				otherPlayers[socket.id].pos.x += relative.x;
				otherPlayers[socket.id].pos.y += relative.y;
				if(checkCollision(otherPlayers[socket.id])){
					otherPlayers[socket.id].status.life = false;
					scores[evilPlayer.socket_id].kill_score += 1;
					io.sockets.emit('scores', scores);
				}
			}
			io.sockets.emit('update', {
				evilPlayer: evilPlayer,
				otherPlayers: otherPlayers
			});
		});

	});
}

// Increíble que todavía no este implmentado
function isEmpty(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}