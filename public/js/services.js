'use strict';

/* Controllers */

angular.module('devFest.services', [])
    .service('WorldService', function () {
        this.players = [];
        this.scores = [];
    });
