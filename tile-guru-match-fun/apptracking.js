/**
 * Created by andrey on 07.09.2023.
 */

var AppTracking = function () {
    cleverapps.platform.nativeEventListeners.AppTracking = this.onNativeEvent.bind(this);
};

AppTracking.prototype.askPermission = function (callback) {
    if (!AppTracking.isApplicable()) {
        callback();
        return;
    }

    cleverapps.platform.callNative("AppTrackingPlugin.askPermissions", function (code, data) {
        var value = data.value;
        console.log("AppTracking setStatus " + (typeof value) + " - " + value);
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.APP_TRACKING + value);

        callback();
    });
};

AppTracking.prototype.onNativeEvent = function (event) {
    console.log("AppTracking.onNativeEvent - " + event);

    switch (event) {
        case "inactiveState":
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.APP_TRACKING + "inactive");
            break;
    }
};

AppTracking.isApplicable = function () {
    return cleverapps.platform.oneOf(Apple);
};

AppTracking.PERMISSIONS = {
    NOT_DETERMINED: 0,
    RESTRICTED: 1,
    DENIED: 2,
    AUTHORIZED: 3
};
