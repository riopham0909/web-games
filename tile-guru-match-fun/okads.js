/**
 * Created by mac on 4/8/18
 */

var OKAds = function () {
    AdsPlugin.call(this, {
        cantLoadAndPlayInParallel: true
    });

    this.loggedEvents = {};
};

OKAds.prototype = Object.create(AdsPlugin.prototype);
OKAds.prototype.constructor = OKAds;

OKAds.isAppropriate = function () {
    return cleverapps.platform.oneOf(MobileOK, OKPlatform);
};

OKAds.prototype._connect = function (callback) {
    cleverapps.whenAllInitialized(function () {
        if (typeof FAPI === "undefined" || !FAPI.UI.showAd || !FAPI.UI.showLoadedAd) {
            callback(Platform.STATUS_DISCONNECTED);

            return;
        }

        if (cleverapps.platform instanceof MobileOK && cleverapps.platform.info.isInApp) {
            var isNativeSupported = FAPI.UI.isNativeAdSupported && FAPI.UI.isNativeAdSupported();

            if (!isNativeSupported) {
                callback(Platform.STATUS_DISCONNECTED);

                return;
            }
        }

        callback(Platform.STATUS_CONNECTED);
    });
};

OKAds.prototype.windowApiLoadAdCallbackRewarded = function (result, data) {
    console.log("window.API_callback " + result + " " + JSON.stringify(data));
    data = data || "";

    if (result === "error") {
        this._cacheCallback(AdsPlugin.CODE_FAILED);
    } else if (["ad_prepared", "ready"].indexOf(data) !== -1) {
        this._cacheCallback(AdsPlugin.CODE_SUCCEED, true);
    }

    this.logResult(result, data);
};

OKAds.prototype.logResult = function (result, data) {
    var event = result + "_" + data;

    if (!this.loggedEvents[event]) {
        this.loggedEvents[event] = true;
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.OKADS.RESULT + event);
    }
};

OKAds.prototype._cache = function (name, callback) {
    if (RewardedAdsManager.REWARDED === name) {
        this._cacheCallback = cleverapps.once(callback);
        cleverapps.platform.listeners.loadAd = this.windowApiLoadAdCallbackRewarded.bind(this);
        FAPI.UI.loadAd();
    } else if (RewardedAdsManager.INTERSTITIAL === name) {
        callback(AdsPlugin.CODE_SUCCEED, true);
    }
};

OKAds.prototype.windowApiPlayAdCallbackRewarded = function (result, data) {
    console.log("window.API_callback " + result + " " + JSON.stringify(data));

    if (["ad_prepared", "ready"].indexOf(data) !== -1) {
        // re-subscribe
        cleverapps.platform.listeners.showAd = this.windowApiCallbackInterstitial.bind(this);
    } else if (result === "error") {
        if (data !== "skip") {
            cleverapps.notification.create("NoAdsFound");
        }
        this._playCallback();
    } else if (["ad_shown", "complete"].indexOf(data) !== -1) {
        this._playCallback(AdsPlugin.CODE_REWARD);
    } else {
        cleverapps.throwAsync({ group: "DebugMessage", message: cleverapps.EVENTS.STATS.OKADS.PLAY + "rewarded " + result + " data: " + data });
    }

    this.logResult(result, data);
};

OKAds.prototype.windowApiCallbackInterstitial = function (result, data) {
    console.log("window.API_callback " + result + " " + JSON.stringify(data));

    if (["ad_prepared", "ready"].indexOf(data) !== -1) {
        // re-subscribe
        cleverapps.platform.listeners.showAd = this.windowApiCallbackInterstitial.bind(this);
    } else if (result === "error" || ["no_ads", "skip", "ad_shown", "complete"].indexOf(data) !== -1) {
        this._playCallback();
    } else {
        cleverapps.throwAsync({ group: "DebugMessage", message: cleverapps.EVENTS.STATS.OKADS.PLAY + "interstitial " + result + " data: " + data });
    }

    this.logResult(result, data);
};

OKAds.prototype._playAd = function (name, ad, callback) {
    cleverapps.platform.exitFullscreen(function () {
        this._playCallback = cleverapps.once(callback);
        if (name === RewardedAdsManager.REWARDED) {
            cleverapps.platform.listeners.showLoadedAd = this.windowApiPlayAdCallbackRewarded.bind(this);
            FAPI.UI.showLoadedAd();
        } else if (name === RewardedAdsManager.INTERSTITIAL) {
            cleverapps.platform.listeners.showAd = this.windowApiCallbackInterstitial.bind(this);
            FAPI.UI.showAd();
            this._playCallback();
        }
    }.bind(this));
};

OKAds.prototype.getECPM = function () {
    return cleverapps.platform.oneOf(OKPlatform) ? RewardedAdsManager.eCPM.WEB_OK : RewardedAdsManager.eCPM.MOBILE_OK;
};
