/**
 * Created by andrey on 17.05.2023
 */

var YandexAppAds = function () {
    AdsPlugin.call(this, {
        cantLoadAndPlayInParallel: true
    });

    this.code = "YandexAppAds";

    this._playCallback = function () {};
};

YandexAppAds.prototype = Object.create(AdsPlugin.prototype);
YandexAppAds.prototype.constructor = YandexAppAds;

YandexAppAds.prototype._connect = function (callback) {
    console.log("YandexAppAds.init");

    var adUnitId = cleverapps.config.android.yandexAds.rewarded;
    if (cleverapps.config.debugMode) {
        adUnitId = YandexAppAds.YANDEX_AD_UNIT_ID;
    }
    cleverapps.platform.callNative("YandexAdsPlugin.init", { adUnitId: adUnitId }, function () {
        console.log("YandexAppAds.onInit");
        cleverapps.platform.nativeEventListeners.YandexAppAds = this.onNativeEvent.bind(this);
        callback(Platform.STATUS_CONNECTED);
    }.bind(this));
};

YandexAppAds.prototype.onNativeEvent = function (name) {
    switch (name) {
        case "onAdLoaded":
            this.onAdLoaded();
            break;
        case "onAdFailedToLoad":
            this.onAdFailedToLoad();
            break;
        case "onAdFailedToShow":
            console.log("YandexAppAds.onAdFailedToShow");
            this._playCallback();
            break;
        case "onReward":
            this.success = true;
            break;
        case "onAdClosed":
            console.log("YandexAppAds.onAdClosed");
            this._playCallback(this.success ? AdsPlugin.CODE_REWARD : undefined);

            if (this.success) {
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.YANDEX_APP_ADS, { value: this.getECPM() / 1000 });
            }
            break;
        case "onAdOpened":
            break;
    }
};

YandexAppAds.prototype._cache = function (name, callback) {
    if (name !== RewardedAdsManager.REWARDED) {
        callback(AdsPlugin.CODE_FAILED);
        return;
    }

    console.log("YandexAppAds._cache");
    this._cacheCallback = callback;
    cleverapps.platform.callNative("YandexAdsPlugin.cache", { name: name });
};

YandexAppAds.prototype.onAdLoaded = function () {
    console.log("YandexAppAds.onAdLoaded");
    if (this._cacheCallback) {
        this._cacheCallback(AdsPlugin.CODE_SUCCEED, true);
        this._cacheCallback = undefined;
    }
};

YandexAppAds.prototype.onAdFailedToLoad = function () {
    console.log("YandexAppAds.onAdFailedToLoad");
    if (this._cacheCallback) {
        this._cacheCallback(AdsPlugin.CODE_FAILED);
        this._cacheCallback = undefined;
    }
};

YandexAppAds.prototype._playAd = function (name, ad, callback) {
    console.log("YandexAppAds._playAd");
    this.success = false;
    this._playCallback = callback;
    cleverapps.platform.callNative("YandexAdsPlugin.show", { name: name });
};

YandexAppAds.isAppropriate = function () {
    return (cleverapps.platform.oneOf(AndroidPlatform) && cleverapps.paymentsCountry.isRussia() || cleverapps.platform.oneOf(Rustore))
        && cleverapps.config.android.yandexAds && cleverapps.config.android.yandexAds.rewarded;
};

YandexAppAds.prototype.getECPM = function () {
    return RewardedAdsManager.eCPM.YandexApp;
};

YandexAppAds.YANDEX_AD_UNIT_ID = "demo-rewarded-yandex";
YandexAppAds.MINTEGRAL_AD_UNIT_ID = "demo-rewarded-mintegral";
YandexAppAds.MYTARGET_AD_UNIT_ID = "demo-rewarded-mytarget";