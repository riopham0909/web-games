/**
 * Created by Aleksandr on 10.03.2023
 */

var Mark = function (type) {
    cleverapps.EventEmitter.call(this);

    this.type = type;
};

Mark.prototype = Object.create(cleverapps.EventEmitter.prototype);
Mark.prototype.constructor = Mark;

Mark.prototype.show = function (silent) {
    this.trigger("show", silent);
};

Mark.prototype.hide = function () {
    this.trigger("hide");
};

Mark.prototype.alwaysVisible = function () {
    return this.type === "magnet";
};

Mark.prototype.collect = function () {
    var target;
    var callback;

    if (this.type === "mission") {
        target = "mission_billet" + Mission.TYPE_LETTER;
        callback = function () {
            Game.currentGame.addClover(Mission.TYPE_LETTER, 1);
        };
    }

    if (callback) {
        Game.currentGame.setTimeout(callback, Mark.COLLECT_DURATION);
    }

    this.trigger("collect", target);
};

Mark.COIN_REWARD = 5;

Mark.COLLECT_DURATION = 700;
