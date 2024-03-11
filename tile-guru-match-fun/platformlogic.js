/**
 * Created by vladislav on 1/18/2024
 */

var PlatformLogic = function () {
    var updatePlatformInfo = function () {
        cc.sys.os = cleverapps.platform.info.os;
        cc.sys.isMobile = cleverapps.platform.info.isMobile;
        cc.sys.isNative = cleverapps.platform.info.isNative;
        cc.sys.isInApp = cleverapps.platform.info.isInApp;
        cc.sys.language = cleverapps.platform.info.language;
    };

    cleverapps.platform.info.on("changed", updatePlatformInfo);

    updatePlatformInfo();

    if (cc.sys.isNative) {
        var params = new URLSearchParams(window.location.search);
        if (params.has("source")) {
            cc.sys.isNativeFlight = true;
        }
    }
};

PlatformLogic.prototype.onInitialize = function () {

};

PlatformLogic.prototype.onStart = function () {

};

PlatformLogic.create = function () {
    var platforms = {
        wechat: WechatLogic,
        apple: AppleLogic,
        instant: InstantLogic,
        msstart: MSStartLogic,
        web_ok: OKLogic,
        mobile_ok: MobileOKLogic,
        yandex: YandexLogic
    };

    var Class = platforms[cleverapps.platform.source] || PlatformLogic;

    return new Class();
};

cc.sys.LANGUAGE_LATVIAN = "lv";
cc.sys.LANGUAGE_TURKISH = "tr";
cc.sys.LANGUAGE_DUTCH = "nl";