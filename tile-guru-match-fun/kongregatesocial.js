/**
 * Created by Aleksandr on 01.02.2023
 */

cleverapps.KongregateSocial = function () {
    console.log("Choosing kongregate");

    cleverapps.Social.call(this);
};

cleverapps.KongregateSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.KongregateSocial.prototype.constructor = cleverapps.KongregateSocial;

cleverapps.KongregateSocial.prototype.api = function (apiMethod, params, callback) {
    cleverapps.RestClient.get("https://api.kongregate.com/api/" + apiMethod, params, function (response) {
        if (response.error) {
            console.log("Error response: ", response);
            callback(cleverapps.CODE_FAILED, response);
        } else {
            console.log("Success api response: ", response);
            callback(cleverapps.CODE_SUCCEED, response);
        }
    });
};

cleverapps.KongregateSocial.prototype._connect = function (callback) {
    this.resendAchievements();

    callback(Platform.STATUS_CONNECTED);
};

cleverapps.KongregateSocial.prototype._login = function () {
    kongregate.services.showRegistrationBox();
};

cleverapps.KongregateSocial.prototype._aboutMe = function (callback) {
    callback({
        id: cleverapps.platform.getUserID(),
        name: kongregate.services.getUsername(),
        first_name: kongregate.services.getUsername()
    });
};

cleverapps.KongregateSocial.prototype._inviteFriends = function (options, callback) {
    kongregate.services.showInvitationBox({
        content: options.message,
        filter: "not_played"
    });
    callback(cleverapps.CODE_SUCCEED);
};

cleverapps.KongregateSocial.prototype._shareDialog = function (options, callback) {
    var data = {
        content: options.description,
        image_uri: options.picture
    };

    kongregate.services.showFeedPostBox(data, function (result) {
        console.log("post callback", result);
        if (result.success) {
            callback(cleverapps.CODE_SUCCEED);
        } else {
            callback(cleverapps.CODE_FAILED);
        }
    });
};

cleverapps.KongregateSocial.prototype.sendMessage = function (options, callback) {
    console.log(options, callback);
    // kongregate.services.privateMessage("You just did something really great!");
};

cleverapps.KongregateSocial.prototype.markAchievement = function (data) {
    if (data.kongId !== undefined) {
        kongregate.stats.submit(data.kongId, 1);
    }
};

cleverapps.KongregateSocial.prototype.resendAchievements = function () {
    // achievements are rewarded only after platform creates their badges; resend to assure awarding when badge is ready
    if (cleverapps.achievements) {
        cleverapps.achievements.listCompleted().forEach(function (achievement) {
            this.markAchievement(achievement.getConfig());
        }.bind(this));
    }
};

cleverapps.KongregateSocial.prototype.getCode = function () {
    return cleverapps.KongregateSocial.CODE;
};

cleverapps.KongregateSocial.prototype.getAccessToken = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        return;
    }

    return "KONGREGATE_" + kongregate.services.getGameAuthToken();
};

cleverapps.KongregateSocial.prototype.isLoggedIn = function () {
    return cleverapps.platform.isConnected(Platform.SOCIAL) && kongregate.services.isGuest() !== true;
};

cleverapps.KongregateSocial.prototype._getUserID = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        return;
    }

    return "" + kongregate.services.getUserId();
};

cleverapps.KongregateSocial.CODE = "kongregate";