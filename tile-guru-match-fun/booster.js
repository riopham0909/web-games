/**
 * Created by andrey on 20.02.18.
 */

var Booster = function (id) {
    BaseBooster.call(this, id);

    this.onForceListener = function () {};
    this.onToggleArrowListener = function () {};
    this.onToggleTintListener = function () {};
    this.onExecuteListener = function () {};
    this.onDisableListener = function () {};
    this.onEnableListener = function () {};

    this.alarm = new Alarm();
    this.alarm.onChangeListeners.tint = this.toggleTint.bind(this);
    this.alarm.onChangeListeners.arrow = this.toggleArrow.bind(this);

    cleverapps.eventBus.on("changeFocus", function () {
        if (this.alarm.isOn()) {
            this.stopHint();
        }
    }.bind(this));
};

Booster.prototype = Object.create(BaseBooster.prototype);
Booster.prototype.constructor = Booster;

Booster.prototype.onGameStarted = function () {
    if (!this.disableForceOnInactive && this.isForceAvailable()) {
        Game.currentGame.userStatus.on("inactive_long", this.showForce.bind(this));
    }
};

Booster.prototype.clear = function () {
    this.alarm.clear();
};

Booster.prototype.onUserActive = function () {
    this.stopHint();
};

Booster.prototype.clearAlarmTimeout = function () {
    if (this.alarmTimeout) {
        clearTimeout(this.alarmTimeout);
        this.alarmTimeout = undefined;
    }
};

Booster.prototype.startHint = function (manual) {
    if (manual) {
        this.manualAlarm = true;
    }
    this.alarm.start("hint", 1);
    this.clearAlarmTimeout();
};

Booster.prototype.stopHint = function () {
    this.manualAlarm = false;
    this.alarm.stop("hint");
    this.clearAlarmTimeout();
};

Booster.prototype.onUserInactive = function () {
    if (this.manualAlarm || cleverapps.meta.isFocused()) {
        return;
    }
    this.startHint();
    this.alarmTimeout = setTimeout(this.stopHint.bind(this), cleverapps.parseInterval(Booster.StopAlarmTimeout));
};

Booster.prototype.toggleTint = function () {
    this.onToggleTintListener(this.alarm.isOn());
};

Booster.prototype.toggleArrow = function () {
    this.onToggleArrowListener(this.alarm.isOn());
};

Booster.prototype.showForce = function () {
    return this.onForceListener();
};

Booster.prototype.onPressed = function (f, isRunningForce) {
    if (Game.currentGame.outcome !== GameBase.OUTCOME_UNKNOWN) {
        f();
        return;
    }

    if (Game.currentGame.counter.isActive()) {
        f();
        return;
    }

    if (Game.currentGame.open && !Game.currentGame.open.isStable()) {
        f();
        return;
    }

    if (isRunningForce) {
        var amount = this.getAmount() + 1;
        this.setAmount(amount);
    }

    if (this.canExecute()) {
        this.execute();
        f();
    } else if (this.isAdsAvailable()) {
        cleverapps.rewardedAdsManager.loadAndPlay({
            type: RewardedAdsManager.REWARDED,
            adLimit: this.limit,
            callback: function () {
                cleverapps.adsLimits.watch(this.limit);
                this.execute();
                f();
            }.bind(this),
            onCancelCallback: function () {
                f();
            }
        });
    } else if (this.buy()) {
        this.execute();
        f();
    } else if (cleverapps.windows.isActive()) {
        cleverapps.meta.onceNoWindowsListener = f;
    } else {
        f();
    }
};

Booster.prototype.execute = function (options) {
    this.onExecute(options);

    this.use();

    this.onExecuteListener();
};

Booster.StopAlarmTimeout = "5 seconds";