/**
 * https://developers.weixin.qq.com/minigame/en/dev/guide/open-ability/ad/ad.html
 *
 * Created by andrey on 23.10.2023
 */

var WechatAds = function () {
    AdsPlugin.call(this);

    this._loadCallback = function () {};
    this._playCallback = function () {};
};

WechatAds.prototype = Object.create(AdsPlugin.prototype);
WechatAds.prototype.constructor = WechatAds;

WechatAds.prototype._connect = function (callback) {
    var adUnit = cleverapps.config.wechat.rewarded;

    // if (cleverapps.config.debugMode) {
    // adUnit = "adunit-58126ee79da15477"; // {errMsg: "operateWXDataForAd:fail invalid scope", err_code: -12001}
    // adUnit = "xxxx";
    // }

    console.log("wechatads init - " + adUnit);

    this.rewarded = wx.createRewardedVideoAd({ adUnitId: adUnit });
    this.rewarded.onLoad(this.onLoad.bind(this));
    this.rewarded.onError(this.onError.bind(this));
    this.rewarded.onClose(this.onClose.bind(this));

    callback(Platform.STATUS_CONNECTED);
};

WechatAds.prototype._cache = function (name, callback) {
    if (name !== RewardedAdsManager.REWARDED) {
        console.log("wechatads only rewarded");
        callback(AdsPlugin.CODE_FAILED);
        return;
    }

    this._loadCallback = cleverapps.once(callback);

    this.rewarded.load()
        .then(this.onLoad.bind(this))
        .catch(this.onError.bind(this));
};

WechatAds.prototype._playAd = function (name, rewarded, callback) {
    this._playCallback = cleverapps.once(callback);

    rewarded.show().catch(this.onError.bind(this));
};

WechatAds.prototype.onLoad = function () {
    console.log("wechatads loaded");
    this._loadCallback(AdsPlugin.CODE_SUCCEED, this.rewarded);
};

WechatAds.prototype.onError = function (err) {
    var isPlaying = this.whichIsPlaying();

    if (isPlaying) {
        console.log("wechatads show error", err);
        this._playCallback();
    } else {
        console.log("wechatads load fail", err);
        this._loadCallback(AdsPlugin.CODE_FAILED);
    }
};

WechatAds.prototype.onClose = function (res) {
    if (res && res.isEnded) {
        console.log("wechatads shown");
        this._playCallback(AdsPlugin.CODE_REWARD);
    } else {
        console.log("wechatads cancelled");
        this._playCallback();
    }
};

WechatAds.prototype.getECPM = function () {
    return RewardedAdsManager.eCPM.Wechat;
};

WechatAds.isAppropriate = function () {
    return cleverapps.platform.oneOf(Wechat) && cleverapps.config.wechat.rewarded;
};