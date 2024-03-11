/**
 * Created by vladislav on 9/6/2022
 */

var Huzcom = function (options) {
    Platform.call(this, options, "huzcom");
};

Huzcom.prototype = Object.create(Platform.prototype);
Huzcom.prototype.constructor = Huzcom;

Huzcom.prototype.getLocalStoragePreffix = function () {
    return "_nosocial";
};