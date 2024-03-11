/**
 * Created by iamso on 07.10.2021
 */

var MicrosoftSender = function () {};

MicrosoftSender.prototype.sendPush = function (info, timeout) {
    var data = cleverapps.LocalPushes.GetPushData(info);

    var title = data.title;
    var message = data.text;

    var id = info.id;

    if (!message) {
        cleverapps.throwAsync("empty microsoft push - " + info.code);
        return;
    }

    cleverapps.platform.callNative("localPushes.send", {
        title: title,
        message: message,
        timeout: timeout,
        id: "" + id
    });
};

MicrosoftSender.prototype.cancelPush = function (info) {
    console.log("Cancel push - " + info.code);

    cleverapps.platform.callNative("localPushes.cancel", {
        id: "" + info.id
    });
};

MicrosoftSender.isAppropriate = function () {
    return cleverapps.platform.oneOf(Microsoft);
};