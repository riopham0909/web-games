/**
 * Created by Andrey Popov on 6/3/21
 */

var MenuBarItem = function (config) {
    this.config = config;
    this.timerShowHours = false;

    this.onRemove = function () {};
    this.onChangeText = function () {};
    this.onUpdateTimer = function () {};
    this.onShowForce = function () {};
    this.onUpdateSticker = function () {};

    this.onAttentionOnListener = function () {};
    this.onAttentionOffListener = function () {};

    this.onFingerOnListener = function () {};
    this.onFingerOffListener = function () {};

    this.onUpdateClickable = function () {};
    this.onUpdatePlusButton = function () {};
};

MenuBarItem.prototype.isAvailableOnScene = function () {
    var scenes = this.config.availableOnScenes;

    if (typeof scenes === "function") {
        scenes = scenes();
    }

    return cleverapps.environment.hasScene(scenes || []);
};

MenuBarItem.prototype.init = function () {
    this.stopped = false;

    Object.assign(this, this.config);

    this.plusButton = this.withPlusButton();

    if (this.config.onClickWindow) {
        this.canActionNow = function () {
            if (this.config.force && cleverapps.forces.isRunningForce(this.config.force)) {
                return true;
            }
            return !cleverapps.meta.isFocused();
        }.bind(this);

        this.action = function () {
            var isRunningForce = this.config.force && cleverapps.forces.isRunningForce(this.config.force);
            if (isRunningForce) {
                cleverapps.forces.closeRunningForce();
            }

            if (this.onAction) {
                this.onAction();
            }

            cleverapps.meta.display({
                focus: "MenuBar" + this.getName() + "Window",
                control: this.getControlName(),
                action: function (f) {
                    var WindowClass = this.config.onClickWindow;
                    var windowOptions = typeof this.config.onClickOptions === "function" ? this.config.onClickOptions() : this.config.onClickOptions;
                    windowOptions = windowOptions || {};
                    if (isRunningForce && this.config.force.productKey) {
                        windowOptions.force = this.config.force;
                    }

                    new WindowClass(windowOptions);
                    cleverapps.meta.onceNoWindowsListener = f;
                }.bind(this)
            });
        }.bind(this);
    }

    if (this.config.updater) {
        this.config.updater.call(this, this.changeText.bind(this));
        this.updater = undefined;
    }

    if (this.config.attentionUpdater) {
        this.config.attentionUpdater.call(this, this.updateAttention.bind(this));
    }

    if (this.config.clickableUpdater) {
        this.config.clickableUpdater.call(this, function () {
            this.updateClickable();
            this.updatePlusButton();
        }.bind(this));
    }

    this.updateClickable();

    this.updateAttention();
    this.customInit();
};

MenuBarItem.prototype.updateClickable = function () {
    var clickable = this.action && (!this.config.isClickable || this.config.isClickable());

    if (clickable === this.clickable) {
        return;
    }

    this.clickable = clickable;

    this.onUpdateClickable();
};

MenuBarItem.prototype.changeText = function () {
    this.onChangeText();
};

MenuBarItem.prototype.updateAttention = function () {
    if (this.stopped || !this.config.attention) {
        return;
    }
    var attention = this.config.attention();
    if (this.attention !== attention) {
        this.attention = attention;

        if (attention) {
            this.onAttentionOnListener();
        } else {
            this.onAttentionOffListener();
        }
    }
};

MenuBarItem.prototype.updatePlusButton = function () {
    var plusButton = this.withPlusButton();

    if (plusButton === this.plusButton) {
        return;
    }

    this.plusButton = plusButton;

    this.onUpdatePlusButton();
};

MenuBarItem.prototype.withPlusButton = function () {
    return this.config.plusButton && (!this.config.isClickable || this.config.isClickable());
};

MenuBarItem.prototype.customInit = function () {
};

MenuBarItem.prototype.getName = function () {
    return this.config.name;
};

MenuBarItem.prototype.getTargetTypes = function () {
    return this.config.targets;
};

MenuBarItem.prototype.getControlName = function () {
    return "MenuBar" + this.getName();
};

MenuBarItem.prototype.getCurrentValue = function () {
    return {
        amount: this.config.value && this.config.value() || 0
    };
};

MenuBarItem.prototype.getViewClass = function () {
    return this.config.viewClass || MenuBarItemView;
};

MenuBarItem.prototype.getText = function () {
    if (this.timer) {
        return cleverapps.intervalToString(this.timer.getTimeLeft(), this.timerShowHours);
    }

    var value = this.getCurrentValue();
    return value.amount === undefined ? "" : "" + value.amount;
};

MenuBarItem.prototype.calcTimerTTF = function () {
    var timeLeft = this.timer && this.timer.getTimeLeft() || 0;
    return timeLeft >= (cleverapps.ONE_DAY - 1000)
        || !this.timerShowHours && timeLeft > (cleverapps.ONE_HOUR - 1000);
};

MenuBarItem.prototype.timerRefresh = function () {
    if (this.timerTTF !== this.calcTimerTTF()) {
        this.updateTimer();
        return;
    }

    if (this.onRefreshTimer) {
        this.onRefreshTimer();
    }
};

MenuBarItem.prototype.updateTimer = function () {
    var timer = this.timer;
    this.stopTimer();

    if (this.onChangeTimer) {
        this.onChangeTimer(Boolean(this.timer) === Boolean(timer));
    }
    if (this.onRefreshTimer) {
        this.onRefreshTimer();
    }
};

MenuBarItem.prototype.stop = function () {
    this.stopped = true;
    this.stopTimer();
};

MenuBarItem.prototype.clean = function () {
    this.stop();
    runCleaners(this);
};

MenuBarItem.prototype.stopTimer = function () {
    if (this.timer) {
        this.timer.stop();
        this.timer = false;
    }
};

MenuBarItem.prototype.setTimer = function (timer) {
    this.timer = timer;
    this.timer.onSecond = this.timerRefresh.bind(this);
    this.timerTTF = this.calcTimerTTF();
};

MenuBarItem.prototype.getSticker = function () {
    return this.config.sticker && this.config.sticker();
};

MenuBarItem.prototype.setFinger = function (finger) {
    finger = !!finger;
    if (this.finger !== finger) {
        this.finger = finger;

        if (finger) {
            this.onFingerOnListener();
        } else {
            this.onFingerOffListener();
        }
    }
};
