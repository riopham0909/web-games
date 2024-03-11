/**
 * Created by vladislav on 9/7/2022
 */

var FacebookCanvas = function (options) {
    Platform.call(this, options, "facebook");
};

FacebookCanvas.prototype = Object.create(Platform.prototype);
FacebookCanvas.prototype.constructor = FacebookCanvas;

FacebookCanvas.prototype._connect = function (callback) {
    var timeout;
    var fbInitInterval;

    var callCallback = cleverapps.once(function (status) {
        setTimeout(function () {
            callback(status);
        }, 500);

        if (fbInitInterval !== undefined) {
            clearInterval(fbInitInterval);
            fbInitInterval = undefined;
        }

        if (timeout !== undefined) {
            clearTimeout(timeout);
            timeout = undefined;
        }

        cleverapps.social.deleteAllRequests();
    });

    var onFailure = function (reason) {
        if (typeof plugin !== "undefined"
            && plugin.FacebookAgent
            && plugin.FacebookAgent.getInstance()
            && plugin.FacebookAgent.getInstance()._isLoggedIn !== undefined) {
            callCallback(Platform.STATUS_CONNECTED);
            return;
        }

        callCallback(Platform.STATUS_DISCONNECTED);

        if (reason === "timeout") {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FAKEFB_BY_TIMEOUT);
        } else {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FAKEFB_BY_SCRIPT_ERROR);
        }
    };

    var onSuccess = function () {
        timeout = setTimeout(function () {
            onFailure("timeout");
        }, 10000);
    };

    // console.log('LOADING SDK', cleverapps.loadSdk);
    var path = "//connect.facebook.net/en_US/sdk.js";
    cleverapps.loadSdk(path, { onSuccess: onSuccess, onFailure: onFailure });

    window.fbAsyncInit = function () {
        if (plugin.FacebookAgent) {
            return;
        }

        cleverapps.config.plugin = {
            facebook: {
                status: true,
                version: "v3.3",
                appId: cleverapps.config.facebook.appId
            }
        };

        cleverapps.StartFacebook();

        fbInitInterval = setInterval(function () {
            if (plugin.FacebookAgent && plugin.FacebookAgent.getInstance() && plugin.FacebookAgent.getInstance()._isLoggedIn !== undefined) {
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FACEBOOK_INITED);
                callCallback(Platform.STATUS_CONNECTED);
            }
        }, 50);
    };
};
