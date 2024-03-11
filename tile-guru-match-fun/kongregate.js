/**
 * Created by Aleksandr on 01.02.2023
 */

var Kongregate = function (options) {
    Platform.call(this, options, "kongregate");
};

Kongregate.prototype = Object.create(Platform.prototype);
Kongregate.prototype.constructor = Kongregate;

Kongregate.prototype._connect = function (callback) {
    console.log("Kongregate init");
    var onFailure = function () {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.KONGREGATE_INIT_ERROR);

        callback(Platform.STATUS_DISCONNECTED);
    };

    var onAPILoad = function () {
        window.kongregate = kongregateAPI.getAPI();

        callback(Platform.STATUS_CONNECTED);
    };

    cleverapps.loadSdk("https://cdn1.kongregate.com/javascripts/kongregate_api.js", {
        onFailure: onFailure,
        onSuccess: function () {
            kongregateAPI.loadAPI(onAPILoad);
        },
        crossorigin: false
    });
};

Kongregate.prototype.getLocalStoragePreffix = function () {
    return "_kongregate";
};

Kongregate.prototype.isFullscreenAvailable = function () {
    return false;
};
