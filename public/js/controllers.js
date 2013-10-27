'use strict';

/* Controllers */

angular.module('devFest.controllers', []).
    controller('LoginCtrl', function ($scope, $http) {
        $scope.login = function(){
            //$location.path("/game");
        }
    }).
    controller('GameCtrl', function ($scope, socket, WorldService) {

        $scope.players = WorldService.players;

        $scope.relative = { x: 0, y: 0 };

        $scope.keyHandler = function($event, press){
            if(press){
                switch($event.keyCode){
                    case '65': //left
                        $scope.relative.x = -1;
                        break;
                    case '68': //right
                        $scope.relative.x = 1;
                        break;
                    case '87': //up
                        $scope.relative.y = 1;
                        break;
                    case '83': //down
                        $scope.relative.y = -1;
                        break;
                }
            } else {
                switch($event.keyCode){
                    case '65': //left
                    case '68': //right
                        $scope.relative.x = 0;
                        break;
                    case '87': //up
                    case '83': //down
                        $scope.relative.y = 0;
                        break;
                }
            }
            socket.emit('move', relative);
        }

        function onPositionChange(){
            socket.on('update', function (data) {

                $scope.players = [];
                var id;
                for (id in data.otherPlayers){
                    $scope.players.push(data.otherPlayers[id])
                }
                $scope.players.push(data.evilPlayer);

                //$scope.players = data;
            });
        }



        onPositionChange();
    })
    .controller('ScoreCtrl', function($scope, socket){
        socket.on('scores', function (data) {
            $scope.scores = [];
            var id;
            for (id in data){
                $scope.scores.push(data[id]);
            }
            //$scope.scores = data;
        });
    });
