/**
 * Created by vladislav on 9/6/2022
 */

var Microsoft = function (options) {
    Platform.call(this, options, "microsoft");

    this.info.os = PlatformInfo.OS_WINDOWS;
};

Microsoft.prototype = Object.create(Platform.prototype);
Microsoft.prototype.constructor = Microsoft;

Microsoft.prototype.getDeviceId = function () {
    return this.deviceId;
};

Microsoft.prototype._connect = function (callback) {
    this.callNative("social.getDeviceId", undefined, function (code, response) {
        this.deviceId = response && response.deviceId;
        callback(Platform.STATUS_CONNECTED);
    }.bind(this));
};

Microsoft.prototype.getAccessToken = function () {
    return "microsoft";
};

Microsoft.prototype.canReview = function () {
    return true;
};

Microsoft.prototype._requestReview = function () {
    this.callNative("store.review", undefined, function (code, response) {
        var result = !response || response.error ? "failure" : "ok";
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.NATIVE_REVIEW + result);
    });
};

Microsoft.prototype.calcChannel = function (callback) {
    this.callNative("social.getCampaignId", undefined, function (code, response) {
        if (response && response.campaignId) {
            callback(response.campaignId);
        } else {
            callback();
        }
    });
};

Microsoft.prototype.needWindowForLogin = function () {
    return true;
};

Microsoft.prototype.isFullscreenAvailable = function () {
    return true;
};

Microsoft.prototype.toggleFullScreen = function () {
    this.callNative("app.toggleFullScreen");
};

Microsoft.prototype._callNative = function (method, options) {
    var data = Object.assign({
        method: method
    }, options || {});

    window.chrome.webview.postMessage(JSON.stringify(data));
};
