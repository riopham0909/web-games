/**
 * Created by slava on 20/6/19
 */

var BaseMiniGame = function () {
    cleverapps.EventEmitter.call(this);
    this.running = true;
    this.paused = false;
};

BaseMiniGame.prototype = Object.create(cleverapps.EventEmitter.prototype);
BaseMiniGame.prototype.constructor = BaseMiniGame;

BaseMiniGame.prototype.pause = function () {
    this.paused = true;
};

BaseMiniGame.prototype.resume = function () {
    this.paused = false;
    this.trigger("resumed");
};

BaseMiniGame.prototype.getName = function () {
    return '';
};

BaseMiniGame.prototype.finish = function (options) {
    options = options || {};
    if (this.running) {
        this.running = false;
        this.trigger("finish", options);

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.MINIGAME_FINISH + '_' + this.getName());
        cleverapps.playSession.set(cleverapps.EVENTS.MINIGAME_FINISH + '_' + this.getName(), true);
    }
};