/*
 * Serve content over a socket
 */

/*
module.exports = function (socket) {
  socket.emit('send:name', {
    name: 'Bob'
  });

  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);
};
*/

var players = [];

function Player(){
    var self = this;

    /*
        Objeto del player
     */
    this.objPlayer = function(socket){
        return '<div class="player" id="'+socket.id+'"></div>';
    }
}

module.exports = function(io){
	return function(socket) {
		var player = new Player();

	    /*
	        Cuando un usuario ingresa, se ejecuta una sola vez
	     */
	    socket.on('init',function(x,y){
	        players.push({client:socket});
	        for(p in players){
	            if(players[p].client.id != socket.id){
	                socket.emit('playersAlreadyIn',players[p].client.id,player.objPlayer(players[p].client));
	            }
	        }
	        socket.emit('newPlayer',player.objPlayer(socket));
	        io.sockets.emit('playerIn',socket.id,player.objPlayer(socket));
	    });

	    /*
	        Cada vez que un player se muevo, lo enviamos a todos los players
	     */
	    socket.on('movePlayer',function(y,x,playerId){
	        io.sockets.emit('moveRemotePlayer',y,x,playerId);
	    });

	    /*
	        Cuando un usuario se desconecta, le avisa a todos los players para removerlo
	     */
	    socket.on('disconnect',function(){
	        io.sockets.emit('removePlayer',socket.id);
	        for(p in players){
	            if(players[p].client.id == socket.id){
	                delete players[p];
	            }
	        }
	    });
	}
}