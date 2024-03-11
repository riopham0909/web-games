/**
 * Created by vladislav on 13.07.20.
 */

var ShuffleBooster = function (id) {
    Booster.call(this, id);
};

ShuffleBooster.prototype = Object.create(Booster.prototype);
ShuffleBooster.prototype.constructor = ShuffleBooster;

ShuffleBooster.prototype.onExecute = function () {
    Game.currentGame.keypad.shuffle();
};
