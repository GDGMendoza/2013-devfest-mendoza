'use strict';

/* Controllers */

angular.module('devFest.controllers', [])
    /*    .controller('LoginCtrl', function ($scope, $http) {
     $scope.login = function(){
     //$location.path("/game");
     }
     })*/
    .controller('GameCtrl', function ($scope, socket, WorldService) {

        $scope.players = WorldService.players;

        $scope.relative = { x: 0, y: 0 };

        $scope.menu = {status:{main:'active',login:'',about:'',scores:''}};
        $scope.setMenu = function(menu){
            switch (menu){
                case 'main':
                    if($scope.menu.status.main != 'active'){
                        $scope.menu = {status:{main:'active',login:'',about:'',scores:''}};
                    }else{
                        $scope.menu.status.main = '';
                    }
                    break;
                case 'login':
                    if($scope.menu.status.login != 'active'){
                        $scope.menu = {status:{main:'active',login:'active',about:'',scores:''}};
                    }else{
                        $scope.menu.status.login = '';
                    }
                    break;
                case 'about':
                    if($scope.menu.status.about != 'active'){
                        $scope.menu = {status:{main:'active',login:'',about:'active',scores:''}};
                    }else{
                        $scope.menu.status.about = '';
                    }
                    break;
                case 'scores':
                    if($scope.menu.status.scores != 'active'){
                        $scope.menu = {status:{main:'active',login:'',about:'',scores:'active'}};
                    }else{
                        $scope.menu.status.scores = '';
                    }
                    break;
            }
        };

        $scope.onKeyUp = function($event){
            console.log($event.keyCode);
            switch($event.keyCode){
                case 65: //left
                case 68: //right
                    $scope.relative.x = 0;
                    socket.emit('move', $scope.relative);
                    break;
                case 87: //up
                case 83: //down
                    $scope.relative.y = 0;
                    socket.emit('move', $scope.relative);
                    break;
            }

        }

        $scope.onKeyDown = function($event){
            console.log($event.keyCode);
            switch($event.keyCode){
                case 65: //left
                    $scope.relative.x = -1;
                    socket.emit('move', $scope.relative);
                    break;
                case 68: //right
                    $scope.relative.x = 1;
                    socket.emit('move', $scope.relative);
                    break;
                case 87: //up
                    $scope.relative.y = 1;
                    socket.emit('move', $scope.relative);
                    break;
                case 83: //down
                    $scope.relative.y = -1;
                    socket.emit('move', $scope.relative);
                    break;
            }
        }

        function onUpdate(){
            socket.on('players', function (data) {
                $scope.players = data;
                console.log('players: ' + data);
            });
            socket.on('update:player', function (data) {
                for(var id in data){ // data es un único elemento que actualizamos en el json
                    $scope.players[id] = data[id];
                }
                console.log('update:player ' + data[id]);
            });
        }

        onUpdate();
    });
/*.controller('ScoreCtrl', function($scope, socket){
 socket.on('scores', function (data) {
 $scope.scores = [];
 var id;
 for (id in data){
 $scope.scores.push(data[id]);
 }
 //$scope.scores = data;
 });
 });
 */