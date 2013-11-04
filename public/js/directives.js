'use strict';

/* Directives */

angular.module('devFest.directives', [])
    .directive('player', function () {
        return {
            restrict:'E',
            scope: {
                'status': '='
            },
            link: function(scope, element, attrs){
                scope.$watch('status', function(){
                    element.css({
                        'left': scope.status.pos.x + 'px',
                        'top': scope.status.pos.y + 'px',
                        'background-color': scope.status.role
                    });
                });
            },
            template:'<div ng-switch="status.alive">' +
                //'<img ng-switch-when="true" ng-src="img/characters/{{status.role}}.png" alt="" class="player"/>' +
                //'<img ng-switch-when="false" ng-src="img/characters/blood.png" alt="" class="player"/>' +
                '</div>'
        }
    });
