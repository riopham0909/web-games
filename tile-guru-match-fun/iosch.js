/**
 * Created by vladislav on 9/6/2022
 */

var IOSCh = function (options) {
    Platform.call(this, options, "ios_ch");
};

IOSCh.prototype = Object.create(Platform.prototype);
IOSCh.prototype.constructor = IOSCh;

IOSCh.prototype.getLocalStoragePreffix = function () {
    return "_nosocial";
};