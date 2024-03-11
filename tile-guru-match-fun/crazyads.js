/**
 * Created by Andrey Popov on 03.11.2023
 *
 * https://docs.crazygames.com/sdk/html5/video-ads/
 */

var CrazyAds = function () {
    AdsPlugin.call(this);
};

CrazyAds.prototype = Object.create(AdsPlugin.prototype);
CrazyAds.prototype.constructor = CrazyAds;

CrazyAds.isAppropriate = function () {
    return cleverapps.platform.oneOf(Crazy);
};

CrazyAds.prototype._connect = function (callback) {
    callback(Platform.STATUS_CONNECTED);
};

CrazyAds.prototype._playAd = function (name, ad, callback) {
    CrazyGames.SDK.ad.requestAd((name === "rewarded" ? name : "midgame"), {
        adStarted: function () {},
        adFinished: function () {
            callback(name === "rewarded" ? AdsPlugin.CODE_REWARD : undefined);
        },
        adError: function (error, errorData) {
            cleverapps.notification.create("NoAdsFound");
            console.log("CrazyGames showAd error: ", JSON.stringify(errorData));
            callback();
        }
    });
};

CrazyAds.prototype._cache = function (name, callback) {
    CrazyGames.SDK.ad.hasAdblock(function (error, result) {
        if (error || result) {
            console.log("CrazyGames hasAdblock");
            callback(AdsPlugin.CODE_FAILED);
        } else {
            callback(AdsPlugin.CODE_SUCCEED, true);
        }
    });
};