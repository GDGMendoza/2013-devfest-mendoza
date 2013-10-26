'use strict';

var app = angular.module('devFest', [
  'devFest.controllers',
  'devFest.directives',

  // dependencias de terceros
  'btford.socket-io'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  //$locationProvider.html5Mode(true);
});
