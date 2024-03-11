/**
 * Created by vladislav on 1/26/2024
 */

var MSStartLogic = function () {
    PlatformLogic.call(this);

    cleverapps.platform.on("changeStatus:" + Platform.PLATFORM, function (status) {
        if (status === Platform.STATUS_CONNECTED) {
            this.logPushes();
        }
    }.bind(this));
};

MSStartLogic.prototype = Object.create(PlatformLogic.prototype);
MSStartLogic.prototype.constructor = MSStartLogic;

MSStartLogic.prototype.logPushes = function () {
    var params = cleverapps.getRequestParameters();
    var pushCode = params && params.notificationPayload && JSON.parse(params.notificationPayload).push_code;

    var localPush = pushCode && cleverapps.LocalPushes.GetTypeByCode(pushCode);

    if (localPush) {
        cleverapps.localPushes.logClickEvent(localPush.code);
    }
};