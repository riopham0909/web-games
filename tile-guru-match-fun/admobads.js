/**
 * Created by andrey on 25.11.19.
 */

var AdMobAds = function () {
    AdsPlugin.call(this, {
        cantLoadAndPlayInParallel: true
    });

    this.code = "AdMobAds";

    this.onAdLoadedCallback = {};
    this.savedImpressionCost = undefined;
    this._playCallback = function () {};
};

AdMobAds.prototype = Object.create(AdsPlugin.prototype);
AdMobAds.prototype.constructor = AdMobAds;

AdMobAds.prototype._connect = function (callback) {
    console.log("AdMobAds.init");

    var adMob = AdMobAds.getConfig();

    if (cleverapps.config.debugMode) {
        adMob = { rewarded: "ca-app-pub-3940256099942544/5224354917" };
    }

    cleverapps.platform.callNative("AdMobPlugin.init", {
        adMob: adMob,
        isTest: Boolean(cleverapps.config.debugMode),
        testDevices: (AdMobAds.TEST_DEVICES[cleverapps.config.source] || []).join(",")
    }, function () {
        console.log("AdMobAds.onInit");
        cleverapps.platform.nativeEventListeners.AdMobAds = this.onNativeEvent.bind(this);
        callback(Platform.STATUS_CONNECTED);
    }.bind(this));
};

AdMobAds.prototype._cache = function (name, callback) {
    console.log("AdMobAds._cache");
    this.onAdLoadedCallback[name] = callback;

    cleverapps.platform.callNative("AdMobPlugin.cache", { name: name });
};

AdMobAds.prototype.onAdLoadResult = function (name, code) {
    console.log("AdMobAds.onAdLoaded");
    if (this.onAdLoadedCallback[name]) {
        this.onAdLoadedCallback[name](code, true);
        this.onAdLoadedCallback[name] = undefined;
    }
};

AdMobAds.prototype._playAd = function (name, ad, callback) {
    console.log("AdMobAds._playAd");
    this.success = false;
    this._playCallback = callback;

    cleverapps.platform.callNative("AdMobPlugin.show", { name: name });
};

AdMobAds.isAppropriate = function () {
    return cleverapps.platform.oneOf(Amazon, AndroidPlatform, IOS, IOSCh) && AdMobAds.getConfig();
};

AdMobAds.getConfig = function (source) {
    source = source || cleverapps.platform.source;

    if (cleverapps.config[source] && cleverapps.config[source].adMob) {
        return cleverapps.config[source].adMob;
    }

    if (source === "amazon") {
        return AdMobAds.getConfig("android");
    }
};

AdMobAds.prototype.getECPM = function () {
    return this.savedImpressionCost * 1000;
};

AdMobAds.prototype.onNativeEvent = function (event, options) {
    console.log("AdMobAds.onNativeEvent - " + event);

    switch (event) {
        case "onPaidEvent":
            this.savedImpressionCost = options.cost;
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.ADMOB_ADS, { value: this.savedImpressionCost });
            break;
        case "onAdOpened":
            break;
        case "onAdClosed":
            var code = options.name === RewardedAdsManager.REWARDED && this.success ? AdsPlugin.CODE_REWARD : undefined;
            this._playCallback(code);
            break;
        case "onAdLoaded":
            this.onAdLoadResult(options.name, AdsPlugin.CODE_SUCCEED);
            break;
        case "onAdFailedToLoad":
            this.onAdLoadResult(options.name, AdsPlugin.CODE_FAILED);
            break;
        case "onReward":
            this.success = true;
            break;
    }
};

AdMobAds.prototype.askPermission = function (callback) {
    cleverapps.platform.callNative("GDPRPlugin.askPermission", function (code) {
        console.log("GDPR setStatus " + code);
        callback();
    });
};

AdMobAds.TEST_DEVICES = {
    ios: [],
    android: [
        "80CEB8C9DEDE042AF04B1FBBBE040596",
        "kGADSimulatorID",
        "FE20924C46522E2E204587EB339897C6",
        "6D5FBD67BE15A16F114AA62F6BA3075E"
    ]
};
AdMobAds.TEST_DEVICES.amazon = AdMobAds.TEST_DEVICES.android;
