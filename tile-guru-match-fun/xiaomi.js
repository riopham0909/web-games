/**
 * Created by Denis Kuzin on 18 april 2023
 */

var Xiaomi = function (options) {
    Platform.call(this, options, "xiaomi");

    this.info.isInApp = true;
    this.info.isMobile = true;
};

Xiaomi.prototype = Object.create(Platform.prototype);
Xiaomi.prototype.constructor = Xiaomi;

Xiaomi.prototype._showBannerAd = function (callback) {
    cleverapps.rewardedAdsManager.showBanner(callback);
};

Xiaomi.prototype._hideBannerAd = function (callback) {
    cleverapps.rewardedAdsManager.hideBanner(callback);
};