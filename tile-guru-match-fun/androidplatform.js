/**
 * Created by vladislav on 9/6/2022
 */

var AndroidPlatform = function (options) {
    AndroidBase.call(this, options, "android");
};

AndroidPlatform.prototype = Object.create(AndroidBase.prototype);
AndroidPlatform.prototype.constructor = AndroidPlatform;

AndroidPlatform.prototype.canReview = function () {
    return true;
};

AndroidPlatform.prototype._requestReview = function () {
    this.callNative("ReviewPlugin.requestReview", function (code) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.NATIVE_REVIEW + (code === cleverapps.CODE_SUCCEED ? "ok" : "failure"));
    });
};