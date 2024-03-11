/**
 * Created by Andrey Popov on 07.06.2021
 */

var LivesMenuBarItem = function (config) {
    MenuBarItem.call(this, config);

    this.onUpdateLotteryIcon = function () {};
};

LivesMenuBarItem.prototype = Object.create(MenuBarItem.prototype);
LivesMenuBarItem.prototype.constructor = LivesMenuBarItem;

LivesMenuBarItem.prototype.clearListeners = function () {
    this.lives.onChangeAmountListeners.livesview = function () {};
    this.lives.onStartRegenerateListener = function () {};
    this.lives.onBuyUnlimitedLivesListener = function () {};
};

LivesMenuBarItem.prototype.customInit = function () {
    if (this.lives) {
        this.clearListeners();
    }
    this.lives = cleverapps.lives;

    this.attention = false;

    this.lives.onChangeAmountListeners.livesview = this.updateAll.bind(this);
    this.lives.onStartRegenerateListener = this.updateAll.bind(this);
    this.lives.onBuyUnlimitedLivesListener = this.updateAll.bind(this);

    if (Game.currentGame && Game.currentGame.energyLottery) {
        Game.currentGame.energyLottery.onShowHint = this.setFinger.bind(this, true);
        Game.currentGame.energyLottery.onHideHint = this.setFinger.bind(this);
    }

    this.updateAll();
};

LivesMenuBarItem.prototype.onAction = function () {
    this.setFinger(false);
};

LivesMenuBarItem.prototype.withPlusButton = function () {
    if (cleverapps.unlimitedLives && cleverapps.unlimitedLives.checkBuyed()) {
        return false;
    }

    return MenuBarItem.prototype.withPlusButton.call(this);
};

LivesMenuBarItem.prototype.updateAll = function () {
    if (cleverapps.unlimitedLives && cleverapps.unlimitedLives.checkBuyed()) {
        this.totalIcon = bundles.menubar.frames.unlim_png;
    } else {
        this.totalIcon = false;
    }

    this.changeText();

    this.updatePlusButton();
    this.updateTimer();
    this.updateAttention();
};

LivesMenuBarItem.prototype.updateTimer = function () {
    var timer = this.timer;

    this.stopTimer();

    this.lottery = !["merge"].includes(cleverapps.config.type);
    if (cleverapps.unlimitedLives && cleverapps.unlimitedLives.checkBuyed()) {
        this.lottery = false;
        this.setTimer(new cleverapps.CountDown(cleverapps.unlimitedLives.getLeftTime(), {
            onFinish: function () {
                if (!cleverapps.meta.isFocused() && cleverapps.environment.hasScene([cleverapps.Environment.SCENE_MAIN, cleverapps.Environment.SCENE_DAILY_CUP])) {
                    cleverapps.unlimitedLives.displayPromotionOnFinish();
                }
                this.updateAll();
            }.bind(this)
        }), false);
    } else if (this.lives.amount < this.lives.getMaxLives() && this.lives.calcTimeLeft() > 0) {
        this.lottery = false;
        this.setTimer(new cleverapps.CountDown(this.lives.calcTimeLeft(), { onFinish: this.updateAll.bind(this) }), false);
    }

    this.onUpdateLotteryIcon();

    if (this.onChangeTimer) {
        this.onChangeTimer(!!this.timer === !!timer);
    }
    if (this.onRefreshTimer && this.timer) {
        this.onRefreshTimer();
    }
};

LivesMenuBarItem.prototype.getCurrentValue = function () {
    if (cleverapps.unlimitedLives && cleverapps.unlimitedLives.checkBuyed()) {
        var time = Date.now() + cleverapps.unlimitedLives.getLeftTime();
    }

    return {
        amount: cleverapps.lives.amount,
        total: cleverapps.lives.getMaxLives(),
        time: time
    };
};