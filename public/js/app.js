'use strict';

var app = angular.module('devFest', [
    'devFest.controllers',
    'devFest.directives',
    'devFest.services',

    // dependencias de terceros
    'btford.socket-io'
]);