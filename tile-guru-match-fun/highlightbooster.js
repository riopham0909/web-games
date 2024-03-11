/**
 * Created by vladislav on 28.09.2020
 */

var HighlightBooster = function () {
    BaseBoosterBefore.call(this, cleverapps.Boosters.TYPE_HIGHLIGHT);
};

HighlightBooster.prototype = Object.create(BaseBoosterBefore.prototype);
HighlightBooster.prototype.constructor = HighlightBooster;

HighlightBooster.prototype.execute = function () {
    BaseBoosterBefore.prototype.execute.call(this);

    Game.currentGame.currentHighlighter.enable();
};