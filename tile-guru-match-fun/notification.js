/**
 * Created by slava on 3/31/17.
 */

cleverapps.Notification = function () {
    this.queue = [];
    this.current = undefined;

    this.onRemove = function () {};
    this.onUpdateProgress = function () {};
};

cleverapps.Notification.prototype.create = function (msg, options) {
    options = options || {};

    if (!options.debugInfo && (!this.canShow() || !msg)) {
        return;
    }

    if (this.current && msg === this.current.msg) {
        if (options.progress) {
            this.onUpdateProgress(
                options.progress.newAmount ? options.progress.newAmount : options.progress.amount,
                options.progress.total
            );
        }
        return;
    }

    var findedInQueue = false;
    this.queue.forEach(function (current) {
        if (current.msg === msg) {
            if (options.progress && current.options.progress) {
                if (options.progress.newAmount) {
                    current.options.progress.newAmount = options.progress.newAmount;
                } else {
                    current.options.progress = options.progress;
                }
            }
            findedInQueue = true;
        }
    });
    if (findedInQueue) {
        return;
    }

    this.queue.push({
        msg: msg,
        options: options
    });
    if (this.queue.length > cleverapps.Notification.MAX_QUEUE) {
        this.queue.shift();
    }

    if (!options.defer) {
        this.processQueue();
    }
};

cleverapps.Notification.prototype.processQueue = function () {
    if (this.current || !this.queue.length) {
        return;
    }

    var parent = cleverapps.scenes.getRunningScene();
    if (!parent) {
        return;
    }

    var data = this.queue.shift();

    this.current = {
        msg: data.msg
    };

    var notificationView = new NotificationView(this, data.msg, data.options);
    parent.addChild(notificationView);
};

cleverapps.Notification.prototype.reset = function () {
    this.onRemove();
    this.current = undefined;
};

cleverapps.Notification.prototype.clear = function () {
    this.reset();
    this.queue = [];
};

cleverapps.Notification.prototype.canShow = function () {
    if (cleverapps.gameModes.noNotifications) {
        return false;
    }
    return cleverapps.allInitialized && !cleverapps.environment.isLoaderScene() && cleverapps.config.source !== "playable";
};

cleverapps.Notification.MAX_QUEUE = 3;
