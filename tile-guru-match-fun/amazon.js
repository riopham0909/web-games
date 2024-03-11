/**
 * Created by vladislav on 9/6/2022
 */

var Amazon = function (options) {
    AndroidBase.call(this, options, "amazon");
};

Amazon.prototype = Object.create(AndroidBase.prototype);
Amazon.prototype.constructor = Amazon;
