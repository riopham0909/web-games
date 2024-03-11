/**
 * Created by andrey on 11.01.18.
 */

var FakeSender = function () {};

FakeSender.prototype.sendPush = function (info, timeout) {
    if (!cleverapps.config.debugMode) {
        return;
    }

    var data = cleverapps.LocalPushes.GetPushData(info);

    var id = info.id;

    if (!data.text || !data.title) {
        cleverapps.throwAsync("empty fake push - " + id);
        return;
    }

    if (!cleverapps.config.wysiwygMode) {
        cleverapps.notification.create(data.text + " [" + cleverapps.intervalToString(timeout) + "]", { noSound: true });
    }
    console.log("FakeSender: scheduled: " + data.text, cleverapps.intervalToString(timeout));
};

FakeSender.prototype.cancelPush = function (info) {
    if (!cleverapps.config.debugMode) {
        return;
    }

    var data = cleverapps.LocalPushes.GetPushData(info);
    if (!cleverapps.config.wysiwygMode) {
        // cleverapps.notification.create("Removed: " + data.text);
    }
    console.log("FakeSender: removed: " + data.text, info);
};

FakeSender.isAppropriate = function () {
    return cleverapps.config.debugMode;
};