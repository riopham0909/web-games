/**
 * Created by vladislav on 9/6/2022
 */

var OKPlatform = function (options, source) {
    Platform.call(this, options, source || "web_ok");
};

OKPlatform.prototype = Object.create(Platform.prototype);
OKPlatform.prototype.constructor = OKPlatform;

OKPlatform.prototype.getLocalStoragePreffix = function () {
    return "_OK";
};

OKPlatform.prototype.updateSize = function () {
    cleverapps.platform.listeners.getPageInfo = function (result, data) {
        var height;
        try {
            height = JSON.parse(data).innerHeight;
        } catch (e) {
            height = window && window.innerHeight || document && document.body && document.body.clientHeight || 800;
        }
        var h = height - 75;
        if (h < 600) {
            h = 600;
        }
        FAPI.UI.setWindowSize(760, h);
        cleverapps.resolution.setupDesignResolution(cc.size(cc.view.getFrameSize().width, h));
    };

    [0, 5, 10, 20, 60].forEach(function (timeout) {
        setTimeout(FAPI.UI.getPageInfo, timeout * 1000);
    });
};

OKPlatform.prototype._connect = function (callback) {
    cleverapps.loadSdk("//api.ok.ru/js/fapi5.js", {
        crossorigin: false,
        onSuccess: this.onInitSuccess.bind(this, callback),
        onFailure: this.onInitFailure.bind(this, callback)
    });
};

OKPlatform.prototype.onInitSuccess = function (callback) {
    this.listeners = {};

    var rParams = FAPI.Util.getRequestParameters();

    if (rParams.mob_platform === "android") {
        this.info.setInfo({ os: PlatformInfo.OS_ANDROID });
    }

    FAPI.init(rParams.api_server, rParams.apiconnection, function () {
        window.API_callback = function (method, code, data) {
            console.log("Received API callback " + method, code, data);

            if (this.listeners[method]) {
                var listener = this.listeners[method];
                this.listeners[method] = undefined;
                listener.call(this, code, data);
            }
        }.bind(this);

        this.updateSize();
        this.initPushNotifications();

        callback(Platform.STATUS_CONNECTED);
    }.bind(this), function (reason) {
        this.onInitFailure(callback, reason);
    }.bind(this));
};

OKPlatform.prototype.onInitFailure = function (callback, reason) {
    callback(Platform.STATUS_DISCONNECTED);

    if (reason === "timeout") {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FAKEFB_BY_TIMEOUT);
    } else {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FAKEFB_BY_SCRIPT_ERROR);
    }
};

OKPlatform.prototype.createFAPICallback = function (callback) {
    return function (code, data, error) {
        if (error && error.error_code && parseInt(error.error_code) === 102) {
            this.sessionExpired = true;

            cleverapps.playSession.set(cleverapps.EVENTS.DEBUG.OK_SESSION_EXPIRED, true);

            this.disconnect();
            this.once("changeStatus:" + Platform.PLATFORM, function () {
                callback(code, data, error);
            });
            this.connect();
        } else {
            if (this.sessionExpired) {
                cleverapps.playSession.set(cleverapps.EVENTS.DEBUG.OK_SESSION_RESTORED, true);
            }

            callback(code, data, error);
        }
    }.bind(this);
};

OKPlatform.prototype.isMessagesAllowed = function (callback) {
    FAPI.Client.call({
        method: "group.isMessagesAllowed",
        gid: cleverapps.config.ok.groupId
    }, this.createFAPICallback(function (code, data) {
        if (code !== "ok") {
            callback(false);

            return;
        }

        callback(data.allowed);
    }));
};

OKPlatform.prototype.canJoinGroup = function (callback) {
    this.isInGroup(function (inGroup) {
        if (inGroup) {
            this.isMessagesAllowed(function (allowed) {
                callback(!allowed);
            });
        } else {
            callback(true);
        }
    }.bind(this));
};

OKPlatform.prototype._followOfficialPage = function () {
    this.canJoinGroup(function (canJoin) {
        if (!canJoin) {
            return;
        }

        cleverapps.platform.listeners.joinGroup = function (code, data) {
            var eventName = cleverapps.EVENTS.STATS.OK.JOIN_GROUP + data;
            cleverapps.eventLogger.logEvent(eventName.substr(0, 40));
        };

        FAPI.UI.joinGroup(cleverapps.config.ok.groupId, true);
    });
};

OKPlatform.prototype.isInGroup = function (callback) {
    FAPI.Client.call({
        method: "group.getUserGroupsV2"
    }, this.createFAPICallback(function (code, data) {
        var groups = code === "ok" && data && data.groups || [];

        var inGroup = false;
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];

            if (group.groupId === cleverapps.config.ok.groupId) {
                inGroup = true;

                break;
            }
        }

        callback(inGroup);
    }));
};

OKPlatform.prototype.initPushNotifications = function () {
};

OKPlatform.prototype._showBannerAd = function (callback) {
    cleverapps.platform.listeners.requestBannerAds = cleverapps.once(function () {
        cleverapps.platform.listeners.showBannerAds = cleverapps.once(function (code, data) {
            if (code !== "ok" || data !== "true") {
                callback({ code: code, data: data });
                return;
            }

            var requestBannerAds = function (code, data) {
                cleverapps.platform.listeners.requestBannerAds = requestBannerAds;

                if (code === "ok" && data === "ad_shown") {
                    cleverapps.bannerAd.onPaidEvent();
                }

                if (data === "hidden_by_user") {
                    cleverapps.bannerAd.hide(true);
                }
            };

            cleverapps.platform.listeners.requestBannerAds = requestBannerAds;

            var size = this.info.os === PlatformInfo.OS_ANDROID && this.info.isInApp
                ? MobileOK.AD_BANNER_HEIGHT_ANDROID
                : cc.size(MobileOK.AD_BANNER_WIDTH, MobileOK.AD_BANNER_HEIGHT);

            callback(cleverapps.CODE_SUCCEED, size);
        });

        FAPI.invokeUIMethod("showBannerAds", "bottom");
    });

    FAPI.invokeUIMethod("requestBannerAds");
};

OKPlatform.prototype._hideBannerAd = function (callback) {
    cleverapps.platform.listeners.hideBannerAds = cleverapps.once(function (code, data) {
        if (code !== "ok") {
            callback({ method: "hideBannerAds", code: code, data: data });
            return;
        }

        cleverapps.platform.listeners.isBannerAdsVisible = cleverapps.once(function (code, data) {
            if (code !== "ok") {
                callback({ method: "isBannerAdsVisible", code: code, data: data });
                return;
            }

            if (data !== "false") {
                callback("banner still shown");
                return;
            }

            cleverapps.platform.listeners.requestBannerAds = undefined;
            cleverapps.platform.listeners.showBannerAds = undefined;
            cleverapps.platform.listeners.hideBannerAds = undefined;
            cleverapps.platform.listeners.isBannerAdsVisible = undefined;

            callback(cleverapps.CODE_SUCCEED);
        });

        FAPI.invokeUIMethod("isBannerAdsVisible");
    });

    FAPI.invokeUIMethod("hideBannerAds");
};