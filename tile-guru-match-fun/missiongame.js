/**
 * Created by vladislav on 15.10.2019
 */

var MissionGame = function (mission) {
    cleverapps.EventEmitter.call(this);
    this.running = true;
    this.paused = false;
    this.mission = mission;
};


MissionGame.prototype = Object.create(cleverapps.EventEmitter.prototype);
MissionGame.prototype.constructor = MissionGame;

MissionGame.prototype.pause = function () {
    this.paused = true;
};

MissionGame.prototype.resume = function () {
    this.paused = false;
    this.trigger("resumed");
};

MissionGame.prototype.getName = function () {
    return '';
};

MissionGame.prototype.finish = function (options) {
    if (this.running) {
        if (this.reward > 0) {
            this.mission.update(this.reward);
        }

        this.running = false;
        this.trigger("finish", options);

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.MINIGAME_FINISH + '_' + this.getName());
        cleverapps.playSession.set(cleverapps.EVENTS.MINIGAME_FINISH + '_' + this.getName(), true);
    }
};
