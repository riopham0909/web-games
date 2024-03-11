/**
 * Created by vladislav on 9/6/2022
 */

var Draugiem = function (options) {
    Platform.call(this, options, "draugiem");
};

Draugiem.prototype = Object.create(Platform.prototype);
Draugiem.prototype.constructor = Draugiem;

Draugiem.prototype._connect = function (callback) {
    var onSuccess = function () {
        callback(Platform.STATUS_CONNECTED);
    };

    var onFailure = function () {
        console.log("Failed to load draugiem.js api");

        callback(Platform.STATUS_DISCONNECTED);
    };

    cleverapps.loadSdk("//draugiem.lv/applications/external/draugiem.js", { onSuccess: onSuccess, onFailure: onFailure, crossorigin: false });
};

Draugiem.prototype.getLocalStoragePreffix = function () {
    return "_draugiem";
};

Draugiem.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_LATVIAN, PlatformInfo.LANGUAGE_RUSSIAN];
};