/**
 * Created by slava on 14.02.17.
 */

cleverapps.CountDownView = cc.Node.extend({
    ctor: function (countDown, style) {
        this.style = style || {};

        this._super();
        this.setAnchorPoint(0.5, 0.5);

        if (typeof countDown === "number") {
            this.countDown = this.createStaticCountdown(countDown);
        } else {
            this.countDown = countDown;
        }

        var background;
        if (this.style.bar) {
            background = this.createBar();
        } else if (this.style.background_content) {
            background = this.style.background_content;
        } else if (this.style.background) {
            background = cleverapps.UI.createScale9Sprite(this.style.background.frame, cleverapps.UI.Scale9Rect.TwoPixelXY);
            background.setContentSize2(this.style.background.width || background.width, this.style.background.height || background.height);
        }

        if (background) {
            background.setCascadeOpacityEnabled(true);
            background.setCascadeColorEnabled(true);
            background.setAnchorPoint2();
            background.setPositionRound(0, 0);
            this.addChild(background);
        }

        var leftTimeText = this.leftTimeText = new cc.Node();
        leftTimeText.setCascadeOpacityEnabled(true);
        leftTimeText.setCascadeColorEnabled(true);
        leftTimeText.setAnchorPoint2();
        this.addChild(leftTimeText);
        this.refresh();

        var leftTimeStyles = this.style.timerPosition || { x: 0, y: 0 };
        leftTimeText.setPositionRound(leftTimeStyles.x, leftTimeStyles.y);

        if (this.style.icon) {
            var icon;
            if (this.style.icon.json) {
                icon = new cleverapps.Spine(this.style.icon.json);
                icon.setAnimation(0, this.style.icon.animation, true);
                this.style.icon.stopped && icon.clearTrack(0);
            } else {
                icon = new cc.Sprite(this.style.icon.frame || this.style.icon);
            }

            if (background) {
                icon.setPositionRound(-background.width * background.scaleX / 2, 0);
                leftTimeText.setPositionRound(leftTimeText.x + icon.width / 4 + cleverapps.styles.CountDownView.textOffsetX, leftTimeText.y);
            } else {
                icon.setPositionRound(-leftTimeText.width * leftTimeText.scaleX / 2, 0);
                leftTimeText.setPositionRound(leftTimeText.x + icon.width * 0.65, leftTimeText.y);
            }

            this.addChild(icon);
        }

        cleverapps.UI.wrap(this);

        this.countDown.onSecond = this.createListener(this.refresh.bind(this));
    },

    createBar: function () {
        var bar = this.bar = new ScaledProgressBar(this.style.bar.type);
        bar.setLength(this.style.bar.width);

        var curVal = this.countDown.getTimeLeft();
        bar.fullValue = this.style.bar.fullValue || curVal;
        bar.setPercentage(this.calcBarPercentage(curVal, bar.fullValue));

        return bar;
    },

    calcBarPercentage: function (value, fullValue) {
        return (this.style.bar.reversed ? 1 - value / fullValue : value / fullValue) * 100;
    },

    createStaticCountdown: function (timeLeft) {
        return {
            onSecond: function () {},
            onFinish: function () {},
            getTimeLeft: function () {
                return timeLeft;
            },
            stop: function () {},
            remove: function () {}
        };
    },

    fitTo: function (maxWidth, maxHeight) {
        this.fitToSize = {
            width: maxWidth,
            height: maxHeight
        };

        if (this.text) {
            this.text.fitTo(maxWidth, maxHeight);
        }
    },

    recreateText: function (string) {
        if (this.text) {
            this.text.removeFromParent(true);
        }

        if (cleverapps.UI.ImageFont.IsApplicable(this.style.font, string)) {
            this.text = new cleverapps.UI.ImageFont(string, this.style.font, { fixedNumberWidth: true });
        } else {
            this.text = cleverapps.UI.generateOnlyText(string, this.style.font);
        }

        if (!this.leftTimeText.width || !this.leftTimeText.height) {
            this.leftTimeText.setContentSize2(this.text.width * this.text.scaleX, this.text.height * this.text.scaleY);
        }

        this.text.setPositionRound(this.leftTimeText.width / 2, this.leftTimeText.height / 2);
        this.leftTimeText.addChild(this.text);
    },

    setString: function (string) {
        if (!this.text) {
            this.recreateText(string);
            return;
        }

        cleverapps.UI.ImageFont.intertypeSetString({
            textObj: this.text,
            string: string,
            font: this.style.font,
            recreateFunc: this.recreateText.bind(this)
        });
    },

    updateBar: function () {
        if (this.bar.fullValue > cleverapps.CountDownView.BAR_ANIMATION_LIMIT) {
            this.bar.setPercentage(this.calcBarPercentage(this.countDown.getTimeLeft(), this.bar.fullValue));
        } else {
            this.bar.animatedChange(this.calcBarPercentage(this.countDown.getTimeLeft(), this.bar.fullValue), {
                time: 1,
                easing: false
            });
        }
    },

    refresh: function () {
        var string = cleverapps.intervalToString(this.countDown.getTimeLeft(), this.style.showHours);
        this.setString(string);

        if (this.text && this.fitToSize) {
            this.text.fitTo(this.fitToSize.width, this.fitToSize.height);
        }

        if (this.bar) {
            this.updateBar();
        }
    },

    whatToDoOnStop: function () {
        if (this.countDown.permanent) {
            this.countDown.onSecond = function () {};
        } else {
            this.countDown.remove();
        }
    },

    cleanup: function () {
        this._super();
        this.whatToDoOnStop();
    }
});

cleverapps.CountDown = function (timeLeft, options) {
    this.onSecond = function () {};
    options = options || {};
    this.onFinish = options.onFinish || function () {};
    this.onTick = options.onTick || function () {};

    this.permanent = options.permanent;
    this.ignorePaused = options.ignorePaused;

    if (timeLeft <= 0) {
        this.onFinish();
    } else {
        this.resetTimeLeft(timeLeft);
    }
};

cleverapps.CountDown.prototype.remove = function () {
    if (this.interval !== undefined) {
        cleverapps.CountDownManager.removeListener(this.interval);
    }
    this.interval = undefined;
    this.onFinish = function () {};
    this.onTick = function () {};
    this.onSecond = function () {};
};

cleverapps.CountDown.prototype.stop = function () {
    this.remove();
    this.timeStop = Date.now();
};

cleverapps.CountDown.prototype.isRunning = function () {
    return this.interval !== undefined;
};

cleverapps.CountDown.prototype.getTimeLeft = function () {
    if (!this.timeFinish) {
        return 0;
    }
    if (this.timeStop) {
        return this.timeFinish - this.timeStop;
    }
    return Math.max(this.timeFinish - Date.now(), 0);
};

cleverapps.CountDown.prototype.resetTimeLeft = function (timeLeft) {
    this.timeStart = Date.now();
    this.timeFinish = this.timeStart + timeLeft;

    if (this.interval === undefined) {
        this.interval = cleverapps.CountDownManager.addListener(this);
    }
};

cleverapps.CountDown.prototype.nextSecond = function (now) {
    var timeLeft = this.timeFinish - now;
    if (timeLeft < 0) {
        timeLeft = 0;
    }

    this.onTick(timeLeft);

    this.onSecond(timeLeft);

    if (timeLeft === 0) {
        cleverapps.CountDownManager.removeListener(this.interval);
        this.interval = undefined;
        this.onFinish();
    }
};

cleverapps.Interval = function (callback, interval, options) {
    options = options || {};
    options.onTick = cleverapps.accumulate(interval, callback);

    cleverapps.CountDown.call(this, cleverapps.parseInterval("120 months"), options);
};

cleverapps.Interval.prototype = Object.create(cleverapps.CountDown.prototype);
cleverapps.Interval.prototype.constructor = cleverapps.Interval;

cleverapps.LongTimeout = function (onFinish, timeLeft, options) {
    if (timeLeft <= cleverapps.LongTimeout.THRESHOLD) {
        if (timeLeft < 0) {
            timeLeft = 0;
        }
        this.timeout = setTimeout(onFinish, timeLeft);
        return;
    }

    options = options || {};
    options.onFinish = onFinish;
    cleverapps.CountDown.call(this, timeLeft, options);
};

cleverapps.LongTimeout.prototype = Object.create(cleverapps.CountDown.prototype);
cleverapps.LongTimeout.prototype.constructor = cleverapps.LongTimeout;

cleverapps.LongTimeout.prototype.remove = function () {
    if (this.timeout !== undefined) {
        clearTimeout(this.timeout);
    } else {
        cleverapps.CountDown.prototype.remove.apply(this, arguments);
    }
};

cleverapps.CountDownManager = {
    listeners: {},
    uid: 0,
    interval: false,
    paused: false,
    muted: false,

    onTick: function () {
        var now = Date.now();
        var paused = this.paused || this.muted;
        for (var i in this.listeners) {
            var listener = this.listeners[i];
            if (listener && (!paused || listener.ignorePaused)) {
                listener.nextSecond(now);
            }
        }
    },

    pause: function () {
        this.paused = true;
    },

    resume: function () {
        this.paused = false;
    },

    mute: function () {
        this.muted = true;
    },

    unmute: function () {
        this.muted = false;
    },

    addListener: function (listener) {
        var uid = this.uid;
        this.listeners[uid] = listener;

        this.uid++;
        if (this.interval === false) {
            this.interval = setInterval(this.onTick.bind(this), cleverapps.CountDown.INTERVAL);
            // cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, this.pause.bind(this));
            // cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, this.resume.bind(this));
        }

        return uid;
    },

    removeListener: function (uid) {
        delete this.listeners[uid];
    }
};

cleverapps.CountDown.INTERVAL = 1000;
cleverapps.LongTimeout.THRESHOLD = cleverapps.CountDown.INTERVAL;

cleverapps.CountDownView.BAR_ANIMATION_LIMIT = cleverapps.parseInterval("5 minutes");

cleverapps.styles.CountDownView = {
    textOffsetX: -2
};

var clearTimeoutSuper = clearTimeout;
var clearIntervalSuper = clearInterval;

// eslint-disable-next-line no-global-assign
clearTimeout = function (timeout) {
    if (timeout instanceof cleverapps.CountDown) {
        timeout.remove();
    } else {
        clearTimeoutSuper(timeout);
    }
};

// eslint-disable-next-line no-global-assign
clearInterval = function (interval) {
    if (interval instanceof cleverapps.CountDown) {
        interval.remove();
    } else {
        clearIntervalSuper(interval);
    }
};
