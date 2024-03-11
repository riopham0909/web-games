/**
 * Created by Aleksandr on 06.10.2022.
 */

var PlingaAds = function () {
    AdsPlugin.call(this);
};

PlingaAds.prototype = Object.create(AdsPlugin.prototype);
PlingaAds.prototype.constructor = PlingaAds;

PlingaAds.isAppropriate = function () {
    return cleverapps.platform instanceof Plinga;
};

PlingaAds.prototype._connect = function (callback) {
    cleverapps.whenAllInitialized(function () {
        if (typeof plingaRpc !== "undefined" && plingaRpc.requestRewardedAdvertisement !== "undefined" && plingaRpc.requestAdvertisement !== "undefined") {
            console.log("PlingaAds inited");

            callback(Platform.STATUS_CONNECTED);
        } else {
            callback(Platform.STATUS_DISCONNECTED);
        }
    });
};

PlingaAds.prototype._playAd = function (name, ad, callback) {
    this._playCallback = cleverapps.once(callback);
    try {
        console.log("PlingaAds playAd:", name);
        if (name === "rewarded") {
            plingaRpc.requestRewardedAdvertisement(function () {
                this._playCallback(AdsPlugin.CODE_REWARD);
            }.bind(this), function () {
                cleverapps.notification.create("NoAdsFound");
                this._playCallback();
            }.bind(this));
        } else {
            plingaRpc.requestAdvertisement(function () {
                this._playCallback();
            }.bind(this), function () {
                cleverapps.notification.create("NoAdsFound");
                this._playCallback();
            }.bind(this));
        }
    } catch (e) {
        console.log("Plinga showAd error:", e);
    }
};

PlingaAds.prototype.getECPM = function () {
    return RewardedAdsManager.eCPM.Plinga;
};
