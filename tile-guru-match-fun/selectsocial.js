/**
 * Created by andrey on 20.07.2020
 */

cleverapps.SelectSocial = function () {
    console.log("Choosing SelectSocial");

    this.socials = {};

    cleverapps.Social.call(this);
};

cleverapps.SelectSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.SelectSocial.prototype.constructor = cleverapps.SelectSocial;

cleverapps.SelectSocial.prototype._connect = function (callback) {
    this.createSocials();

    var actions = Object.keys(this.socials).map(function (key) {
        return function (f) {
            var social = this.socials[key];
            social.connect(function () {
                if (social.isLoggedIn()) {
                    cleverapps.platform.plugins[Platform.SOCIAL] = social;
                    cleverapps.social = social;
                    console.log("Change social to " + key);
                    callback(Platform.STATUS_CONNECTED);
                    return;
                }

                f();
            });
        }.bind(this);
    }, this);

    new ActionPlayer(actions).play(function () {
        callback(Platform.STATUS_CONNECTED);
    });
};

cleverapps.SelectSocial.prototype.createSocials = function () {
    var isTmpId = cleverapps.platform.haveTmpId();
    var isAndroidId = cleverapps.AndroidSocial.isAndroidUserId(cleverapps.platform.getUserID());
    var isAppleId = cleverapps.AppleSocial.isAppleUserId(cleverapps.platform.getUserID());
    var isFBId = !isTmpId && !isAndroidId && !isAppleId;

    if (isTmpId || isFBId) {
        this.socials.facebook = cleverapps.SelectSocial.selectMobileFB();
    }

    if (isTmpId && cleverapps.AndroidSocial.isAvailable() || isAndroidId) {
        this.socials.androidsocial = new cleverapps.AndroidSocial();
    }

    if (isTmpId && cleverapps.AppleSocial.isAvailable() || isAppleId) {
        this.socials.applesocial = new cleverapps.AppleSocial();
    }

    console.log("SelectSocial.createSocials - " + cleverapps.platform.getUserID() + " - " + Object.keys(this.socials).join(","));
};

cleverapps.SelectSocial.selectMobileFB = function () {
    return new WebViewFacebook();
};

cleverapps.SelectSocial.prototype.login = function (callback, options) {
    var key = options.source;
    var social = this.socials[key];

    social.login(function (code) {
        cleverapps.social = social;
        cleverapps.platform.plugins[Platform.SOCIAL] = social;
        console.log("Change social to " + key);

        callback(code);
    });
};

cleverapps.SelectSocial.prototype.getCode = function () {
    return Object.keys(this.socials).sort().join("-");
};
