/**
 * Created by andrey on 29.10.19.
 */

var ExecutorPool = function(options) {
    options = options || {};

    this.amount = options.amount || 1000;
    this.interval = options.interval || '1 second';
    this.events = new cleverapps.EventsQueue(this.interval);
    this.delay = cleverapps.parseInterval(options.delay || '0 second');

    this.tasks = [];
    this.timeout = undefined;
};

ExecutorPool.prototype.execute = function(callback) {
    this.tasks.push({
        callback: callback,
        event: Date.now()
    });

    this.processFirst();
};

ExecutorPool.prototype.processFirst = function() {
    if (this.timeout !== undefined) {
        clearTimeout(this.timeout);
        delete this.timeout;
    }

    if (this.tasks.length === 0) {
        return;
    }

    var first = this.tasks[0];
    var now = Date.now();
    if (first.event + 100 < now && now < first.event + this.delay) {
        this.timeout = setTimeout(this.processFirst.bind(this), now - first - this.delay);
        return;
    }

    if (this.events.size() >= this.amount) {
        var leftTime = this.events.getShrinkLeftTime();
        if (leftTime && leftTime > 0 && this.events.size() >= this.amount) {
            this.timeout = setTimeout(this.processFirst.bind(this), leftTime);
            return;
        }
    }

    this.tasks.shift();
    var res = first.callback();
    if (res !== cleverapps.NO_ACTION) {
        this.events.add(now);
    }
    this.processFirst();
};
