/**
 * Created by vladislav on 9/6/2022
 */

var Mobage = function (options) {
    Platform.call(this, options, "mbga");
};

Mobage.prototype = Object.create(Platform.prototype);
Mobage.prototype.constructor = Mobage;

Mobage.prototype.getLocalStoragePreffix = function () {
    return "_mbga";
};

Mobage.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_JAPANESE];
};

Mobage.prototype.isFullscreenAvailable = function () {
    return false;
};