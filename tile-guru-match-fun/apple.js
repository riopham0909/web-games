/**
 * Created by vladislav on 9/7/2022
 */

var Apple = function (options, source) {
    Platform.call(this, options, source);

    this.info.os = this.oneOf(MacOS) ? PlatformInfo.OS_OSX : PlatformInfo.OS_IOS;

    if (this.oneOf(IOSCh)) {
        cleverapps.config.languages = ["en", "zh"];
    }
};

Apple.prototype = Object.create(Platform.prototype);
Apple.prototype.constructor = Apple;

Apple.prototype._initialize = function (callback) {
    new ActionPlayer([
        function (f) {
            var attempt = 0;

            var waitAppleNative = function () {
                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.AppleNative) {
                    f();
                    return;
                }

                setTimeout(waitAppleNative, 100);

                attempt++;
                if (attempt === 60) {
                    cleverapps.throwAsync("Wait AppleNative 1 min");
                }
            };

            waitAppleNative();
        },

        function (f) {
            this.callNative("ApplePlatformPlugin.getAppSettings", function (code, settings) {
                this.info.setInfo({ language: settings.defaultLanguage });

                this.device.name = settings.deviceName;
                this.device.version = settings.deviceVersion;

                if (settings.advertisingId) {
                    this.device.idfa = settings.advertisingId;
                }

                this.appleSocialAvailable = settings.appleSocialAvailable;

                f();
            }.bind(this));
        }.bind(this),

        function (f) {
            this.dataLoader.localStorage = new WebViewLocalStorage();
            this.dataLoader.localStorage.initialize(f);
        }.bind(this)
    ]).play(callback);
};

Apple.prototype.needWindowForLogin = function () {
    return true;
};

Apple.prototype._callNative = function (method, options) {
    options = Object.assign({}, options || {}, { method: method });

    var appleNative = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.AppleNative;

    if (!appleNative) {
        cleverapps.throwAsync("Empty AppleNative");
        return;
    }

    try {
        appleNative.postMessage(JSON.stringify(options));
    } catch (e) {
        cleverapps.throwAsync("Apple callNative " + method + " error " + e.message, e);
    }
};