/**
 * Created by vladislav on 9/6/2022
 */

var Mygames = function (options) {
    Platform.call(this, options, "mygames");
};

Mygames.prototype = Object.create(Platform.prototype);
Mygames.prototype.constructor = Mygames;

Mygames.prototype.canReview = function () {
    return true;
};

Mygames.prototype._requestReview = function () {
    window.electronApi.showReview(cleverapps.config.mygames.gcId);

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.SOCIAL_REVIEW + true);
};

Mygames.prototype.isFullscreenAvailable = function () {
    return !!this.getFullscreener();
};

Mygames.prototype.getSuggestedLanguage = function () {
    var locale = (new URLSearchParams(window.location.search).get("ui_locale"));
    switch (locale) {
        case "en-US":
            return [PlatformInfo.LANGUAGE_ENGLISH];
        case "de-DE":
            return [PlatformInfo.LANGUAGE_DUTCH];
        case "es-ES":
            return [PlatformInfo.LANGUAGE_SPANISH];
        case "fr-FR":
            return [PlatformInfo.LANGUAGE_FRENCH];
        case "pl-PL":
            return [PlatformInfo.LANGUAGE_POLISH];
        case "tr-TR":
            return [PlatformInfo.LANGUAGE_TURKISH];
        case "ar-AA":
            return [PlatformInfo.LANGUAGE_ARABIC];
        case "ru-RU":
        default:
            return [PlatformInfo.LANGUAGE_RUSSIAN];
    }
};