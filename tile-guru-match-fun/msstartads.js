/**
 * https://assets.msn.com/staticsb/statics/latest/msstart-games-sdk/documentation/docs/in-game-rewarded-ads-apis/index.html
 * https://assets.msn.com/staticsb/statics/latest/msstart-games-sdk/documentation/docs/in-game-interstitial-ads-apis/index.html
 *
 * https://www.msn.com/en-us/play/games/testing/cg-test-game?dev-playground=https://mergecraft.labsystech.ru/publish/html5-staging/msstart&item=flights:prg-cg-in-gm-rwd-ads
 *
 * Created by Aleksandr on 16.06.2023
 */

var MSStartAds = function () {
    AdsPlugin.call(this, {
        cantLoadAndPlayInParallel: true
    });

    this.code = "MSStartAds";
};

MSStartAds.prototype = Object.create(AdsPlugin.prototype);
MSStartAds.prototype.constructor = MSStartAds;

MSStartAds.isAppropriate = function () {
    return cleverapps.platform.oneOf(MSStart);
};

MSStartAds.prototype._connect = function (callback) {
    cleverapps.timeouts.setTimeout(function () {
        callback(Platform.STATUS_CONNECTED);
    }, MSStartAds.LOAD_AFTER_INIT_TIME);
};

MSStartAds.prototype._cache = function (name, callback) {
    $msstart.loadAdsAsync(name === RewardedAdsManager.REWARDED).then(function (adInstance) {
        console.log("MSStart ads: have ads!", adInstance);
        callback(AdsPlugin.CODE_SUCCEED, adInstance);
    }).catch(function () {
        console.log("MSStart ads: NO ads!");
        callback(AdsPlugin.CODE_FAILED);
    });
};

MSStartAds.prototype._playAd = function (name, adInstance, callback) {
    $msstart.showAdsAsync(adInstance.instanceId).then(function (adInstance) {
        adInstance.showAdsCompletedAsync.then(function () {
            if (name === RewardedAdsManager.REWARDED) {
                callback(AdsPlugin.CODE_REWARD);
            } else {
                callback();
            }
        }).catch(function (error) {
            console.log("showAdsCompletedAsync", error);
            callback();
        });
    }).catch(function (error) {
        console.log("showAdsAsync error", error);
        callback();
    });
};

MSStartAds.prototype.getECPM = function () {
    return RewardedAdsManager.eCPM.MSStart;
};

MSStartAds.LOAD_AFTER_INIT_TIME = cleverapps.parseInterval("10 seconds");