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

        $scope.onKeyUp = function($event){
            console.log($event.keyCode);
            switch($event.keyCode){
                case 37: //left
                case 39: //right
                    $scope.relative.x = 0;
                    socket.emit('move', $scope.relative);
                    console.log("on key up right : relative x : "+$scope.relative.x);
                    break;
                case 38: //up
                case 40: //down
                    $scope.relative.y = 0;
                    socket.emit('move', $scope.relative);
                    console.log("on key up down : relative y : "+$scope.relative.y);
                    break;
            }

        }

        $scope.onKeyDown = function($event){
            console.log($event.keyCode);
            switch($event.keyCode){
                case 37: //left
                    $scope.relative.x = -1;
                    socket.emit('move', $scope.relative);
                    console.log("left : relative x : "+$scope.relative.x);
                    break;
                case 39: //right
                    $scope.relative.x = 1;
                    socket.emit('move', $scope.relative);
                    console.log("right : relative x : "+$scope.relative.x);
                    break;
                case 38: //up
                    $scope.relative.y = 1;
                    socket.emit('move', $scope.relative);
                    break;
                case 40: //down
                    $scope.relative.y = -1;
                    socket.emit('move', $scope.relative);
                    break;
            }
        }

        function onUpdate(){
            socket.on('players', function (data) {
                $scope.players = data;
                console.log("ON UPDATE !!!!")
                console.log(data);
            });
            socket.on('update:player', function (data) {
                var playersTemporal = [];
                for(var id in data){ // data es un único elemento que actualizamos en el json
                    console.log("ON UPDATE PLAYER !!!!")
                    console.log(data[id])
                    playersTemporal.push(data[id]);
                }
                WorldService.players = playersTemporal;
                console.log(data);
                console.log("PLAYERS LUEGO DE REASIGNAR")
                console.log(WorldService.players)
                $scope.players = WorldService.players;

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