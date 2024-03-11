/**
 * Created by vladislav on 9/6/2022
 */

var AndroidBase = function (options, source) {
    Platform.call(this, options, source);

    this.info.os = PlatformInfo.OS_ANDROID;
};

AndroidBase.prototype = Object.create(Platform.prototype);
AndroidBase.prototype.constructor = AndroidBase;

AndroidBase.prototype._callNative = function (method, options) {
    AndroidNative.callNative(method, JSON.stringify(options));
};

AndroidBase.prototype._initialize = function (callback) {
    new ActionPlayer([
        function (f) {
            this.callNative("AppActivityPlugin.getAppSettings", function (code, settings) {
                this.info.setInfo({ language: settings.defaultLanguage });
                
                this.device.name = settings.deviceName;
                this.device.version = settings.deviceVersion;
                if (settings.idfa) {
                    this.device.idfa = settings.idfa;
                }

                this.audioPluginAvailable = settings.audioPluginAvailable;

                f();
            }.bind(this));
        }.bind(this),

        function (f) {
            this.dataLoader.localStorage = new WebViewLocalStorage();
            this.dataLoader.localStorage.initialize(f);
        }.bind(this)
    ]).play(callback);
};

AndroidBase.prototype.needWindowForLogin = function () {
    return true;
};

AndroidBase.prototype.closeApplication = function () {
    cleverapps.platform.callNative("AppActivityPlugin.closeApplication");
};