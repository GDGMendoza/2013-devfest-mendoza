(function() {
  'use strict';

  angular
    .module('dfGame')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'GameController',
        controllerAs: 'vmGame'
      });
  }

})();
