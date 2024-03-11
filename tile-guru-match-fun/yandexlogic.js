/**
 * Created by vladislav on 1/26/2024
 */

var YandexLogic = function () {
    PlatformLogic.call(this);

    cleverapps.platform.on("changeStatus:" + Platform.PLATFORM, function (status) {
        if (status === Platform.STATUS_CONNECTED) {
            this.logPushes();
        }
    }.bind(this));
};

YandexLogic.prototype = Object.create(PlatformLogic.prototype);
YandexLogic.prototype.constructor = YandexLogic;

YandexLogic.prototype.logPushes = function () {
    if (cleverapps.platform.player.getMode() === "lite") {
        return;
    }

    var payload = cleverapps.platform.ysdk.environment.payload && JSON.parse(cleverapps.platform.ysdk.environment.payload);
    console.log(payload);
    if (payload && payload.push_code) {
        cleverapps.localPushes.logClickEvent(payload.push_code);
    }
};