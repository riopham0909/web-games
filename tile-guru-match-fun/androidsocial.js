/**
 * Created by andrey on 20.07.2020
 */

cleverapps.AndroidSocial = function () {
    console.log("Choosing Android Social");

    cleverapps.Social.call(this);

    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, this.refresh.bind(this));
    cleverapps.timeouts.setInterval(this.refresh.bind(this), cleverapps.parseInterval("10 minutes"));
};

cleverapps.AndroidSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.AndroidSocial.prototype.constructor = cleverapps.AndroidSocial;

cleverapps.AndroidSocial.prototype._connect = function (callback) {
    cleverapps.platform.callNative("AndroidSocialPlugin.refresh", function (code, authDetails) {
        this.onAuthDetails(authDetails);

        callback(Platform.STATUS_CONNECTED);
    }.bind(this));
};

cleverapps.AndroidSocial.prototype.refresh = function () {
    if (cleverapps.social === this) {
        cleverapps.platform.connectPlugin(Platform.SOCIAL);
    }
};

cleverapps.AndroidSocial.prototype.isLoggedIn = function () {
    return Boolean(this.userId && this.accessToken);
};

cleverapps.AndroidSocial.prototype._getUserID = function () {
    return this.userId;
};

cleverapps.AndroidSocial.isAndroidUserId = function (id) {
    return id && id.indexOf("android_") === 0;
};

cleverapps.AndroidSocial.prototype.getAccessToken = function () {
    return this.accessToken;
};

cleverapps.AndroidSocial.prototype._login = function (callback) {
    cleverapps.platform.callNative("AndroidSocialPlugin.login", function (code, authDetails) {
        this.onAuthDetails(authDetails);

        callback();
    }.bind(this));
};

cleverapps.AndroidSocial.prototype.onAuthDetails = function (authDetails) {
    if (authDetails.userId && authDetails.accessToken) {
        this.userId = "android_" + authDetails.userId;
        this.accessToken = authDetails.accessToken;
    } else {
        this.userId = undefined;
        this.accessToken = undefined;
    }
};

cleverapps.AndroidSocial.prototype._aboutMe = function (callback) {
    cleverapps.platform.callNative("AndroidSocialPlugin.aboutMe", function (code, response) {
        callback(response);
    });
};

cleverapps.AndroidSocial.prototype.getCode = function () {
    return cleverapps.AndroidSocial.CODE;
};

cleverapps.AndroidSocial.isAvailable = function () {
    return cleverapps.platform.oneOf(AndroidPlatform, GPG);
};

cleverapps.AndroidSocial.CODE = "androidsocial";
