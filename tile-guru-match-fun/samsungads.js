/**
 * Created by anatoly on 04/12/2023
 */

var SamsungAds = function () {
    console.log("Choose SamsungAds");
    AdsPlugin.call(this);
};

SamsungAds.prototype = Object.create(AdsPlugin.prototype);
SamsungAds.prototype.constructor = SamsungAds;

SamsungAds.prototype._connect = function (callback) {
    var samsung = SamsungAds.ids;

    GSInstant.advertisement2.initAd({
        samsungInterstitialAdPlacementId: samsung.interstitial,
        samsungRewardedAdPlacementId: samsung.rewarded,
        admobInterstitialAdUnitId: samsung.adMob && samsung.adMob.interstitial,
        admobRewardedAdUnitId: samsung.adMob && samsung.adMob.rewarded,
        gameTitle: cleverapps.config.title
    });

    ["AD_LOADED", "AD_LOAD_ERROR", "AD_SKIP", "AD_CLOSE", "AD_VIDEO_ERROR", "AD_SHOW_ERROR", "AD_COMPLETE"].forEach(function (eventName) {
        GSInstant.advertisement2.addEventListener(eventName, function () {
            this.onEvent(eventName);
        }.bind(this));
    }.bind(this));

    callback(Platform.STATUS_CONNECTED);
};

SamsungAds.prototype._cache = function (name, callback) {
    this.loadAdCallback = callback;
    GSInstant.advertisement2.loadAd({
        adFormat: SamsungAds.adFormats[name]
    });
};

SamsungAds.prototype.onEvent = function (event) {
    var isPlaying = this.whichIsPlaying();

    switch (event) {
        case "AD_LOADED":
            this.loadAdCallback(AdsPlugin.CODE_SUCCEED, true);
            break;
        case "AD_LOAD_ERROR":
            this.loadAdCallback(AdsPlugin.CODE_FAILED);
            break;
        case "AD_SKIP":
        case "AD_CLOSE":
        case "AD_VIDEO_ERROR":
        case "AD_SHOW_ERROR":
            this.playAdCallback();
            break;
        case "AD_COMPLETE":
            if (isPlaying === RewardedAdsManager.REWARDED) {
                this.playAdCallback(AdsPlugin.CODE_REWARD);
            } else {
                this.playAdCallback();
            }
            break;
    }
};

SamsungAds.prototype._playAd = function (name, ad, callback) {
    this.playAdCallback = callback;

    GSInstant.advertisement2.showAd({
        adFormat: SamsungAds.adFormats[name]
    });
};

SamsungAds.isAppropriate = function () {
    return cleverapps.platform.oneOf(Samsung);
};

SamsungAds.adFormats = {};
SamsungAds.adFormats[RewardedAdsManager.REWARDED] = "REWARD";
SamsungAds.adFormats[RewardedAdsManager.INTERSTITIAL] = "INTERSTITIAL";

SamsungAds.ids = {
    interstitial: "fd210d27178e4542a4fe2972f899903c",
    rewarded: "0d370a9a087049a7ab82879b21b69a57",
    adMob: {
        interstitial: "ca-app-pub-3940256099942544/1033173712",
        rewarded: "ca-app-pub-3940256099942544/5354046379"
    }
};