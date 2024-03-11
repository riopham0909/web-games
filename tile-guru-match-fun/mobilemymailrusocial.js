/**
 * Created by slava on 4/21/17.
 */

cleverapps.MobileMyMailRuSocial = function () {
    console.log("Choosing mobile-MyMailRu");

    cleverapps.MyMailRuSocial.call(this);
};

cleverapps.MobileMyMailRuSocial.prototype = Object.create(cleverapps.MyMailRuSocial.prototype);
cleverapps.MobileMyMailRuSocial.prototype.constructor = cleverapps.MobileMyMailRuSocial;

cleverapps.MobileMyMailRuSocial.prototype._connect = function (callback) {
    callback(Platform.STATUS_CONNECTED);
};

cleverapps.MobileMyMailRuSocial.prototype._inviteFriends = function (options, callback) {
    cleverapps.notification.create("mobileNotAvailable");
    callback(cleverapps.CODE_CANCELLED);
};

cleverapps.MobileMyMailRuSocial.prototype._request = function (options, callback) {
    cleverapps.notification.create("mobileNotAvailable");
    callback(cleverapps.CODE_CANCELLED);
};

cleverapps.MobileMyMailRuSocial.prototype._shareDialog = function (data, callback) {
    cleverapps.notification.create("mobileNotAvailable");
    callback(cleverapps.CODE_CANCELLED);
};