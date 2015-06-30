(function() {
  'use strict';

  angular
    .module('dfMain')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vmMain'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
