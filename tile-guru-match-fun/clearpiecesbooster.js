/**
 * Created by Ivan on 17.09.2023
 */

var ClearPiecesBooster = function (id) {
    Booster.call(this, id);
};

ClearPiecesBooster.prototype = Object.create(Booster.prototype);
ClearPiecesBooster.prototype.constructor = ClearPiecesBooster;

ClearPiecesBooster.prototype.onExecute = function () {
    Game.currentGame.grid.runClearBang();
};