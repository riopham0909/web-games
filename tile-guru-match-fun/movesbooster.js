/**
 * Created by andrey on 21.05.2020
 */

var MovesBooster = function () {
    BaseBoosterBefore.call(this, cleverapps.Boosters.TYPE_MOVES);
};

MovesBooster.prototype = Object.create(BaseBoosterBefore.prototype);
MovesBooster.prototype.constructor = MovesBooster;

MovesBooster.prototype.execute = function() {
    if (this.isLevelWithUnlimitedLives()) {
        return;
    }

    BaseBoosterBefore.prototype.execute.call(this);

    var moves = MovesBooster.MOVES_AMOUNT;

    Game.currentGame.setMoves(Game.currentGame.moves + moves, {
        animate: true,
        boosterBefore: true
    });
    Game.currentGame.beginMoves += moves;
};

MovesBooster.prototype.isLevelWithUnlimitedLives = function () {
    return Game.currentGame.moves === -1;
};

MovesBooster.MOVES_AMOUNT = 5;