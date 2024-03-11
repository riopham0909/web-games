/**
 * Created by Andrey Popov on 07.05.2020
 */

var GameTimer = function (game) {
    cleverapps.EventEmitter.call(this);

    this.start = game.savedGame.timeStart || Date.now();
    this.seconds = game.savedGame.seconds || 0;

    this.interval = setInterval(function () {
        if (game.outcome === GameBase.OUTCOME_UNKNOWN && game.began) {
            this.seconds++;
            this.trigger("onSecond");
        }
    }.bind(this), 1000);
};

GameTimer.prototype = Object.create(cleverapps.EventEmitter.prototype);
GameTimer.prototype.constructor = GameTimer;

GameTimer.prototype.getStartTime = function () {
    return this.start;
};

GameTimer.prototype.getTime = function () {
    return Date.now() - this.start;
};

GameTimer.prototype.getInGameTime = function () {
    return this.seconds;
};

GameTimer.prototype.stop = function () {
    clearInterval(this.interval);
};