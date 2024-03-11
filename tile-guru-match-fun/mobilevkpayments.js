/**
 * Created by slava on 4/21/17.
 */

var MobileVkPayments = function () {
    VKPayments.call(this);
};

MobileVkPayments.prototype = Object.create(VKPayments.prototype);
MobileVkPayments.prototype.constructor = MobileVkPayments;

MobileVkPayments.prototype._connect = function (callback) {
    callback(cleverapps.MobileVkSocial.getPlatfrom() === "html5_ios" ? Platform.STATUS_DISABLED : Platform.STATUS_CONNECTED);
};

MobileVkPayments.isAppropriate = function () {
    return cleverapps.platform instanceof MobileVk;
};
