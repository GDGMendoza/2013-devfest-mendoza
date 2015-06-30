(function() {
  'use strict';

  angular
    .module('dfLogin')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vmLogin'
      });
  }

})();
