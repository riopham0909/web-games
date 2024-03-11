/**
 * Created by andrey on 29.10.19.
 */

var SuccessWait = function (names) {
    names = names.filter(function (name) {
        return name && bundles[name];
    });

    this.bundles = names;

    this.active = true;
    this.loaded = false;

    this.listeners = [];

    this.run();
};

SuccessWait.prototype.isActive = function () {
    return this.active;
};

SuccessWait.prototype.isLoaded = function () {
    return this.loaded;
};

SuccessWait.prototype.whenLoaded = function (callback) {
    if (!callback) {
        return;
    }

    if (this.active) {
        this.listeners.push(callback);
    } else {
        callback();
    }
};

SuccessWait.prototype.run = function () {
    if (!this.bundles.length) {
        this.onSuccess();
        return;
    }

    cleverapps.bundleLoader.loadBundles(this.bundles, {
        onSuccess: this.onSuccess.bind(this),
        onFailure: this.onFailure.bind(this)
    });
};

SuccessWait.prototype.onSuccess = function () {
    if (this.active) {
        this.loaded = true;
        this.clear();

        this.listeners.forEach(cleverapps.callFunc);
        this.listeners = [];
    } else {
        cleverapps.bundleLoader.deleteBundles(this.bundles);
        this.bundles = [];
    }
};

SuccessWait.prototype.onFailure = function (error) {
    if (!this.active) {
        return;
    }

    if (cleverapps.checkStatus(error, 404)) {
        console.log("receive 404");
        this.clear();
        return;
    }

    clearTimeout(this.retryTimeout);
    this.retryTimeout = setTimeout(this.run.bind(this), SuccessWait.RETRY_TIMEOUT);
};

SuccessWait.prototype.clear = function () {
    this.active = false;
    
    clearTimeout(this.retryTimeout);
    this.retryTimeout = undefined;
};

SuccessWait.prototype.destructor = function () {
    this.clear();

    this.listeners = [];

    if (this.loaded) {
        this.loaded = false;
        cleverapps.bundleLoader.deleteBundles(this.bundles);
        this.bundles = [];
    }
};

SuccessWait.RETRY_TIMEOUT = cleverapps.parseInterval("30 seconds");
