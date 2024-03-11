/**
 * Created by Andrey Popov on 07.06.2021
 */

var WorkersMenuBarItem = function (config) {
    MenuBarItem.call(this, config);

    this.timerShowHours = true;
};

WorkersMenuBarItem.prototype = Object.create(MenuBarItem.prototype);
WorkersMenuBarItem.prototype.constructor = WorkersMenuBarItem;

WorkersMenuBarItem.prototype.customInit = function () {
    Game.currentGame.workers.onChangeStatusListener = this.changeText.bind(this);
    Game.currentGame.workers.onChangeTotalAmount = function (deltaAmount) {
        this.changeText(deltaAmount);
        this.updateTimer();
        this.onUpdateSticker();
        this.updateAttention();
    }.bind(this);

    cleverapps.adsLimits.on("update", this.updateAttention.bind(this), this);

    this.updateTimer();
};

WorkersMenuBarItem.prototype.getCurrentValue = function () {
    return {
        amount: Game.currentGame.workers.countRegularFree(),
        total: Game.currentGame.workers.countRegularTotal()
    };
};

WorkersMenuBarItem.prototype.highlightTotal = function () {
    return (Game.currentGame && Game.currentGame.workers.isBonusWorkerBuyed())
        || (Game.currentGame && Game.currentGame.isMainGame() && Subscription.IsAvailable() && cleverapps.subscription.isActive());
};

WorkersMenuBarItem.prototype.updateTimer = function () {
    var timer = this.timer;
    this.stopTimer();

    if (Game.currentGame && Game.currentGame.workers.isBonusWorkerBuyed()) {
        this.setTimer(new cleverapps.CountDown(Game.currentGame.workers.bonusWorkerLeftTime(), { onFinish: this.updateTimer.bind(this) }), true);
    }

    if (this.onChangeTimer) {
        this.onChangeTimer(!!this.timer === !!timer);
    }
    if (this.onRefreshTimer && this.timer) {
        this.onRefreshTimer();
    }
};