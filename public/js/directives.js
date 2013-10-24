'use strict';

/* Directives */

angular.module('devFest.directives', []).
  directive('moveReceptor', function () {
    return {
    	link: function(scope, element, attrs){
    		var relative = {
    			x: 0,
    			y: 0
    		}
    		element.on('keyup', function(e){
    			switch(e.keyCode){
    				case '65': //left
    				case '68': //right
    					relative.x = 0;
    					break;
  					case '87': //up
  					case '83': //down
  						relative.y = 0;
    					break;
    			}
        });
        element.on('keydown', function(e){
    			switch(e.keyCode){
    				case '65': //left
    					relative.x = -1;
    					break;
    				case '68': //right
    					relative.x = 1;
    					break;
  					case '87': //up
  						relative.y = 1;
    					break;
  					case '83': //down
  						relative.y = -1;
    					break;
    			}
    			scope.move(relative);
        });
    	}
    }
  });
