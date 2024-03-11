/**
 * Created by vladislav on 9/6/2022
 */

var MobileOK = function (options) {
    OKPlatform.call(this, options, "mobile_ok");

    var ua = window && window.navigator && window.navigator.userAgent;
    if (ua && ua.indexOf("OkApp") >= 0) {
        this.info.isInApp = true;
        this.info.isMobile = true;
    }
};

MobileOK.prototype = Object.create(OKPlatform.prototype);
MobileOK.prototype.constructor = MobileOK;

MobileOK.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_RUSSIAN];
};

MobileOK.prototype._canCreateShortcut = function () {
    return this.info.os === PlatformInfo.OS_ANDROID && !cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.SHORTCUT_CREATED);
};

MobileOK.prototype.createShortcut = function (callback) {
    cleverapps.platform.listeners.requestDesktopIcon = cleverapps.once(function (code, data) {
        console.log("requestDesktopIcon", code, data);

        callback && callback(code, data);

        if (code === "ok") {
            cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.SHORTCUT_CREATED, 1);
        }
    });

    FAPI.invokeUIMethod("requestDesktopIcon");
};

MobileOK.prototype.canReview = function () {
    return this.info.os === PlatformInfo.OS_ANDROID;
};

MobileOK.prototype._requestReview = function () {
    cleverapps.platform.listeners.showRatingDialog = cleverapps.once(function (code, data) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.SOCIAL_REVIEW + code);

        console.log("showRatingDialog", code, data);
    });

    FAPI.invokeUIMethod("showRatingDialog");
};

MobileOK.prototype.updateSize = function () {

};

MobileOK.prototype.isFullscreenAvailable = function () {
    return !this.info.isInApp && !!this.getFullscreener();
};

MobileOK.prototype.initPushNotifications = function () {
    if (this.info.os !== PlatformInfo.OS_ANDROID || !this.info.isInApp) {
        return;
    }

    this.listeners.getPushNotificationsStatus = function (code, data) {
        if (code !== "ok") {
            return;
        }

        data = JSON.parse(data);

        if (data.isGlobalEnabled === "true" && data.isSubscriptionEnabled === "true") {
            cleverapps.info.setKeyValue("pushPermission", true, true);
        } else {
            FAPI.UI.suggestToEnablePushNotifications();
        }
    };

    this.listeners.suggestToEnablePushNotifications = function (code) {
        cleverapps.info.setKeyValue("pushPermission", code === "ok", true);
    };

    FAPI.UI.getPushNotificationsStatus();
};

MobileOK.AD_BANNER_HEIGHT = 96;
MobileOK.AD_BANNER_WIDTH = 404;
MobileOK.AD_BANNER_HEIGHT_ANDROID = 106;
