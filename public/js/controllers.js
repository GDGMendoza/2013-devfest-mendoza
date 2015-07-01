'use strict';

/* Controllers */

angular.module('devFest.controllers', [])
    .controller('GameCtrl', ['$scope', '$http', 'socket', 'canvasService', function ($scope, $http, socket, canvasService) {

        socket.forward(["players", "update:player", "scores", "update:score"], $scope);
        $scope.$on('socket:players', function(ev, data) {
            canvasService.init();
            $scope.players = data;
        });
        $scope.$on('socket:update:player', function(ev, data) {
            for(var id in data){ // data es un único elemento que actualizamos en el json
                $scope.players[id] = data[id];
            }
        });
        $scope.$on('socket:scores', function(ev, data) {
            $scope.scores = data;
        });
        $scope.$on('socket:update:score', function(ev, data) {
            for(var id in data){ // data es un único elemento que actualizamos en el json
                $scope.scores[id] = data[id];
            }
        });

        $scope.menu = {status:{main:'active',login:'',about:'',scores:''}};
        $scope.setMenu = function(menu){
            switch (menu){
                case 'main':
                    if($scope.menu.status.main != 'active'){
                        $scope.menu = {status:{main:'active',login:'',about:'',scores:''}};
                    }else{
                        $scope.menu.status = {main:'',login:'',about:'',scores:''};
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

        $scope.loginData = { username: "", password: "" };
        $scope.login = function(){
            if($scope.loginData.username != "" && $scope.loginData.password != ""){
                $http.post("/login", $scope.loginData).success(function(data){
                    if(data.response){
                        $scope.play();
                    } else {
                        console.log("Error al logear");
                    }
                });
            }

        };

        $scope.registerData = { username: "", email: "", password: "" };
        $scope.registerAndLogin = function(){
            if($scope.registerData.username != ""
                && $scope.registerData.email != ""
                && $scope.registerData.password != ""){

                $http.post("/register", $scope.registerData).success(function(data){
                    if(data.response){
                        $scope.play();
                    } else {
                        console.log("Error al registrarse");
                    }
                });
            }
        };

        $scope.relative = { x: 0, y: 0 };
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

        };
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
        };

        $scope.play = function(){
            $scope.setMenu("main");
            socket.emit('new:player', {});
        };

    }]);
