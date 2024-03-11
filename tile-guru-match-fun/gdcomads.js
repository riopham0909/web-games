/**
 * Created by andrey on 19.12.19.
 */

var GDComAds = function () {
    this.fakeImpression = true;

    AdsPlugin.call(this);
};

GDComAds.prototype = Object.create(AdsPlugin.prototype);
GDComAds.prototype.constructor = GDComAds;

GDComAds.isAppropriate = function () {
    return cleverapps.platform instanceof GDCom;
};

GDComAds.prototype._connect = function (callback) {
    cleverapps.whenAllInitialized(function () {
        if (typeof gdsdk !== "undefined" && gdsdk.preloadAd !== "undefined" && gdsdk.showAd !== "undefined") {
            console.log("gdcom social inited - cache ads");

            cleverapps.platform.adsEventListener = this.onEvent.bind(this);
            callback(Platform.STATUS_CONNECTED);
        } else {
            callback(Platform.STATUS_DISCONNECTED);
        }
    }.bind(this));
};

GDComAds.prototype.onEvent = function (event) {
    var isPlaying = this.whichIsPlaying();
    if (isPlaying === undefined) {
        return;
    }

    if (event.name === "LOG" && event.message && event.message.adError) {
        cleverapps.notification.create("NoAdsFound");
        return;
    }

    switch (event.name) {
        case "AD_ERROR":
            this._playCallbackErrorDelayed && this._playCallbackErrorDelayed();
            break;
        case "IMPRESSION":
        case "SDK_GAME_PAUSE":
            this.started = true;
            break;
        case "STARTED":
        case "FIRST_QUARTILE":
        case "MIDPOINT":
        case "THIRD_QUARTILE":
            this.fakeImpression = false;
            this.started = true;
            break;
        case "USER_CLOSE":
        case "SKIPPED":
            this._playCallback();
            break;
        case "ALL_ADS_COMPLETED":
        case "COMPLETE":
            if (isPlaying === RewardedAdsManager.REWARDED) {
                this._playCallbackDelayed();
            } else {
                this._playCallback();
            }
            break;
        case "SDK_REWARDED_WATCH_COMPLETE": // can appear after COMPLETE
            this._playCallback(AdsPlugin.CODE_REWARD);
            break;
    }

    if (event.name) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.GDCOM.ADS_EVENT + event.name.toLowerCase());
    }
};

GDComAds.prototype._cache = function (name, callback) {
    try {
        gdsdk.preloadAd(name).then(function (response) {
            console.log("GDCom ads: have ads!", name, response);
            callback(AdsPlugin.CODE_SUCCEED, true);
        }).catch(function (error) {
            console.log("GDCom ads: NO ads!", error);
            callback(AdsPlugin.CODE_FAILED);
        });
    } catch (e) {
        console.log("Error gdsdk.preloadAd", e);
        callback(AdsPlugin.CODE_FAILED);
    }
};

GDComAds.prototype._playAd = function (name, ad, callback) {
    this._playCallback = cleverapps.once(callback);
    this._playCallbackDelayed = cleverapps.once(cleverapps.accumulate(3000, this._playCallback));

    var playCallback = this._playCallback;
    this._playCallbackErrorDelayed = cleverapps.postpone(5000, function () {
        if (!this.started) {
            playCallback();
        }
    }.bind(this));

    this.started = false;
    this.fakeImpression = true;

    try {
        gdsdk.showAd(name)
            .then(function () {})
            .catch(function (error) {
                this._playCallback();
                console.log("GDCom showAd error:", error);
            }.bind(this));
    } catch (e) {
        console.log("GDCom showAd error:", e);
    }
};

GDComAds.prototype.isFakeImpression = function () {
    return this.fakeImpression;
};

GDComAds.prototype.getECPM = function () {
    return RewardedAdsManager.eCPM.GDCom;
};
