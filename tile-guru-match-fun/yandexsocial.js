/**
 * Created by Stepan
 */

cleverapps.YandexSocial = function () {
    console.log("Choosing html5-yandex");

    cleverapps.Social.call(this);

    this.canReviewGame = false;
 
    if (!["tripeaks", "fairy", "mergecraft"].includes(cleverapps.config.name)) {
        cleverapps.config.debugMode = false;
    }
};

cleverapps.YandexSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.YandexSocial.prototype.constructor = cleverapps.YandexSocial;

cleverapps.YandexSocial.prototype._connect = function (callback) {
    this.initPlayer();

    callback(Platform.STATUS_CONNECTED);
};

cleverapps.YandexSocial.prototype.initPlayer = function () {
    var player = cleverapps.platform.player;

    this.playerMode = player.getMode();
    this.accessToken = player.signature;

    if (this.playerMode === "lite") {
        delete this.user;

        return;
    }

    this.user = cleverapps.YandexSocial.formatUserData(player);
    console.log(this.user);
};

cleverapps.YandexSocial.prototype._login = function (callback) {
    cleverapps.platform.ysdk.auth.openAuthDialog().then(function () {
        cleverapps.platform.initPlayer(function (code) {
            if (code === cleverapps.CODE_FAILED) {
                callback();
                return;
            }

            this.initPlayer();

            // For some reason playerMod could stay "lite" even after yandex reports allegedly successful login, stay unlogged
            if (this.playerMode === "lite") {
                delete this.user;
            }

            callback();
        }.bind(this));
    }.bind(this)).catch(callback);
};

cleverapps.YandexSocial.prototype.isLoggedIn = function () {
    return this.user !== undefined;
};

cleverapps.YandexSocial.prototype._getUserID = function () {
    return this.user ? this.user.id : undefined;
};

cleverapps.YandexSocial.prototype.getAccessToken = function () {
    return "YA_" + (this.accessToken || 0);
};

cleverapps.YandexSocial.prototype._aboutMe = function (callback) {
    if (this.user) {
        callback(this.user);
    }
};

cleverapps.YandexSocial.formatUserData = function (user) {
    return {
        id: user.getUniqueID(),
        name: user.getName(),
        first_name: user.getName(),
        picture: {
            data: {
                url: user.getPhoto("small")
            }
        }
    };
};
