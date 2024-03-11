/**
 * Created by vladislav on 28.09.2020
 */

var MagnifierBooster = function() {
    BaseBoosterBefore.call(this, cleverapps.Boosters.TYPE_MAGNIFIER);
};

MagnifierBooster.prototype = Object.create(BaseBoosterBefore.prototype);
MagnifierBooster.prototype.constructor = MagnifierBooster;

MagnifierBooster.prototype.execute = function() {
    BaseBoosterBefore.prototype.execute.call(this);

    Game.currentGame.keypad.addMagnifiers(MagnifierBooster.AMOUNT);
    Game.currentGame.keypad.magnifiersShowUp();
};

MagnifierBooster.AMOUNT = 5;