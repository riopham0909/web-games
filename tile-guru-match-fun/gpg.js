/**
 * Created by vladislav on 9/6/2022
 */

var GPG = function (options) {
    AndroidBase.call(this, options, "gpg");
};

GPG.prototype = Object.create(AndroidBase.prototype);
GPG.prototype.constructor = GPG;