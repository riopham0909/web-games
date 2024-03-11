/**
 * Created by slava on 5/4/17.
 */

cleverapps.ErrorHandler = {
    SEND_INTERVAL: "1 hour",

    lastSend: 0,

    formatMessage: function (lines) {
        var message = [new Date() + ""];

        if (cleverapps.environment) {
            message.push("Screen: " + cleverapps.environment.getScreen());
        }

        if (cleverapps.platform) {
            message.push("Source: " + cleverapps.platform.source);
        }

        if (cleverapps.config) {
            message.push("Name: " + cleverapps.config.name);
            message.push("Title: " + cleverapps.config.title);
            message.push("Version: " + cleverapps.config.version);
            message.push("WebpSupport: " + cleverapps.config.webpSupport);
        }

        if (typeof levels !== "undefined" && levels.user) {
            if (cleverapps.environment) {
                message.push("Episode: " + cleverapps.environment.episodeNo);
                message.push("Level: " + cleverapps.environment.levelNo);
            }

            if (cleverapps.config && cleverapps.config.type === "merge") {
                message.push("User Level: " + levels.user.level);
            } else {
                message.push("User Level: " + levels.user.episode);
            }

            message.push("User id: " + cleverapps.platform.getUserID());
        }

        if (cleverapps.paymentsHistory) {
            message.push("Payer: " + cleverapps.paymentsHistory.classify());
        }

        if (cleverapps.settings) {
            message.push("Language: " + cleverapps.settings.language);
        }

        if (cleverapps.meta) {
            message.push("Focus: " + cleverapps.meta.focus);
            message.push("Focus history: " + cleverapps.meta.focusHistory.join(", "));
        }

        if (cleverapps.synchronizer && cleverapps.synchronizer.lastSyncIn) {
            message.push("Last syncin: " + cleverapps.synchronizer.lastSyncIn);
        }

        if (typeof $msstart !== "undefined") {
            message.push("Last $msstart: " + $msstart.lastCalled + " " + $msstart.lastCalledTime);
        }

        message.push((window && window.navigator) ? window.navigator.userAgent : "???");

        message = message.concat(lines);
        message = message.join(" - ");
        message = message.replace(/(?:\r\n|\r|\n)/g, " - ") + " ";

        if (window && window.assetsFolder) {
            message = message.replace(new RegExp(window.assetsFolder, "g"), "");
        }

        return message;
    },

    onerror: function (msg, url, lineNo, columnNo, error) {
        var source = cleverapps.platform && cleverapps.platform.source;
        var lines = [];

        if (error && error.arguments) {
            lines.push("Arguments: " + error.arguments);
        }

        if (!url) {
            url = window.location.href;
        }

        if (lineNo === 0 && columnNo === 0 && source === "gdcom") {
            return;
        }

        if (!error || !error.stack) {
            lines.push("Message: " + msg);
            lines.push("URL: " + url);
            lines.push("Line: " + lineNo);
            lines.push("Column: " + columnNo);
            lines.push("Error: " + JSON.stringify(error));
        } else {
            lines.push("Message: " + msg);
            lines.push("Line: " + lineNo);
            lines.push("Column: " + columnNo);
            lines.push(error.stack);
        }

        cleverapps.ErrorHandler.getLastConsoleMessages(function (consoleMessages) {
            if (consoleMessages) {
                lines.unshift("Console: " + consoleMessages);
            }

            var message = cleverapps.ErrorHandler.formatMessage(lines);

            cleverapps.ErrorHandler.showErrorNotification(error || msg, lines);

            if (cleverapps.ErrorHandler.needIgnore(message)) {
                return false;
            }

            cleverapps.ErrorHandler._onerror(message);
        });

        return false;
    },

    needIgnore: function (message) {
        return cleverapps.ErrorHandler.IGNORED_ERRORS.some(function (error) {
            return message && message.indexOf(error) !== -1;
        });
    },

    _onerror: function (message) {
        if ((Date.now() - cleverapps.ErrorHandler.lastSend) >= cleverapps.parseInterval(this.SEND_INTERVAL)) {
            this.send(message);

            cleverapps.ErrorHandler.lastSend = Date.now();
        }

        if (!cc.sys.isNative) {
            return;
        }

        console.log("_onerror - " + JSON.stringify(message));

        var frames = cc.director.getTotalFrames();

        var callback1 = function () {
            if (frames === cc.director.getTotalFrames()) {
                cc.game.pause();
                cc.game.resume();

                setTimeout(callback2, 500);
            }
        };

        var callback2 = function () {
            if (frames === cc.director.getTotalFrames() || !cleverapps.meta) {
                cleverapps.eventLogger && cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.WEBVIEW_ONERROR_RELOAD_SILENT);
                cleverapps.throwAsync && cleverapps.throwAsync("WebView error location reload silent - " + JSON.stringify(message));
                window.location.reload();
                return;
            }

            var options = {
                focus: "OnErrorRestartWindow",
                action: function (f) {
                    cleverapps.eventLogger && cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.WEBVIEW_ONERROR_RELOAD_WINDOW);
                    cleverapps.throwAsync && cleverapps.throwAsync("WebView error location reload window - " + JSON.stringify(message));

                    new RestartWindow({ contentMessage: "RestartWindow.OnError" });
                    cleverapps.meta.onceNoWindowsListener = f;
                }
            };
            if (cleverapps.meta.isFocused()) {
                cleverapps.meta.distract(options);
            } else {
                cleverapps.meta.display(options);
            }
        };

        setTimeout(callback1, 500);
    },

    send: function (message) {
        console.log(message);
        cleverapps.RestClient.sendRaw(cleverapps.RestClient.METHODS.POST, cleverapps.LOG_ERROR_URL, message);
        cleverapps.eventLogger && cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.ERROR_AMOUNT);
    },

    getLastConsoleMessages: function (callback) {
        if (!cleverapps.platform || !cleverapps.platform.oneOf(AndroidBase)) {
            callback();
            return;
        }

        try {
            cleverapps.platform.callNative("AppActivityPlugin.getLastConsoleMessages", function (code, data) {
                callback(data && data.consoleMessages);
            });
        } catch (e) {
            console.log("ErrorHandler.getLastConsoleMessages error", e);
            callback();
        }
    },

    showErrorNotification: function (error, details) {
        if (!cleverapps.config.debugMode || !cleverapps.bundleLoader || !cleverapps.notification) {
            return;
        }

        var message;

        if (typeof error === "string") {
            message = error;
        } else if (error && error.message) {
            message = error.message;
        } else {
            message = JSON.stringify(error);
        }

        message = message.substr(0, 60);

        cleverapps.notification.create(message, {
            defer: true,
            image: bundles.dev_buttons.frames.icon_error,
            debugInfo: details.join("\n"),
            toReplace: {
                ignoreWarning: true
            }
        });

        if (cleverapps.resolution && cleverapps.resolution.isInitialized()) {
            cleverapps.bundleLoader.loadBundle("main", {
                onSuccess: function () {
                    cleverapps.resolution.showCanvas();
                    cleverapps.notification.processQueue();
                    cleverapps.bundleLoader.deleteBundle("main");
                }
            });
        }
    }
};

window.onerror = cleverapps.ErrorHandler.onerror;

cleverapps.LOG_ERROR_URL = "/log/";

cleverapps.ErrorHandler.IGNORED_ERRORS = [
    "html5.api.gamedistribution.com",
    "hadronid.net/hadron.js", // gdcom partner external error
    "app.mbga-platform.jp/gadgets/js/auth-refresh",
    "safari-extension://",
    "eval (eval at  anonymous  (eval at buildCode (:606:31))"
];
