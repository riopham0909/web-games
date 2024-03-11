/**
 * Created by anatoly on 22/08/2023
 */

cleverapps.TonSocial = function () {
    console.log("Choosing Ton Social");

    cleverapps.Social.call(this);
};

cleverapps.TonSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.TonSocial.prototype.constructor = cleverapps.TonSocial;

cleverapps.TonSocial.prototype._connect = function (callback) {
    cleverapps.platform.callNative("getUser", {}, function (code, options) {
        this.id = "" + options.value.id;

        callback(code === cleverapps.CODE_SUCCEED ? Platform.STATUS_CONNECTED : Platform.STATUS_DISCONNECTED);
    }.bind(this));
};

cleverapps.TonSocial.prototype._getUserID = function () {
    return this.id;
};

cleverapps.TonSocial.prototype._login = function (callback) {
    callback();
};

cleverapps.TonSocial.prototype.isLoggedIn = function () {
    return true;
};

cleverapps.TonSocial.prototype.getAccessToken = function () {
    return "ton";
};