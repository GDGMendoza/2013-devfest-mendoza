'use strict';

/* Directives */

angular.module('devFest.directives', []).
    directive('player', function () {
        return {
            restrict:'E',
            scope: {
                'status': '='
            },
            link: function(scope, element, attrs){
                element.css({'left': scope.status.pos.x, 'top': scope.status.pos.y})
            },
            template:'<div ng-switch="status.live">' +
                '<img ng-switch-when="true" ng-src="img/characters/{{status.role}}.png" alt="" class="player"/>' +
                '<img ng-switch-when="false" ng-src="img/characters/blood.png" alt="" class="player"/>' +
                '</div>'
        }
    });
