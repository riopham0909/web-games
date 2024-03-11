/**
 * Created by vladislav on 9/6/2022
 */

var MobileVk = function (options) {
    VKPlatform.call(this, options, "mobile_vk");
};

MobileVk.prototype = Object.create(VKPlatform.prototype);
MobileVk.prototype.constructor = MobileVk;

MobileVk.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_RUSSIAN];
};

MobileVk.prototype._canCreateShortcut = function () {
    return false;
};