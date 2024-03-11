/**
 * https://sdk.html5gameportal.com/wortal-html5/#ads
 *
 * Created by anatoly on 03/09/2023
 */

var WortalAds = function () {
    console.log("Choose WortalAds");
    AdsPlugin.call(this);
};

WortalAds.prototype = Object.create(AdsPlugin.prototype);
WortalAds.prototype.constructor = WortalAds;

WortalAds.isAppropriate = function () {
    return cleverapps.platform.oneOf(WortalPlatform);
};

WortalAds.prototype._connect = function (callback) {
    callback(Platform.STATUS_CONNECTED);
};

WortalAds.prototype._playAd = function (name, ad, callback) {
    var noFill = function () {
        cleverapps.notification.create("NoAdsFound");
        callback();
    };

    var beforeAd = function () {};
    var afterAd = function () {};
    var adDismissed = function () {
        callback();
    };
    var adViewed = function () {
        callback(AdsPlugin.CODE_REWARD);
    };

    if (name === RewardedAdsManager.REWARDED) {
        Wortal.ads.showRewarded(
            cleverapps.rewardedAdsManager.lastAdStarter,
            beforeAd,
            afterAd,
            adDismissed,
            adViewed,
            noFill
        );
    } else {
        Wortal.ads.showInterstitial(
            "interstitial",
            "ShowInterstitial",
            beforeAd,
            afterAd,
            noFill
        );
    }
};

WortalAds.prototype._cache = function (name, callback) {
    if (Wortal.ads.isAdBlocked()) {
        console.log("AdBlockError");
        callback(AdsPlugin.CODE_FAILED);
        return;
    }

    callback(AdsPlugin.CODE_SUCCEED, 1);
};