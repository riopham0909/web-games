/**
 * Created by mac on 7/22/17.
 */

var Counter = function () {
    this.value = 0;

    this.onceZero = undefined;
    this.afterRunStages = undefined;
    this.stages = [];

    this.off = false;

    this.onStageActivatedListener = function () {};
};

// not registered same stage twice
Counter.prototype.registerStage = function (priority, handler) {
    for (var i = 0; i < this.stages.length; i++) {
        if (this.stages[i].handler === handler) {
            return;
        }
    }

    if (cleverapps.config.debugMode) {
        if (this.stages.filter(function (stage) {
            return stage.priority === priority;
        }).length > 0) {
            alert("Multiple stages with same priority: " + priority);
        }
    }

    this.stages.push({
        priority: priority,
        handler: handler
    });

    this.stages.sort(function (a, b) {
        return a.priority - b.priority;
    });
};

Counter.prototype.runStages = function () {
    if (this.value !== 0 || this.off) {
        return;
    }

    for (var i = 0; i < this.stages.length; i++) {
        this.stages[i].handler();

        if (this.isActive()) {
            this.onStageActivatedListener();
            return;
        }
    }
};

Counter.prototype.turnOff = function () {
    this.off = true;
};

Counter.prototype.turnOn = function () {
    this.off = false;
};

Counter.prototype.isActive = function () {
    return this.value > 0;
};

Counter.prototype.trigger = function (delay) {
    if (this.off) {
        return;
    }

    if (delay) {
        cleverapps.timeouts.setTimeout(this.trigger.bind(this), delay);
    } else {
        this.runStages();
    }
};

Counter.prototype.inc = function () {
    this.value++;
};

Counter.prototype.dec = function () {
    this.value--;

    if (this.value === 0 && !this.off) {
        if (this.onceZero) {
            var f = this.onceZero;
            this.onceZero = undefined;
            f();
        }
        if (this.value === 0 && !this.off) {
            this.runStages();
        }
        if (this.afterRunStages) {
            this.afterRunStages();
            this.afterRunStages = undefined;
        }
    }
};

Counter.prototype.setTimeout = function (callback, timeout) {
    this.inc();

    return cleverapps.timeouts.setTimeout(function () {
        if (this.off) {
            return;
        }

        callback();

        this.dec();
    }.bind(this), timeout);
};

Counter.prototype.clearStages = function () {
    this.stages = [];
};