'use strict';

/* Controllers */

angular.module('devFest.controllers', []).
  controller('AppCtrl', function ($scope) {
    //fallback controller
    /*socket.on('send:name', function (data) {
      $scope.name = data.name;
    });*/
  }).
  controller('LoginCtrl', function ($scope, $http, $location) {
    $scope.login = function(){
      $location.path("/game");
    }
  }).
  controller('GameCtrl', function ($scope, socket) {

    $scope.pruebaEstilo = {
      'background-color': 'red',
      'width': '50px',
      'height': '50px',
      'position': 'absolute'
    }

    socket.on('update', function (data) {
      $scope.players = [];
      var id;
      for (id in data.otherPlayers){
        $scope.players.push(data.otherPlayers[id])
      }
      $scope.players.push(data.evilPlayer);
      //$scope.evilPlayer = data.evilPlayer;
      //$scope.otherPlayers = data.otherPlayers;
    });
    socket.on('scores', function (data) {
      $scope.scores = [];
      var id;
      for (id in data){
        $scope.scores.push(data[id]);
      }
      //$scope.scores = data;
    });
    $scope.move = function(relative){
      socket.emit('move', relative);
    }
  });
