/**
 * Created by vladislav on 1/26/2024
 */

var OKLogic = function () {
    PlatformLogic.call(this);

    cleverapps.platform.on("changeStatus:" + Platform.PLATFORM, function (status) {
        if (status === Platform.STATUS_CONNECTED) {
            this.logPushes();
        }
    }.bind(this));
};

OKLogic.prototype = Object.create(PlatformLogic.prototype);
OKLogic.prototype.constructor = OKLogic;

OKLogic.prototype.logPushes = function () {
    var rParams = FAPI.Util.getRequestParameters();

    var pushCode = cleverapps.getRequestParameters("?" + rParams.custom_args).push_code;
    var pushId = rParams.custom_args;

    var localPush = pushCode ? cleverapps.LocalPushes.GetTypeByCode(pushCode)
        : cleverapps.LocalPushes.GetTypeById(pushId);

    if (localPush) {
        var event = pushCode && cleverapps.EVENTS.STATS.PUSHES.CLICK_ANDROID;
        cleverapps.localPushes.logClickEvent(localPush.code, event);

        if (!pushCode && pushId && cleverapps.platform.oneOf(MobileOK)) {
            cleverapps.eventLogger.logEvent(cleverapps.platform.info.os === PlatformInfo.OS_ANDROID
                ? cleverapps.EVENTS.STATS.PUSHES.ANDROID_OK_CLICK : cleverapps.EVENTS.STATS.PUSHES.MOBILE_OK_CLICK);
        }
    }
};