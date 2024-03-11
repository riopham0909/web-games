/**
 * Created by andrey on 11.11.19.
 */

cleverapps.FirebaseManager = {
    run: function () {
        if (cleverapps.flags.nofirebase) {
            return cleverapps.FakeFirebase;
        }
        if (cleverapps.platform.oneOf(Amazon, AndroidPlatform, IOS)) {
            return cleverapps.WebViewFirebase;
        }
        if (cleverapps.platform.oneOf(CleverApps, MacOS) && cleverapps.config.webFirebase) {
            return cleverapps.WebFirebase;
        }
        if (cc.sys.isNative) {
            console.log("No firebase plugin found!");
        }
        return cleverapps.FakeFirebase;
    }
};

cleverapps.WebFirebase = {
    init: function () {
        cleverapps.loadSdk("//www.gstatic.com/firebasejs/8.9.0/firebase-app.js", {
            onSuccess: function () {
                cleverapps.loadSdk("//www.gstatic.com/firebasejs/8.9.0/firebase-analytics.js", {
                    onSuccess: function () {
                        firebase.initializeApp(cleverapps.config.webFirebase);
                        firebase.analytics();
                    }
                });
            }
        });
    },

    logEvent: function (name, data) {
        if (typeof firebase !== "undefined" && typeof firebase.analytics === "function") {
            firebase.analytics().logEvent(name, data);
        }
    },

    setScreenName: function () {
    }
};

cleverapps.WebViewFirebase = {
    batch: [],

    sendBatch: cleverapps.accumulate(1000, function () {
        var self = cleverapps.WebViewFirebase;
        if (self.batch.length > 0) {
            cleverapps.platform.callNative("FirebasePlugin.sendBatch", { batch: self.batch });
            self.batch = [];
        }
    }),

    init: function () {
        this.batch.push({
            method: "setUserID",
            id: cleverapps.platform.getUserID()
        });
        this.sendBatch();
    },

    logEvent: function (name, data) {
        this.batch.push({
            method: "logEvent",
            name: name,
            data: data
        });
        this.sendBatch();
    },

    setScreenName: function (screen, scene) {
        this.batch.push({
            method: "setScreenName",
            screen: screen,
            scene: scene
        });
        this.sendBatch();
    }
};

cleverapps.FakeFirebase = {
    init: function () {},
    logEvent: function () {},
    setScreenName: function () {}
};
