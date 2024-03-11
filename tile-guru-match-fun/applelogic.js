/**
 * Created by vladislav on 1/18/2024
 */

var AppleLogic = function () {
    PlatformLogic.call(this);
};

AppleLogic.prototype = Object.create(PlatformLogic.prototype);
AppleLogic.prototype.constructor = AppleLogic;

AppleLogic.prototype.onInitialize = function () {
    WebViewConsole.init();
};