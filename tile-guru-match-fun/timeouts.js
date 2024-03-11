/**
 * Created by andrey on 20.12.2022
 */

var Timeouts = function () {
    if (engine === "cocos2d") {
        this.__instanceId = classManager.getNewInstanceId();
    } else {
        cc.director.getScheduler().enableForTarget(this);
    }

    this.time = 0;
    this.uid = 1;
    this.listeners = Object.create(null);

    cc.director.getScheduler().scheduleUpdate(this, cc.Scheduler.PRIORITY_SYSTEM, false);
};

Timeouts.prototype.getTime = function () {
    return this.time;
};

Timeouts.prototype.update = function (dt) {
    dt *= 1000;

    if (dt < 0) {
        dt = 0;
    }

    this.time += dt;

    for (var uid in this.listeners) {
        var listener = this.listeners[uid];
        if (!listener) {
            cleverapps.throwAsync("empty listener for timeout " + uid);
            delete this.listeners[uid];
            continue;
        }

        if (listener.timeLeft <= 0) {
            if (listener.interval === undefined) {
                delete this.listeners[uid];
            } else {
                listener.timeLeft = listener.interval;
            }

            listener.callback();
        }

        listener.timeLeft -= dt;
    }
};

Timeouts.prototype.setTimeout = function (callback, ms, options) {
    var timeout = {
        uid: this.uid,
        callback: callback,
        timeLeft: ms || 0
    };

    if (options && options.interval) {
        timeout.interval = ms || 0;
    }

    this.listeners[this.uid] = timeout;
    this.uid += 1;
    return timeout;
};

Timeouts.prototype.setInterval = function (callback, ms) {
    return this.setTimeout(callback, ms, { interval: true });
};

Timeouts.prototype.clearTimeout = function (timeout) {
    if (timeout && timeout.uid) {
        delete this.listeners[timeout.uid];
    }
};

Timeouts.prototype.clearInterval = function (interval) {
    this.clearTimeout(interval);
};
