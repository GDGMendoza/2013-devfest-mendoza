(function() {
  'use strict';

  angular
    .module('DevFest2013')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

  }

})();
