/**
 * Created by mac on 4/8/18
 */

var VKAds = function () {
    AdsPlugin.call(this);
};

VKAds.prototype = Object.create(AdsPlugin.prototype);
VKAds.prototype.constructor = VKAds;

VKAds.isAppropriate = function () {
    return cleverapps.platform instanceof VKPlatform;
};

VKAds.prototype._cache = function (name, callback) {
    vkBridge.send("VKWebAppCheckNativeAds", {
        "ad_format": name === RewardedAdsManager.REWARDED ? "reward" : "interstitial"
    }).then(function (data) {
        if (data.result) {
            console.log("VKWebAppCheckNativeAds: have ads!", name);
            callback(AdsPlugin.CODE_SUCCEED, true);
        } else {
            console.log("VKWebAppCheckNativeAds: no ads!", name, data);
            callback(AdsPlugin.CODE_FAILED);
        }
    }).catch(function (error) {
        console.log("VKWebAppCheckNativeAds: error", name, error);
        callback(AdsPlugin.CODE_FAILED);
    });
};

VKAds.prototype._playAd = function (name, ad, callback) {
    vkBridge.send("VKWebAppShowNativeAds", {
        ad_format: name === RewardedAdsManager.REWARDED ? "reward" : "interstitial"
    }).then(function (data) {
        if (data.result) {
            console.log("VKWebAppShowNativeAds: shown", name);
            callback(name === RewardedAdsManager.REWARDED ? AdsPlugin.CODE_REWARD : undefined);
        } else {
            console.log("VKWebAppShowNativeAds: canceled", name, data);
            callback();
        }
    }).catch(function (error) {
        console.log("VKWebAppShowNativeAds: error", name, error);
        callback();
    });
};

VKAds.prototype.getECPM = function () {
    return RewardedAdsManager.eCPM.VK;
};
