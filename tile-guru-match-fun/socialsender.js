/**
 * Created by andrey on 15.01.18.
 */

var SocialSender = function () {
    this.batch = {};

    this.sendBatch = cleverapps.accumulate(
        cleverapps.parseInterval("10 seconds"),
        this._sendBatch.bind(this)
    );
};

SocialSender.prototype._sendBatch = function () {
    var path = cleverapps.RestClient.getBase() + "/" + cleverapps.config.name + "-push/sendBatch";
    // path = "http://localhost/mergecraft-push/sendBatch";
    // path = "http://localhost:5006/sendBatch";
    var batch = this.batch;

    var data = {
        userId: cleverapps.LocalPushes.GetPushUserId(cleverapps.platform.getUserID(), cleverapps.platform.source),
        language: cleverapps.settings.language,
        batch: batch
    };

    this.batch = {};

    console.log("Sending batch - ", batch);
    cleverapps.RestClient.post(path, data, function () {
        console.log("Success push", batch);
    }, function () {
        console.log("Failure push", batch);
    }, {
        fullPath: true
    });
};

SocialSender.prototype.sendPush = function (info, timeout) {
    if (cleverapps.platform.haveTmpId()) {
        return;
    }

    if (cleverapps.platform.oneOf(Yandex)
            && cleverapps.YandexPushesMap[cleverapps.config.name][info.code.toUpperCase()] === undefined) {
        return;
    }

    this.batch[info.id] = Math.floor(timeout / 1000);

    this.sendBatch();
},

SocialSender.prototype.cancelPush = function (info) {
    if (cleverapps.platform.haveTmpId()) {
        return;
    }

    this.batch[info.id] = 0;

    this.sendBatch();
};

SocialSender.isAppropriate = function () {
    if (cleverapps.platform.oneOf(Yandex)) {
        return cleverapps.YandexPushesMap[cleverapps.config.name];
    }

    return cleverapps.platform.oneOf(
        OKPlatform, 
        MobileOK, 
        FacebookCanvas,
        Instant, 
        Kongregate, 
        Mobage, 
        MyMailRu, 
        MobileMyMailRu, 
        VKPlatform, 
        MobileVk
    );
};