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
                scope.dynamicStyle = {};
                scope.$watch('status', function(newval, oldval){
                    element.removeClass(oldval.role)
                    element.addClass(newval.role);
                    scope.dynamicStyle = {
                        'left': scope.status.pos.x + 'px',
                        'top': scope.status.pos.y + 'px'
                    };
                });
            },
            template:'<div style="font-weight: bolder; font-size: 14px; margin-top: -14px">{{status.nick}}</div>'
        }
    });
