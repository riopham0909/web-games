/**
 * Created by vladislav on 9/6/2022
 */

var CleverApps = function (options) {
    Platform.call(this, options, "cleverapps");
};

CleverApps.prototype = Object.create(Platform.prototype);
CleverApps.prototype.constructor = CleverApps;

CleverApps.prototype._showBannerAd = function (callback) {
    cleverapps.rewardedAdsManager.showBanner(callback);
};

CleverApps.prototype._hideBannerAd = function (callback) {
    cleverapps.rewardedAdsManager.hideBanner(callback);
};

CleverApps.prototype.getLocalStoragePreffix = function () {
    return "_cleverapps";
};

CleverApps.prototype.needWindowForLogin = function () {
    return true;
};

CleverApps.prototype.loadOldUserId = function (callback) {
    try {
        var oldUser = cleverapps.DataLoader.localStorage.getItem(cleverapps.config.name + "_xsolla");
        callback(oldUser && JSON.parse(oldUser).id);
    } catch (e) {
        console.log("parse old user error - " + oldUser, e);
    }
};