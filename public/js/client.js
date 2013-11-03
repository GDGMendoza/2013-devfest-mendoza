/**
 * User: Claudio
 * Date: 25/09/13
 * Time: 19:24
 */
var conn = io.connect('localhost');//http://multiplayer.local:8000
//Clase de operaciones que interpreta
function Operations(){
    var self = this;
    this.playerObjt = '';
    this.playerId = '';
    this.init = '#init';
    this.pixMove = 5;
    this.sceneWith = 500;
    this.secenHeigth = 500;
    this.stats = '#stats ul';
    this.playerRadious = 10;
    //Players in
    var playersList = [];

    /*
        Todas las escuchas de los sockets
     */
    self.heardSockets = function(){

        /*
            Cuando hay un nuevo player lo apendeamos al escenario
         */
        conn.on('newPlayer',function(player){
            self.playerObjt = $('#'+conn.socket.sessionid);
            if(self.playerObjt[0]==undefined){
                $(self.init).append(player);
                $(self.stats).append(self.addUserToStats(conn.socket.sessionid));
                self.playerObjt = $('#'+conn.socket.sessionid);
                self.addUserToArrayPlayers(conn.socket.sessionid,0,0);
                self.playerObjt.css('left','0px');
                self.playerObjt.css('top','0px');
            }
            self.playerId = conn.socket.sessionid;
        });

        /*
            Cuando un player ingresa, nos avisa y lo apendea a todos los players
         */
        conn.on('playerIn',function(playerId, player){
            var playerObjt = $('#'+playerId);
            if(playerObjt[0]==undefined){
                $(self.init).append(player);
                $(self.stats).append(self.addUserToStats(playerId));
                self.addUserToArrayPlayers(playerId,0,0);
                playerObjt.css('left','0px');
                playerObjt.css('top','0px');
            }
        });

        /*
            Cuando entramos, nos da todos los usuarios que ya estaban antes
         */
        conn.on('playersAlreadyIn',function(playerId, player){
            var playerObjt = $('#'+playerId);
            if(playerObjt[0]==undefined){
                $(self.init).append(player);
                $(self.stats).append(self.addUserToStats(playerId));
                self.addUserToArrayPlayers(playerId,0,0);
                playerObjt.css('left','0px');
                playerObjt.css('top','0px');
            }
        });

        /*
            Nos muestra el movimiento de un usuario
         */
        conn.on('moveRemotePlayer',function(y,x,playerId){
            console.log("moveRemotePlayer en client.js")
            console.log("x: "+x+" - y: "+y+" - playerId: "+playerId);
            if(playerId != self.playerId){
                var remotePlayer = $('#'+playerId);
                remotePlayer.css('left',x+'px');
                remotePlayer.css('top',y+'px');
                self.updateUserToStats(playerId);
                self.updateUserToArrayPlayers(playerId,x,y);
            }
        });

        /*
            Cuando un usuario se desconecta lo elimina del escenario
         */
        conn.on('removePlayer',function(playerId){
            var playerObjt = $('#'+playerId);
            $('#stats_'+playerId).remove();
            playerObjt.remove();
            self.removeUserToArrayPlayers(playerId);
        });
    };

    /*
        Acciones de teclas del player
     */
    self.keyboard = function(){

        var up = false;
        var down = false;
        var left = false;
        var right = false;

        /*
            Cuando una tecla es soltada.
         */
        $(document).keyup(function(e){
            if(e.keyCode == '65'){
                left = false;
            }
            if(e.keyCode == '68'){
                right = false;
            }
            if(e.keyCode == '87'){
                up = false;
            }
            if(e.keyCode == '83'){
                down = false;
            }
        });

        /*
            Cuando una tecla es presionada
         */
        $(document).keydown(function(e){

            if(e.keyCode == '65'){
                left = true;
                if(up){
                    self.move('leftTop');
                }else if(down){
                    self.move('leftDown');
                }else{
                    self.move('left');
                }
            }

            if(e.keyCode == '68'){
                right = true;
                if(up){
                    self.move('rightTop');
                }else if(down){
                    self.move('rightDown');
                }else{
                    self.move('right');
                }
            }

            if(e.keyCode == '87'){
                up = true;
                if(left){
                    self.move('leftTop');
                }else if(right){
                    self.move('rightTop');
                }else{
                    self.move('up');
                }
            }

            if(e.keyCode == '83'){
                down = true;
                if(left){
                    self.move('leftDown');
                }else if(right){
                    self.move('rightDown');
                }else{
                    self.move('down');
                }
            }
        });
    };

    /*
        Metodo que ejecuta un movimiento segun el requerimiento.
     */
    self.move = function(dir){

        var x = self.playerObjt.offset().left;
        var y = self.playerObjt.offset().top;

        switch (dir){
            case 'left':
                if((x-self.pixMove)>0){
                    x = x - self.pixMove;
                }
                break;
            case 'right':
                if((x+self.pixMove)<self.sceneWith){
                    x = x + self.pixMove;
                }
                break;
            case 'up':
                if((y-self.pixMove)>0){
                    y = y - self.pixMove;
                }
                break;
            case 'down':
                if((y+self.pixMove)<self.secenHeigth){
                    y = y + self.pixMove;
                }
                break;
            case 'rightTop':
                if((x+self.pixMove)<self.sceneWith){
                    x = x + self.pixMove;
                }
                if((y-self.pixMove)>0){
                    y = y - self.pixMove;
                }
                break;
            case 'rightDown':
                if((x+self.pixMove)<self.sceneWith){
                    x = x + self.pixMove;
                }
                if((y+self.pixMove)<self.secenHeigth){
                    y = y + self.pixMove;
                }
                break;
            case 'leftTop':
                if((x-self.pixMove)>0){
                    x = x - self.pixMove;
                }
                if((y-self.pixMove)>0){
                    y = y - self.pixMove;
                }
                break;
            case 'leftDown':
                if((x-self.pixMove)>0){
                    x = x - self.pixMove;
                }
                if((y+self.pixMove)<self.secenHeigth){
                    y = y + self.pixMove;
                }
                break;
            default:
                break;
        }

        var iCanMove = self.collision(self.playerId,x,y);

        if(iCanMove){
            //Actualizamos el payer
            self.playerObjt.css('left',x+'px');
            self.playerObjt.css('top',y+'px');
            //Le decimos a los usuarios que movimos el player
            conn.emit('movePlayer',y,x,self.playerId);
            self.updateUserToStats(self.playerId);
            self.updateUserToArrayPlayers(self.playerId,x,y);
        }
    };

    self.collision = function(playerId,x,y){
        var move = false;
        for(u in playersList){
            //Chequeando que no soy yo el player
            if(playersList[u].playerId != playerId){
                //No podes ir a la derecha si estas a una determinada posicion de otro usuario
                move = true;
            }//End if equal player:id
        }//End foreach

        return move;
    };

    /*
        Agregamos los usuarios a las estadisticas
     */
    self.addUserToStats = function(playerId){
        var player = $('#'+playerId);
        var x = player.offset().left;
        var y = player.offset().top;
        var stats = playerId+' Left: '+x+' Top: '+y;
        return $('<li id="stats_'+playerId+'">'+stats+'</li>');
    };

    /*
        Actualizamos la posicion de los usuarios
     */
    self.updateUserToStats = function(playerId){
        var player = $('#'+playerId);
        var x = player.offset().left;
        var y = player.offset().top;
        var stats = playerId+' Left: '+x+' Top: '+y;
        $('#stats_'+playerId).text(stats);
    };

    /*
        Agregamos al nuevo player a la lista de usuarios
     */
    self.addUserToArrayPlayers = function(playerId,x,y){

        var playerIn = false;
        for(u in playersList){
            if(playersList[u].playerId == playerId){
                playerIn = true;
            }
        }

        if(!playerIn){
            playersList.push({playerId:playerId,x:x,y:y});
        }
    };

    /*
        Eliminamos un determinado player de la lista
     */
    self.removeUserToArrayPlayers = function(playerId){
        for(u in playersList){
            if(playersList[u].playerId == playerId){
                delete playersList[u];
            }
        }
    };

    /*
        Actualizamos un player de la lista de players
     */
    self.updateUserToArrayPlayers = function(playerId,x,y){

        for(u in playersList){
            if(playersList[u].playerId == playerId){
                playersList[u].x = x;
                playersList[u].x = y;
            }
        }
    };
}
//Cuando se carga emitimos la señal
conn.emit('init');
//Instanciamos las operaciones
var operations = new Operations();
//Escuchamos los sockets
operations.heardSockets();
//Operaciones del teclado
operations.keyboard();