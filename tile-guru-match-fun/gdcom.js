/**
 * Created by vladislav on 9/6/2022
 */

var GDCom = function (options) {
    Platform.call(this, options, "gdcom");

    this.adsEventListener = function () {};
};

GDCom.prototype = Object.create(Platform.prototype);
GDCom.prototype.constructor = GDCom;

GDCom.prototype._initialize = function (callback) {
    this.setUserID(cleverapps.getRequestParameters().gdcom_userid);

    callback();
};

GDCom.prototype._connect = function (callback) {
    if (cleverapps.isLocalhost()) {
        callback(Platform.STATUS_CONNECTED);
        return;
    }

    window.GD_OPTIONS = {
        gameId: cleverapps.config.gdcom.appId,
        onEvent: function (event) {
            console.log("gdcom event", JSON.stringify(event));
            switch (event.name) {
                case "SDK_GAME_START":
                    this.resume();
                    break;
                case "SDK_GAME_PAUSE":
                    this.pause();
                    break;
                case "SDK_GDPR_TRACKING":
                    // this event is triggered when your user doesn't want to be tracked
                    break;
                case "SDK_GDPR_TARGETING":
                    // this event is triggered when your user doesn't want personalised targeting of ads and such
                    break;

                case "DISPLAYAD_IMPRESSION":
                    break;
            }

            this.adsEventListener(event);
        }.bind(this)
    };

    if (this.isCoolmathgames()) {
        cleverapps.Availables.LEADER_BOARD = { debugMode: true };
        delete cleverapps.config.leagues;

        ["scramble", "crocword"].forEach(function (project) {
            CupsConfig.TYPES[CupsConfig.TYPE_DAILY].available.projectName.splice(CupsConfig.TYPES[CupsConfig.TYPE_DAILY].available.projectName.indexOf(project), 1);
        });
    }

    var onFailure = function () {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.GDCOM_INIT_ERROR);
        callback(Platform.STATUS_DISCONNECTED);
    };

    cleverapps.loadSdk("main.min.js", {
        onSuccess: function () {
            callback(Platform.STATUS_CONNECTED);
        },
        onFailure: onFailure 
    });
};

GDCom.prototype.getLocalStoragePreffix = function () {
    return "_plinga";
};

GDCom.prototype.isCoolmathgames = function () {
    return window.location.href.includes("coolmathgames.com");
};

GDCom.prototype.isFullscreenAvailable = function () {
    return !this.isCoolmathgames();
};

GDCom.prototype._showBannerAd = function (callback) {
    var container = document.createElement("div");
    container.id = "gdcom-ad-banner-container";
    container.style.display = "block";
    container.style.visibility = "hidden";
    container.style.position = "absolute";
    container.style.zIndex = "2";
    container.style.bottom = "0";
    container.style.margin = "0 auto";
    container.style.height = GDCom.AD_BANNER_HEIGHT + "px";
    container.style.width = "100%";
    document.body.appendChild(container);

    var onBannerReady = cleverapps.once(function (error) {
        if (!error && !container.getElementsByTagName("iframe").length) {
            error = "No fitting size banner found for slot " + container.clientWidth + "x" + container.clientHeight;
        }

        if (error) {
            container.remove();
            callback(error);
            return;
        }
        
        container.style.visibility = "visible";

        callback(cleverapps.CODE_SUCCEED, GDCom.AD_BANNER_HEIGHT);
    });

    setTimeout(function () {
        onBannerReady("gdsdk.showAd timeout");
    }, GDCom.AD_BANNER_ERROR_TIMEOUT);

    try {
        gdsdk.showAd(gdsdk.AdType.Display, {
            containerId: "gdcom-ad-banner-container"
        }).then(function () {
            setTimeout(onBannerReady, GDCom.AD_BANNER_SUCCESS_TIMEOUT);
        }).catch(onBannerReady);
    } catch (e) {
        onBannerReady(e);
    }
};

GDCom.prototype._hideBannerAd = function (callback) {
    var container = document.getElementById("gdcom-ad-banner-container");
    if (container) {
        container.remove();
    }

    callback(cleverapps.CODE_SUCCEED);
};

GDCom.AD_BANNER_SUCCESS_TIMEOUT = cleverapps.parseInterval("2 seconds");
GDCom.AD_BANNER_ERROR_TIMEOUT = cleverapps.parseInterval("30 seconds");

GDCom.AD_BANNER_HEIGHT = 90;
