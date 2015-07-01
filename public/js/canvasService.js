(function() {
  "use strict";
  angular.module("devFest")
    .factory("canvasService", canvasService);

  canvasService.$inject = ['$q'];

  function canvasService($q) {
    var canvasService = {
      canvas: undefined,
      init: init,
      updatePlayerStatus: updatePlayerStatus,
      players: []
    }

    var charMap = {
      'arya': 'arya_stark',
      'asha': 'asha_greyjoy',
      'brienne': 'brienne_of_tarth',
      'daenerys': 'daenerys_targaryen'
    }
    return canvasService;

    function init() {
      if(!_.isUndefined(canvasService.canvas)) {
        canvasService.canvas.clear();
        canvasService.players.length = 0;
      }
      var canvas = canvasService.canvas = new fabric.Canvas('canvas');

      canvas.setHeight(window.innerHeight);
      canvas.setWidth(window.innerWidth);

      var background = new fabric.Image.fromURL('/img/westeros.jpg', function(oImg) {
        oImg.selectable = false;
        oImg.setHeight(window.innerHeight);
        oImg.setWidth(window.innerWidth);
        canvas.add(oImg);
      });

    };

    function getCanvasPlayer(player) {
      var defer = $q.defer();
      var playerObject = _.find(canvasService.players, function(oPlayer){
        return oPlayer.id == player.nick;
      });
      if (!_.isUndefined(playerObject)) return $q.when(playerObject);
      new fabric.Image.fromURL('/img/martin.png', function(playerCanvas) {
        console.log(player);
        playerCanvas.id = player.nick;
        playerCanvas.height = 50;
        playerCanvas.width = 50;

        canvasService.players.push(playerCanvas);
        canvasService.canvas.add(playerCanvas);
        defer.resolve(playerCanvas);
      });
      return defer.promise;
    }

    function updatePlayerStatus(player) {
      getCanvasPlayer(player).then(function(playerCanvas){
        if(!player.alive) playerCanvas._element.setAttribute("src", 'img/death.png');
        playerCanvas.top = player.pos.y;
        playerCanvas.left = player.pos.x;
        canvasService.canvas.renderAll();
      });
    }
  };




})();
