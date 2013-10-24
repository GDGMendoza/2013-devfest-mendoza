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
    socket.on('update', function (data) {
      $scope.evilPlayer = data.evilPlayer;
      $scope.otherPlayers = data.otherPlayers;
    });
    socket.on('scores', function (data) {
      $scope.scores = data;
    });
    $scope.move = function(relative){
      socket.emit('move', relative);
    }
  });
