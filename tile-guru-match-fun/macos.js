/**
 * Created by vladislav on 9/6/2022
 */

var MacOS = function (options) {
    Apple.call(this, options, "macos");
};

MacOS.prototype = Object.create(Apple.prototype);
MacOS.prototype.constructor = MacOS;