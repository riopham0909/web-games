/**
 * Created by andrey on 27.06.2022
 */

var GameMessage = function () {
    this.onShowMessage = function () {};
};

GameMessage.prototype.showMessage = function (message, options) {
    options = options || {};
    options.delay = options.delay || 1.2;
    options.skin = this.getSkin();
    
    cleverapps.timeouts.setTimeout(function () {
        this.onShowMessage(message, options);
    }.bind(this), 200);

    if (options.callback) {
        var delay = options.callbackDelay || options.delay;
        cleverapps.timeouts.setTimeout(options.callback, 200 + 500 + delay * 1000 + 500);
    }
};

GameMessage.prototype.getSkin = function () {
    if (cleverapps.isRumble() && cleverapps.meta.getRumble().getCurrentRound().isLast()) {
        return "hard";
    }
    if (Game.currentGame.level.isHard()) {
        return "hard";
    }
    if (Game.currentGame.level.isTricky()) {
        return "tricky";
    }
    if (Game.currentGame.level.episode.isBonusRound()) {
        return "bonus_round";
    }
};