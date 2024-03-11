/**
 * Created by mac on 5/2/20
 */

var ActionPlayer = function (options) {
    options = options || {};
    this.options = options;

    if (Array.isArray(options)) {
        options = { actions: options };
    } else if (typeof options === "function") {
        options = { actions: [options] };
    }

    this.actions = [];
    this.add(options.actions || []);
};

ActionPlayer.prototype.add = function (actions) {
    if (Array.isArray(actions)) {
        actions.forEach(function (action) {
            this.add(action);
        }.bind(this));
    } else if (actions) {
        this.actions.push(actions);
    }
};

ActionPlayer.prototype._playNext = function () {
    if (this.actionTimeout) {
        cleverapps.timeouts.clearTimeout(this.actionTimeout);
        this.actionTimeout = undefined;
    }

    if (this._stopped) {
        return;
    }

    if (this.index === this.actions.length) {
        this._stopped = true;

        if (this.onCompleteListener) {
            this.onCompleteListener.call(null);
        }

        if (this.onSuccessListener) {
            this.onSuccessListener.call(null);
        }

        return;
    }

    var active = true;

    var resolve = function () {
        if (active) {
            active = false;
            this._playNext.apply(this, arguments);
        }
    }.bind(this);

    var reject = function () {
        if (active) {
            active = false;
            this.stop.apply(this, arguments);
        }
    }.bind(this);

    if (this.options.actionTimeout) {
        this.actionTimeout = cleverapps.timeouts.setTimeout(reject, this.options.actionTimeout);
    }

    this.actions[this.index++](resolve, reject);
};

ActionPlayer.prototype.onSuccess = function (callback) {
    this.onSuccessListener = callback;
};

ActionPlayer.prototype.onFailure = function (callback) {
    this.onFailureListener = callback;
};

ActionPlayer.prototype.onComplete = function (callback) {
    this.onCompleteListener = callback;
};

ActionPlayer.prototype.play = function (callback) {
    this.index = 0;
    if (callback) {
        this.onSuccess(callback);
    }
    this._playNext();
};

ActionPlayer.prototype.stop = function () {
    if (!this._stopped) {
        this._stopped = true;

        if (this.onCompleteListener) {
            this.onCompleteListener.call(null);
        }

        if (this.onFailureListener) {
            this.onFailureListener.apply(null, arguments);
        }
    }
};

ActionPlayer.prototype.isStopped = function () {
    return this._stopped;
};

ActionPlayer.prototype.isRunning = function () {
    return !this.isStopped();
};
