/**
 * Created by andrey on 28.12.2023
 */

var AppLovinAds = function () {
    AdsPlugin.call(this, {
        cantLoadAndPlayInParallel: true
    });

    this.code = "AppLovinAds";

    this.onAdLoadedCallback = {};
    this.savedImpressionCost = undefined;
    this._playCallback = function () {};
};

AppLovinAds.prototype = Object.create(AdsPlugin.prototype);
AppLovinAds.prototype.constructor = AppLovinAds;

AppLovinAds.prototype._connect = function (callback) {
    console.log("AppLovinAds.init");

    var config = AppLovinAds.getConfig();

    cleverapps.platform.callNative("AppLovinPlugin.init", config, function () {
        console.log("AppLovinPlugin.onInit");
        cleverapps.platform.nativeEventListeners.AppLovinPlugin = this.onNativeEvent.bind(this);
        callback(Platform.STATUS_CONNECTED);
    }.bind(this));
};

AppLovinAds.prototype._cache = function (name, callback) {
    console.log("AppLovinAds._cache");
    this.onAdLoadedCallback[name] = callback;

    cleverapps.platform.callNative("AppLovinPlugin.cache", { name: name });
};

AppLovinAds.prototype.onAdLoadResult = function (name, code) {
    console.log("AppLovinAds.onAdLoaded");
    if (this.onAdLoadedCallback[name]) {
        this.onAdLoadedCallback[name](code, true);
        this.onAdLoadedCallback[name] = undefined;
    }
};

AppLovinAds.prototype._playAd = function (name, ad, callback) {
    console.log("AppLovinAds._playAd");
    this.success = false;
    this._playCallback = callback;

    cleverapps.platform.callNative("AppLovinPlugin.show", { name: name });
};

AppLovinAds.isAppropriate = function () {
    var config = AdMobAds.getConfig();
    return cleverapps.platform.oneOf(AndroidPlatform) && config && config.rewarded
        && (cleverapps.ABTest.APP_LOVIN() || ["fairy"].includes(cleverapps.config.name));
};

AppLovinAds.getConfig = function (source) {
    source = source || cleverapps.platform.source;

    return cleverapps.config[source] && cleverapps.config[source].appLovin;
};

AppLovinAds.prototype.getECPM = function () {
    return this.savedImpressionCost * 1000;
};

AppLovinAds.prototype.onNativeEvent = function (event, options) {
    console.log("AppLovinAds.onNativeEvent - " + event);

    switch (event) {
        case "onAdRevenuePaid":
            this.savedImpressionCost = options.cost || (cleverapps.config.debugMode ? 0.000001 : 0);
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.APP_LOVIN_ADS, { value: this.savedImpressionCost });
            break;
        case "onAdDisplayed":
            break;
        case "onAdDisplayFailed":
        case "onAdHidden":
            var code = options.name === RewardedAdsManager.REWARDED && this.success ? AdsPlugin.CODE_REWARD : undefined;
            this._playCallback(code);
            break;
        case "onAdLoaded":
            this.onAdLoadResult(options.name, AdsPlugin.CODE_SUCCEED);
            break;
        case "onAdLoadFailed":
            this.onAdLoadResult(options.name, AdsPlugin.CODE_FAILED);
            break;
        case "onUserRewarded":
            this.success = true;
            break;
    }
};

AppLovinAds.prototype.askPermission = function (callback) {
    var business = cleverapps.config.android.business || cleverapps.config.business;
    var domain = business === "slimmerbits" ? "slimmerbits.com" : "cleverappssg.com";
    var data = {
        privacy: "https://" + domain + "/legal/privacy.html",
        terms: "https://" + domain + "/legal/terms.html"
    };
    cleverapps.platform.callNative("AppLovinPlugin.askPermission", data, callback);
};
