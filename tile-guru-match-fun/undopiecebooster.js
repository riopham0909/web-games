/**
 * Created by Ivan on 17.09.2023
 */

var UndoPieceBooster = function (id) {
    Booster.call(this, id);
};

UndoPieceBooster.prototype = Object.create(Booster.prototype);
UndoPieceBooster.prototype.constructor = UndoPieceBooster;

UndoPieceBooster.prototype.onExecute = function () {
    Game.currentGame.history.undo();
};

UndoPieceBooster.prototype.onGameStarted = function () {
    var game = Game.currentGame;
    game.history.onChangeListener = function (hasUndo) {
        if (hasUndo) {
            this.onEnableListener();
        } else {
            this.onDisableListener();
        }
    }.bind(this);
};