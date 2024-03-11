/**
 * Created by vladislav on 9/6/2022
 */

var Playable = function (options) {
    Platform.call(this, options, "playable");
};

Playable.prototype = Object.create(Platform.prototype);
Playable.prototype.constructor = Playable;

Playable.prototype.getLocalStoragePreffix = function () {
    return "_nosocial";
};