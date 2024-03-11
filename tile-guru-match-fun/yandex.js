/**
 * Created by vladislav on 9/6/2022
 */

var Yandex = function (options) {
    Platform.call(this, options, "yandex");
};

Yandex.prototype = Object.create(Platform.prototype);
Yandex.prototype.constructor = Yandex;

Yandex.prototype._connect = function (callback) {
    var onSuccess = cleverapps.once(function () {
        if (typeof YaGames !== "undefined" && typeof YaGames.init === "function") {
            YaGames.init().then(function (ysdk) {
                this.ysdk = ysdk;

                this.initPlayer(callback);
            }.bind(this)).catch(function () {
                callback(Platform.STATUS_DISCONNECTED);
            });
        } else {
            callback(Platform.STATUS_DISCONNECTED);
        }
    }.bind(this));

    var loadYsdk = function () {
        cleverapps.loadSdk("//yandex.ru/games/sdk/v2", {
            onSuccess: onSuccess,
            onFailure: function () {
                console.log("Failed to load yandex sdk");

                callback(Platform.STATUS_DISCONNECTED);
            }
        });
    };

    if (typeof Promise === "undefined") {
        cleverapps.loadSdk("//cdn.jsdelivr.net/bluebird/latest/bluebird.core.min.js", {
            onSuccess: loadYsdk,
            onFailure: function () {
                console.log("Failed to load bluebird");

                callback(Platform.STATUS_DISCONNECTED);
            }
        });
    } else {
        loadYsdk();
    }
};

Yandex.prototype.initPlayer = function (callback) {
    return this.ysdk.getPlayer({ signed: true }).then(function (player) {
        this.player = player;

        if (player.getMode() !== "lite") {
            this.ysdk.feedback.canReview().then(function (res) {
                this.canReviewGame = res.value;
            }.bind(this));

            this.ysdk.notifications.allow();
        }

        callback(Platform.STATUS_CONNECTED);
    }.bind(this)).catch(function () {
        console.log("No user init");

        callback(Platform.STATUS_DISCONNECTED);
    });
};

Yandex.prototype.notifyLoaded = function () {
    if (this.ysdk && this.ysdk.features && this.ysdk.features.LoadingAPI) {
        this.ysdk.features.LoadingAPI.ready();
        cleverapps.config.debugMode && console.log("LoadingAPI.ready called");
    }
};

Yandex.prototype.isPlayhop = function () {
    return window.location.href.includes("playhop.com");
};

Yandex.prototype.getLocalStoragePreffix = function () {
    return "_yandex";
};

Yandex.prototype.getSuggestedLanguage = function () {
    if (!cleverapps.platform.isConnected(Platform.PLATFORM)) {
        return [PlatformInfo.LANGUAGE_RUSSIAN];
    }

    if (this.ysdk.environment.i18n) {
        return this.ysdk.environment.i18n.lang;
    }

    return [PlatformInfo.LANGUAGE_RUSSIAN];
};

Yandex.prototype.canReview = function () {
    return this.canReviewGame;
};

Yandex.prototype._requestReview = function () {
    this.ysdk.feedback.requestReview().then(function (res) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.SOCIAL_REVIEW + res.feedbackSent);
    });
};

Yandex.prototype.calcChannel = function (callback) {
    callback(Platform._parseChannel("utm_source"));
};

Yandex.prototype.needWindowForLogin = function () {
    return true;
};

Yandex.prototype.isFullscreenAvailable = function () {
    return false;
};