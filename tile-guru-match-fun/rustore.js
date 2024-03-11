/**
 * Created by vladislav on 9/6/2022
 */

var Rustore = function (options) {
    AndroidBase.call(this, options, "rustore");
};

Rustore.prototype = Object.create(AndroidBase.prototype);
Rustore.prototype.constructor = Rustore;

Rustore.prototype.getLocalStoragePreffix = function () {
    return "_nosocial";
};

Rustore.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_RUSSIAN];
};