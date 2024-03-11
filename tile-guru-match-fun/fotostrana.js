/**
 * Created by vladislav on 9/6/2022
 */

var FotoStrana = function (options) {
    Platform.call(this, options, "fotostrana");

    cleverapps.SETUP_RESOLUTION_MIN_FRAME_SIZE = cleverapps.SETUP_RESOLUTION_MIN_FRAME_SIZE_FS;
};

FotoStrana.prototype = Object.create(Platform.prototype);
FotoStrana.prototype.constructor = FotoStrana;

FotoStrana.prototype._connect = function (callback) {
    var onFailure = function (reason) {
        callback(Platform.STATUS_DISCONNECTED);

        if (reason === "timeout") {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FAKEFB_BY_TIMEOUT);
        } else {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FAKEFB_BY_SCRIPT_ERROR);
        }
    };

    var onSuccess = function () {
        // eslint-disable-next-line new-cap
        window.FSClient = new fsapi(cleverapps.config.fotostrana.appId, cleverapps.config.fotostrana.privateKey);
        FSClient.init(function () {
            console.log("API Error!");
        });
        callback(Platform.STATUS_CONNECTED);
    };

    cleverapps.loadSdk(cleverapps.getRequestParameters().fsapi, { onSuccess: onSuccess, onFailure: onFailure, crossorigin: false });
};

FotoStrana.prototype.getLocalStoragePreffix = function () {
    return "_FS";
};

FotoStrana.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_RUSSIAN];
};