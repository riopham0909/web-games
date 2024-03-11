/**
 * Created by denis on 6 august 2020
 */

var DiceBooster = function() {
    BaseBoosterBefore.call(this, cleverapps.Boosters.TYPE_DICE);
};

DiceBooster.prototype = Object.create(BaseBoosterBefore.prototype);
DiceBooster.prototype.constructor = DiceBooster;

DiceBooster.prototype.execute = function() {
    BaseBoosterBefore.prototype.execute.call(this);

    Game.currentGame.dice.roll();
    Game.currentGame.dice.reward();

    this.number = Game.currentGame.dice.number;
};

DiceBooster.prototype.getExecuteDuration = function() {
    return 2.6 + (this.number || 6) * 0.2;
};