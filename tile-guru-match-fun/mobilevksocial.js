/**
 * Created by slava on 4/21/17.
 */

cleverapps.MobileVkSocial = function () {
    console.log("Choosing vkBridge-mobile");

    cc.sys.openURL = function (url) {
        var newlink = document.createElement("a");
        newlink.setAttribute("target", "_blank");
        newlink.setAttribute("href", url);
        newlink.click();
    };

    cleverapps.VKSocial.call(this);
};

cleverapps.MobileVkSocial.prototype = Object.create(cleverapps.VKSocial.prototype);
cleverapps.MobileVkSocial.prototype.constructor = cleverapps.MobileVkSocial;

cleverapps.MobileVkSocial.getPlatfrom = function () {
    return cleverapps.getRequestParameters().platform;
};

cleverapps.MobileVkSocial.prototype.showLeaderBoardBox = function (options, callback) {
    this.api("VKWebAppShowLeaderBoardBox", {
        user_result: options.userResult
    }, callback);
};

cleverapps.MobileVkSocial.prototype._listInvitableFriends = function (callback) {
    callback(cleverapps.CODE_SUCCEED, []);
};
