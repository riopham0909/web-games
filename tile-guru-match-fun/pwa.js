/**
 * Created by andrey on 26.06.2023
 */

var PWA = function (options) {
    Platform.call(this, options, "pwa");
};

PWA.prototype = Object.create(Platform.prototype);
PWA.prototype.constructor = PWA;

PWA.prototype.getLocalStoragePreffix = function () {
    return "_pwa";
};