/**
 * Created by Andrey Popov on 07.06.2021
 */

var BonusRoundMenuBarItem = function (config) {
    MenuBarItem.call(this, config);
};

BonusRoundMenuBarItem.prototype = Object.create(MenuBarItem.prototype);
BonusRoundMenuBarItem.prototype.constructor = BonusRoundMenuBarItem;

BonusRoundMenuBarItem.prototype.customInit = function () {
    Game.currentGame.on("stop", function () {
        if (Game.currentGame.outcome === GameBase.OUTCOME_LOST) {
            this.onSetAnimationAndHide("timeout");
        }
    }.bind(this), this);

    this.updateTimer();
};

BonusRoundMenuBarItem.prototype.timerRefresh = function () {
    if (this.timerTTF !== this.calcTimerTTF()) {
        this.updateTimer();
        return;
    }

    this.onChangeText();
};

BonusRoundMenuBarItem.prototype.updateTimer = function () {
    var timer = this.timer;
    this.stopTimer();

    var timeLeft = Game.currentGame.bonusRoundCountDown.getTimeLeft();
    if (timeLeft > 0) {
        this.setTimer(new cleverapps.CountDown(timeLeft, {
            onFinish: this.updateTimer.bind(this)
        }));
    }

    this.onUpdateTimer(Boolean(this.timer) === Boolean(timer));
    this.onChangeText();
};