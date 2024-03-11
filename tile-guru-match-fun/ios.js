/**
 * Created by vladislav on 9/6/2022
 */

var IOS = function (options) {
    Apple.call(this, options, "ios");
};

IOS.prototype = Object.create(Apple.prototype);
IOS.prototype.constructor = IOS;