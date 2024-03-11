/**
 * Created by Andrey Popov on 1/17/22.
 */

cleverapps.FbPixel = function () {
    if (!cleverapps.platform.oneOf(CleverApps) || !cleverapps.config.fbPixelId || cleverapps.config.debugMode) {
        cleverapps.override(this, cleverapps.FakeFbPixel);
    }

    this.initialize();
};

cleverapps.FbPixel.prototype.initialize = function () {
    !(function (f, b, e, v, n, t, s) {
        if (f.fbq) {
            return;
        }
        n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) {
            f._fbq = n;
        }
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js"));
    fbq("init", cleverapps.config.fbPixelId);

    this.logEvent("PageView");
};

cleverapps.FbPixel.prototype.logEvent = function (event, data) {
    fbq("track", event, data);
};

cleverapps.FakeFbPixel = {
    initialize: function () {},
    logEvent: function () {}
};
