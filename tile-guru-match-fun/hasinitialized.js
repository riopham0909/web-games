/**
 * Created by andrey on 15.09.2023
 */

var HasInitialized = function () {
    this.onInitializedListeners = {};

    this.initialized = false;
};

HasInitialized.prototype.setInitialized = function (initialized) {
    this.initialized = initialized;

    if (!this.initialized) {
        return;
    }

    for (var key in this.onInitializedListeners) {
        var listener = this.onInitializedListeners[key];
        listener();
    }

    this.onInitializedListeners = {
    };
};

HasInitialized.prototype.isInitialized = function () {
    return this.initialized;
};

HasInitialized.prototype.whenInitialized = function (name, callback) {
    if (this.isInitialized()) {
        callback();
    } else {
        this.onInitializedListeners[name] = callback;
    }
};