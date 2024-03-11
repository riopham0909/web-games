/**
 * Created by andrey on 30.10.2020.
 */

var AdsPlugin = function (options) {
    Connectable.call(this);

    this.cached = {};
    this.cachedTime = {};
    this.cachedErrorTime = {};

    this.cantLoadAndPlayInParallel = options && options.cantLoadAndPlayInParallel;

    this.loaderState = {};
    this.videoState = {};

    this.finishTime = {};

    this.onChangeLoaderState = function () {};
    this.onChangeVideoState = function () {};
};

AdsPlugin.prototype = Object.create(Connectable.prototype);
AdsPlugin.prototype.constructor = AdsPlugin;

AdsPlugin.prototype.setWaitLoading = function (name) {
    this.loaderState[name] = AdsPlugin.LOADER_STATE.WAIT;
    this.onChangeLoaderState(name);
};

AdsPlugin.prototype.setSuccessLoading = function (name) {
    this.loaderState[name] = AdsPlugin.LOADER_STATE.READY;
    this.onChangeLoaderState(name);
};

AdsPlugin.prototype.setLoading = function (name) {
    this.loaderState[name] = AdsPlugin.LOADER_STATE.LOADING;
    this.onChangeLoaderState(name);
};

AdsPlugin.prototype.setPlaying = function (name, silent) {
    this.videoState[name] = AdsPlugin.VIDEO_STATE.PLAY;
    if (!silent) {
        this.onChangeVideoState(name);
    }
};

AdsPlugin.prototype.whichIsPlaying = function () {
    for (var i = 0; i < RewardedAdsManager.ACTIVE_ADS.length; i++) {
        var name = RewardedAdsManager.ACTIVE_ADS[i];
        if (this.videoState[name] === AdsPlugin.VIDEO_STATE.PLAY) {
            return name;
        }
    }

    return undefined;
};

AdsPlugin.prototype.rewardAndFinish = function (silent) {
    this.setFinished(RewardedAdsManager.REWARDED, silent);
    cleverapps.rewardedAdsManager.onReward();
};

AdsPlugin.prototype.setFinished = function (name, silent) { 
    if (this.videoState[name] !== AdsPlugin.VIDEO_STATE.STOP) {
        this.videoState[name] = AdsPlugin.VIDEO_STATE.STOP;
        this.finishTime[name] = Date.now();

        if (!silent) {
            this.onChangeVideoState(name);
        }
    }
};

AdsPlugin.LOADER_STATE = {
    WAIT: 0,
    LOADING: 1,
    READY: 2
};

AdsPlugin.VIDEO_STATE = {
    STOP: 0,
    PLAY: 1
};

AdsPlugin.EXPIRATION_TIME = cleverapps.parseInterval("55 minutes");
AdsPlugin.LOAD_AFTER_PLAY_TIME = cleverapps.parseInterval("15 seconds");
AdsPlugin.LOAD_AFTER_ERROR_TIME = cleverapps.parseInterval("2 minutes");

AdsPlugin.prototype._connect = function (callback) {
    setTimeout(function () {
        callback(Platform.STATUS_CONNECTED);
    }, 2000);
};

AdsPlugin.prototype.expired = function (name) {
    return this.cachedTime[name] !== undefined && this.cachedTime[name] < Date.now() - AdsPlugin.EXPIRATION_TIME;
};

AdsPlugin.prototype.isAvailable = function (name) {
    return cleverapps.platform.isConnected(Platform.ADS) && this.cached[name];
};

AdsPlugin.prototype._cache = function (name, callback) {
    callback(AdsPlugin.CODE_SUCCEED, true);
};

AdsPlugin.prototype.adIsRunning = function (name) {
    return this.videoState[name] === AdsPlugin.VIDEO_STATE.PLAY;
};

AdsPlugin.prototype.askPermission = function (callback) {
    callback();
};

AdsPlugin.CODE_SUCCEED = 0;
AdsPlugin.CODE_FAILED = 1;
AdsPlugin.CODE_REWARD = 2;

AdsPlugin.prototype.canCache = function (name) {
    var finishTime = this.finishTime[name] || 0;
    var cachedErrorTime = this.cachedErrorTime[name] || 0;

    if (this.cantLoadAndPlayInParallel && (this.adIsRunning(name) || finishTime + AdsPlugin.LOAD_AFTER_PLAY_TIME > Date.now())) {
        return false;
    }

    if (cachedErrorTime + AdsPlugin.LOAD_AFTER_ERROR_TIME > Date.now()) {
        return false;
    }

    return cleverapps.platform.isConnected(Platform.ADS) && [AdsPlugin.LOADER_STATE.LOADING, AdsPlugin.LOADER_STATE.READY].indexOf(this.loaderState[name]) === -1;
};

AdsPlugin.prototype.cache = function (name) {
    if (!this.canCache(name)) {
        return;
    }

    this.setLoading(name);

    this._cache(name, function (code, loadedAd) {
        if (code === AdsPlugin.CODE_SUCCEED) {
            this.cached[name] = loadedAd;
            this.cachedTime[name] = Date.now();
            this.setSuccessLoading(name);
        } else {
            this.cachedErrorTime[name] = Date.now();
            this.setWaitLoading(name);
        }
    }.bind(this));
};

AdsPlugin.prototype._playAd = function (name, ad, callback) {
    callback(AdsPlugin.CODE_REWARD);
};

AdsPlugin.prototype.reset = function (name) {
    this.cached[name] = undefined;
    this.cachedTime[name] = undefined;
    this.cachedErrorTime[name] = undefined;

    this.setWaitLoading(name);
};

AdsPlugin.prototype.playAd = function (name) {
    if (!cleverapps.platform.isConnected(Platform.ADS) || !this.cached[name] || this.adIsRunning(name)) {
        this._onCancel();

        return;
    }

    this.setPlaying(name);

    this._playAd(name, this.cached[name], cleverapps.once(function (code) {
        this.setFinished(name);

        if (code === AdsPlugin.CODE_REWARD) {
            cleverapps.rewardedAdsManager.onReward();
        } else {
            this._onCancel();
        }
    }.bind(this)));

    this.reset(name);
};

AdsPlugin.prototype.getECPM = function () {
    return undefined;
};

AdsPlugin.prototype.isFakeImpression = function () {
};
