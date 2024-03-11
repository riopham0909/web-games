/**
 * Created by mac on 4/8/18
 */

var InstantAds = function () {
    console.log("Choose InstantAds");
    AdsPlugin.call(this, {
        cantLoadAndPlayInParallel: true
    });

    this.adInstances = {};
};

InstantAds.prototype = Object.create(AdsPlugin.prototype);
InstantAds.prototype.constructor = InstantAds;

InstantAds.prototype._connect = function (callback) {
    cleverapps.whenAllInitialized(function () {
        var apis = FBInstant.getSupportedAPIs();
        if (apis.indexOf("getRewardedVideoAsync") === -1) {
            console.log("FBInstant getRewardedVideoAsync is not supported!");
            callback(Platform.STATUS_DISCONNECTED);
        } else {
            console.log("Found support for FBInstant getRewardedVideoAsync");
            callback(Platform.STATUS_CONNECTED);
        }
    });
};

InstantAds.prototype._cache = function (name, callback) {
    var LoadMethod = FBInstant.getRewardedVideoAsync;
    var api = "getRewardedVideoAsync";

    if (name === RewardedAdsManager.INTERSTITIAL) {
        LoadMethod = FBInstant.getInterstitialAdAsync;
        api = "getInterstitialAdAsync";
    }

    console.log("Searching " + api);
    if (FBInstant.getSupportedAPIs().indexOf(api) === -1) {
        console.log("No support for " + api + ", skip");
        callback(AdsPlugin.CODE_FAILED);
        return;
    }

    var loadAsync = function (loadingAd) {
        loadingAd.loadAsync().then(function () {
            console.log("Loaded instant ad video: " + name);
            this.loadErrorCode = undefined;
            delete this.adInstances[name];
            callback(AdsPlugin.CODE_SUCCEED, loadingAd);
        }.bind(this)).catch(function (e) {
            console.log("Instant ads: NO ads!", e.message, e.code);
            callback(AdsPlugin.CODE_FAILED);

            if (e.code !== "ADS_NO_FILL") {
                cleverapps.playSession.set(cleverapps.EVENTS.STATS.REWARDED_ERROR_DAU, true);
            }

            switch (e.code) {
                case "INVALID_OPERATION":
                case "ADS_FREQUENT_LOAD":
                case "ADS_TOO_MANY_INSTANCES":
                case "ADS_NO_FILL":
                case "NETWORK_FAILURE":
                case "UNKNOWN":
                case "CLIENT_UNSUPPORTED_OPERATION":
                case "INVALID_PARAM":
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.ADS_LOAD + e.code);
                    this.loadErrorCode = e.code;
                    break;
                default:
                    cleverapps.throwAsync(cleverapps.EVENTS.STATS.INSTANT.ADS_LOAD + e.code + " message: " + e.message);
            }
        }.bind(this));
    }.bind(this);

    if (this.adInstances[name]) {
        console.log("Exists instant ad config: " + name);
        loadAsync(this.adInstances[name]);
    } else {
        LoadMethod.call(FBInstant, Instant.FULL_AD_ID(cleverapps.config.instant[name])).then(function (adInstance) {
            console.log("Loaded instant ad config: " + name);
            this.adInstances[name] = adInstance;
            loadAsync(adInstance, callback);
        }.bind(this));
    }
};

InstantAds.prototype.playAd = function () {
    if (cleverapps.pendingRequests) {
        this._onCancel();

        return;
    }

    AdsPlugin.prototype.playAd.apply(this, arguments);
};

InstantAds.prototype._playAd = function (name, ad, callback) {
    cleverapps.countPendingRequests(ad.showAsync()).then(function () {
        if (name === RewardedAdsManager.REWARDED) {
            callback(AdsPlugin.CODE_REWARD);
        } else {
            callback();
        }
    }).catch(function (e) {
        console.error(e.message);
        callback();

        if (e.code !== "USER_INPUT") {
            cleverapps.playSession.set(cleverapps.EVENTS.STATS.REWARDED_ERROR_DAU, true);
        }
        var debugMessage = cleverapps.EVENTS.STATS.INSTANT.ADS_PLAY + e.code + " message: " + e.message;

        switch (e.code) {
            case "PENDING_REQUEST":
                cleverapps.throwAsync(debugMessage);
            // eslint-disable-next-line no-fallthrough
            case "ADS_NOT_LOADED":
            case "INVALID_PARAM":
            case "NETWORK_FAILURE":
            case "INVALID_OPERATION":
            case "RATE_LIMITED":
            case "USER_INPUT":
            case "PAYMENTS_NOT_INITIALIZED": // wierd huh? but occurs in jserror.log
            case "ADS_EXPIRED":
            case "UNKNOWN":
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.ADS_PLAY + e.code);
                break;
            default:
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.ADS_PLAY + "OTHER");
                cleverapps.cleverapps.throwAsync(debugMessage);
        }
    });
};

InstantAds.prototype.getECPM = function () {
    return RewardedAdsManager.eCPM.Instant;
};

InstantAds.isAppropriate = function () {
    return cleverapps.platform.oneOf(Instant);
};
