/**
 * Created by Andrey Popov on 03.11.2023
 */

var Crazy = function (options) {
    Platform.call(this, options, "crazy");
};

Crazy.prototype = Object.create(Platform.prototype);
Crazy.prototype.constructor = Crazy;

Crazy.prototype._connect = function (callback) {
    var onFailure = function () {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.CRAZY_INIT_ERROR);

        callback(Platform.STATUS_DISCONNECTED);
    };

    var onAPILoad = function () {
        if (typeof CrazyGames === "undefined") {
            onFailure();
            return;
        }

        CrazyGames.SDK.game.sdkGameLoadingStart();
        cleverapps.whenAllInitialized(function () {
            CrazyGames.SDK.game.sdkGameLoadingStop();
        });

        CrazyGames.SDK.user.isUserAccountAvailable(function (error) {
            if (error) {
                onFailure();
                return;
            }

            cleverapps.social.loadUser(function () {
                callback(Platform.STATUS_CONNECTED);
            });
        });
    };

    cleverapps.loadSdk("https://sdk.crazygames.com/crazygames-sdk-v2.js", {
        onFailure: onFailure,
        onSuccess: onAPILoad
    });
};

Crazy.prototype.getLocalStoragePreffix = function () {
    return "_crazy";
};

Crazy.prototype.isFullscreenAvailable = function () {
    return false;
};

Crazy.prototype.needWindowForLogin = function () {
    return true;
};

Crazy.prototype._showBannerAd = function (callback) {
    var container = document.createElement("div");
    container.id = "crazygames-ad-banner-container";
    container.style.display = "block";
    container.style.visibility = "hidden";
    container.style.position = "absolute";
    container.style.zIndex = "2";
    container.style.bottom = "0";
    container.style.margin = "0 auto";
    container.style.height = Crazy.AD_BANNER_HEIGHT + "px";
    container.style.width = "100%";
    document.body.appendChild(container);

    var onBannerReady = function (error) {
        if (error) {
            container.remove();
            callback(error);
            return;
        }

        container.style.visibility = "visible";

        callback(cleverapps.CODE_SUCCEED, Crazy.AD_BANNER_HEIGHT);
    };

    CrazyGames.SDK.banner.requestResponsiveBanner(
        "crazygames-ad-banner-container",
        onBannerReady
    );
};

Crazy.prototype._refreshBannerAd = function (callback) {
    CrazyGames.SDK.banner.requestResponsiveBanner("crazygames-ad-banner-container", callback);
};

Crazy.prototype._hideBannerAd = function (callback) {
    CrazyGames.SDK.banner.clearAllBanners();

    var container = document.getElementById("crazygames-ad-banner-container");
    if (container) {
        container.remove();
    }

    callback(cleverapps.CODE_SUCCEED);
};

Crazy.prototype.loadOldUserId = function (callback) {
    cleverapps.getFrameUserId(cleverapps.config.staticUrl, {
        key: cleverapps.config.name + "_plinga",
        callback: callback
    });
};

Crazy.AD_BANNER_HEIGHT = 50;
