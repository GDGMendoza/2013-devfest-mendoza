'use strict';

/* Directives */

angular.module('devFest.directives', [])
    .directive('player', function (canvasService) {
        return {
            restrict:'E',
            scope: {
                'status': '='
            },
            link: function(scope, element, attrs){
                scope.$watch('status', function(newval, oldval){
                  canvasService.updatePlayerStatus(scope.status);
                    element.removeClass(oldval.role)
                    element.addClass(newval.role);
                    element.css({
                        'left': scope.status.pos.x + 'px',
                        'top': scope.status.pos.y + 'px'
                    });
                });
            },
            template:'<div style="font-weight: bolder; font-size: 14px; margin-top: -14px">{{status.nick}}</div>'
        }
    });
