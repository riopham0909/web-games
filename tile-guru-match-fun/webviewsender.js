/**
 * Created by andrey on 11.01.18.
 */

var WebViewSender = function () {};

WebViewSender.prototype.sendPush = function (info, timeout) {
    var data = cleverapps.LocalPushes.GetPushData(info);

    var id = info.id;
    var code = info.code;

    var title = data.title;
    var message = data.text;

    if (!message || !title) {
        cleverapps.throwAsync("empty push - " + id
                + "\ninfo: " + JSON.stringify(info) + "\ndata: " + JSON.stringify(data)
                + "\nMessages length: " + Messages && Messages.dictionary && Object.keys(Messages.dictionary).length);
        return;
    }

    cleverapps.platform.callNative("LocalPushesPlugin.sendPush", {
        id: id,
        title: title,
        message: message,
        timeout: timeout,
        code: code
    });
};

WebViewSender.prototype.cancelPush = function (info) {
    cleverapps.platform.callNative(
        "LocalPushesPlugin.cancelPush",
        { id: info.id, code: info.code }
    );
};

WebViewSender.prototype.askPermissions = function (callback) {
    cleverapps.platform.callNative(
        "LocalPushesPlugin.askPermissions",
        function (code, response) {
            if (cleverapps.CODE_SUCCEED === code) {
                cleverapps.localPushes.setPermitted(Boolean(response && response.permitted));
            }

            callback();
        }
    );
};

WebViewSender.isAppropriate = function () {
    return cleverapps.platform.oneOf(Amazon, AndroidPlatform, Pliega, Rustore, Apple);
};