/**
 * Created by vladislav on 11/09/23
 */

var Wechat = function (options) {
    Platform.call(this, options, "wechat");

    this.orientation = wx.getSystemInfoSync().deviceOrientation;
};

Wechat.prototype = Object.create(Platform.prototype);
Wechat.prototype.constructor = Wechat;

Wechat.prototype._initialize = function (callback) {
    this.dataLoader.localStorage = new BucketsLocalStorage(this.localStorage);

    callback();
};

Wechat.prototype._connect = function (callback) {
    wx.onDeviceOrientationChange(function (orientation) {
        this.orientation = orientation.value;
    }.bind(this));

    wx.onError(function (res) {
        res.message && window.onerror(res.message);
    });

    callback(Platform.STATUS_CONNECTED);
};

Wechat.prototype.getLocalStoragePreffix = function () {
    return "_wechat";
};

Wechat.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_CHINESE];
};

Wechat.prototype.getOrientation = function () {
    return this.orientation;
};

Wechat.prototype.isAudioContextRunning = function () {
    return true;
};
