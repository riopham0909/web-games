/**
 * Created by vladislav on 9/6/2022
 */

var Pliega = function (options) {
    AndroidBase.call(this, options, "pliega");
};

Pliega.prototype = Object.create(AndroidBase.prototype);
Pliega.prototype.constructor = Pliega;

Pliega.prototype.getLocalStoragePreffix = function () {
    return "_nosocial";
};