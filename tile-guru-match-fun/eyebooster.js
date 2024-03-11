/**
 * Created by vladislav on 28.09.2020
 */

var EyeBooster = function () {
    BaseBoosterBefore.call(this, cleverapps.Boosters.TYPE_EYE);
};

EyeBooster.prototype = Object.create(BaseBoosterBefore.prototype);
EyeBooster.prototype.constructor = EyeBooster;

EyeBooster.prototype.execute = function () {
    BaseBoosterBefore.prototype.execute.call(this);

    this.trigger("giveBonus");
};

EyeBooster.prototype.getExecuteDuration = function () {
    return 5;
};