/**
 * Created by andrey on 19.12.19.
 */

var NoPayments = function () {
    Payments.call(this);
};

NoPayments.prototype = Object.create(Payments.prototype);
NoPayments.prototype.constructor = NoPayments;

NoPayments.isAppropriate = function () {
    return cleverapps.platform.oneOf(Huzcom, Pliega, IOSCh, PWA, GPG, Ton, GDCom, Xiaomi)
        || cleverapps.platform.oneOf(AndroidPlatform) && !WebViewPayments.isAppropriate()
        || cleverapps.platform.oneOf(Mobage, SPMobage) && ["mbga.jp:63100202", "sb.mbga.jp:63100202"].includes(cleverapps.platform.getUserID());
};

NoPayments.prototype._connect = function (callback) {
    callback(Platform.STATUS_DISABLED);
};
