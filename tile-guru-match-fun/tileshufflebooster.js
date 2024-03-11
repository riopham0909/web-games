/**
 * Created by vladislav on 13.07.20.
 */

var TileShuffleBooster = function (id) {
    Booster.call(this, id);
};

TileShuffleBooster.prototype = Object.create(Booster.prototype);
TileShuffleBooster.prototype.constructor = TileShuffleBooster;

TileShuffleBooster.prototype.onGameStarted = function () {
    Game.currentGame.log.on("change", this.updateState.bind(this));
    Game.currentGame.pagination.on("changePage", this.updateState.bind(this));
    Game.currentGame.userStatus.on("inactive_very_short", function () {
        if (this.isForceAvailable()) {
            this.showForce();
        }
    }.bind(this));
};

TileShuffleBooster.prototype.updateState = function () {
    if (Game.currentGame.table.cards.length <= 1) {
        this.onDisableListener();
    } else {
        this.onEnableListener();
    }
};

TileShuffleBooster.prototype.onExecute = function () {
    Game.currentGame.table.shuffle();
};
