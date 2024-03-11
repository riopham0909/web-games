/**
 * Created by vladislav on 1/22/2024
 */

var PlatformInfo = function (source) {
    cleverapps.EventEmitter.call(this);

    this.isMobile = this._detectMobile(source);
    this.isNative = this._detectNative(source);
    this.os = this._detectOS();
    this.isInApp = false;
    this.language = this._detectLanguage();
};

PlatformInfo.prototype = Object.create(cleverapps.EventEmitter.prototype);
PlatformInfo.prototype.constructor = PlatformInfo;

PlatformInfo.nativePlatforms = ["microsoft", "gpg", "mygames", "macos"];
PlatformInfo.nativeMobilePlatforms = ["android", "amazon", "ios", "pliega", "rustore", "ios_ch"];

PlatformInfo.prototype.setInfo = function (info) {
    if (info.os !== undefined) {
        this.os = info.os;
    }

    if (info.isMobile !== undefined) {
        this.isMobile = info.isMobile;
    }

    if (info.isInApp !== undefined) {
        this.isInApp = info.isInApp;
    }

    if (info.language !== undefined) {
        this.language = info.language;
    }

    this.trigger("changed");
};

PlatformInfo.prototype._detectLanguage = function () {
    var language = window.navigator.language || window.navigator.browserLanguage;
    if (language) {
        language = language.split("-")[0];

        if (language === "du") {
            return PlatformInfo.LANGUAGE_DUTCH;
        }

        return language;
    }

    return PlatformInfo.LANGUAGE_ENGLISH;
};

PlatformInfo.prototype._detectMobile = function (source) {
    if (PlatformInfo.nativeMobilePlatforms.includes(source)) {
        return true;
    }

    var ua = window.navigator.userAgent.toLowerCase();

    return /mobile|android|iphone|ipad/.test(ua);
};

PlatformInfo.prototype._detectNative = function (source) {
    return PlatformInfo.nativePlatforms.includes(source) || PlatformInfo.nativeMobilePlatforms.includes(source);
};

PlatformInfo.prototype._detectOS = function () {
    var nav = window.navigator;
    var ua = nav.userAgent.toLowerCase();

    var isAndroid = false;
    var iOS = false;
    var uaResult = /android (\d+(?:\.\d+)+)/i.exec(ua) || /android (\d+(?:\.\d+)+)/i.exec(nav.platform);
    if (uaResult) {
        isAndroid = true;
    }
    uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua);
    if (uaResult) {
        iOS = true;
    } else if (/(iPhone|iPad|iPod)/.exec(nav.platform)) {
        iOS = true;
    }

    var osName = PlatformInfo.OS_UNKNOWN;
    if (nav.appVersion.indexOf("Win") !== -1) {
        osName = PlatformInfo.OS_WINDOWS;
    } else if (iOS) {
        osName = PlatformInfo.OS_IOS;
    } else if (nav.appVersion.indexOf("Mac") !== -1) {
        osName = PlatformInfo.OS_OSX;
    } else if (nav.appVersion.indexOf("X11") !== -1 && nav.appVersion.indexOf("Linux") === -1) {
        osName = PlatformInfo.OS_UNIX;
    } else if (isAndroid) {
        osName = PlatformInfo.OS_ANDROID;
    } else if (nav.appVersion.indexOf("Linux") !== -1) {
        osName = PlatformInfo.OS_LINUX;
    }

    return osName;
};

PlatformInfo.OS_UNKNOWN = "Unknown";
PlatformInfo.OS_WINDOWS = "Windows";
PlatformInfo.OS_IOS = "iOS";
PlatformInfo.OS_OSX = "OS X";
PlatformInfo.OS_UNIX = "Unix";
PlatformInfo.OS_ANDROID = "Android";
PlatformInfo.OS_LINUX = "Linux";

PlatformInfo.LANGUAGE_ENGLISH = "en";
PlatformInfo.LANGUAGE_CHINESE = "zh";
PlatformInfo.LANGUAGE_FRENCH = "fr";
PlatformInfo.LANGUAGE_ITALIAN = "it";
PlatformInfo.LANGUAGE_GERMAN = "de";
PlatformInfo.LANGUAGE_SPANISH = "es";
PlatformInfo.LANGUAGE_DUTCH = "nl";
PlatformInfo.LANGUAGE_RUSSIAN = "ru";
PlatformInfo.LANGUAGE_KOREAN = "ko";
PlatformInfo.LANGUAGE_JAPANESE = "ja";
PlatformInfo.LANGUAGE_HUNGARIAN = "hu";
PlatformInfo.LANGUAGE_PORTUGUESE = "pt";
PlatformInfo.LANGUAGE_ARABIC = "ar";
PlatformInfo.LANGUAGE_NORWEGIAN = "no";
PlatformInfo.LANGUAGE_POLISH = "pl";
PlatformInfo.LANGUAGE_LATVIAN = "lv";
PlatformInfo.LANGUAGE_TURKISH = "tr";