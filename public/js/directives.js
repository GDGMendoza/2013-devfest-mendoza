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
                //scope.estiloCustom = {};
                scope.$watch('status.pos.x', function(){
                    element.css({'left': scope.status.pos.x})
                });
                scope.$watch('status.pos.y', function(){
                    element.css({'top': scope.status.pos.y})
                });
                scope.$watch('status.role', function(){
                    element.css({'background-color': scope.status.role})
                });
            },
            template:'<div ng-switch="status.alive">' +
                //'<img ng-switch-when="true" ng-src="img/characters/{{status.role}}.png" alt="" class="player"/>' +
                //'<img ng-switch-when="false" ng-src="img/characters/blood.png" alt="" class="player"/>' +
                '</div>'
        }
    });
