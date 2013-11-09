'use strict';

/* Controllers */

angular.module('devFest.controllers', [])
    .controller('GameCtrl', function ($scope, $http, socket, WorldService) {

        //$scope.players = WorldService.players;

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

        $scope.play = function(){
            $scope.setMenu("main");
            socket.emit('newplayer', {});
        }

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

        }

        $scope.registerData = { username: "", email: "", password: "" };

        $scope.registerAndLogin = function(){
            if($scope.registerData.username != ""
                && $scope.registerData.email != ""
                && $scope.registerData.password != ""){

                $http.post("/api/user", $scope.registerData).success(function(data){
                    if(data.response){
                        $scope.play();
                    } else {
                        console.log("Error al registrarse");
                    }
                });
            }
        }

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
                    console.log("derecha enviado " + $scope.relative.x)
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