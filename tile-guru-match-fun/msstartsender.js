/**
 * Created by Aleksandr on 16.06.2023
 */

var MSStartSender = function () {};

MSStartSender.prototype.sendPush = function (info, timeout) {
    if (!cleverapps.platform.isConnected(Platform.PLATFORM)) {
        return;
    }

    if (timeout > cleverapps.parseInterval("7 days")) {
        return;
    }

    var data = cleverapps.LocalPushes.GetPushData(info);

    var gameId = cleverapps.config.debugMode && cleverapps.config.msstart && cleverapps.config.msstart.appId || undefined;
    var title = data.title;
    var message = data.text;
    var id = this.getId(info);
    var image = undefined;
    var payload = JSON.stringify({ push_code: info.id });
    var callToAction = undefined;

    if (!message) {
        cleverapps.throwAsync("empty msstart push - " + info.code);
        return;
    }

    console.log("Sending push - " + id, {
        gameId: gameId,
        title: title,
        message: message,
        id: id,
        image: image,
        payload: payload,
        timeout: Math.round(timeout / 1000),
        callToAction: callToAction
    });

    $msstart.scheduleNotificationAsync({
        gameId: gameId,
        title: title,
        description: message,
        type: id,
        image: image,
        payload: payload,
        minDelayInSeconds: Math.round(timeout / 1000),
        callToAction: callToAction
    }).then(function (response) {
        console.log("MSStartSender - " + response);
    }).catch(function (error) {
        console.log("MSStartSender error - " + JSON.stringify(error));
    });
};

MSStartSender.prototype.cancelPush = function () {};

MSStartSender.prototype.getId = function (info) {
    return info && info.id % 16;
};

MSStartSender.isAppropriate = function () {
    return cleverapps.platform.oneOf(MSStart);
};