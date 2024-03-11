/**
 * Created by andrey on 23.01.2024.
 */

var GoogleAnalyticsManager = {
    run: function () {
        if (!cleverapps.config.googleAnalytics) {
            return FakeGoogleAnalytics;
        }
        if (cleverapps.platform.oneOf(CleverApps)) {
            return WebGoogleAnalytics;
        }
        return FakeGoogleAnalytics;
    }
};

var WebGoogleAnalytics = {
    init: function () {
        var trackingId = cleverapps.config.googleAnalytics.measurementId;

        console.log("GoogleAnalytics init");

        var initialized = false;

        cleverapps.loadSdk("//www.googletagmanager.com/gtag/js?id=" + trackingId, {
            onSuccess: function () {
                initialized = true;
                console.log("GoogleAnalytics init success");
            }
        });

        var dataLayer = window.dataLayer || [];
        window.dataLayer = dataLayer;

        var gtag = function () {
            if (!initialized && dataLayer.length >= 100) {
                return;
            }

            dataLayer.push(arguments);
        };

        window.gtag = gtag;

        gtag("js", new Date());

        var params = {};

        if (cleverapps.config.debugMode) {
            params.debug_mode = true;
        }

        gtag("config", trackingId, params);

        this.updateUserId();
    },

    logEvent: function (name, data) {
        gtag("event", name, data);

        cleverapps.config.debugMode && console.log("GoogleAnalytics - " + name);
    },

    updateUserId: function () {
        gtag("set", { "user_id": cleverapps.platform.getUserID() });
    },

    logAdRevenue: function (name, value) {
        this.logEvent("ad_" + name, {
            value: value,
            currency: "USD"
        });
    }
};

var FakeGoogleAnalytics = {
    init: function () {
    },
    logEvent: function () {
    },
    updateUserId: function () {
    },
    logAdRevenue: function () {
    }
};
