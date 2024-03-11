/**
 * Created by slava on 4/21/17.
 */

cleverapps.FotoStranaSocial = function () {
    console.log("Choosing fotostrana");

    cleverapps.Social.call(this);
};

cleverapps.FotoStranaSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.FotoStranaSocial.prototype.constructor = cleverapps.FotoStranaSocial;

cleverapps.FotoStranaSocial.prototype.isLoggedIn = function () {
    return true;
};

cleverapps.FotoStranaSocial.prototype.fromSocialUserId = function (socialUserId) {
    return "FS_" + socialUserId;
};

cleverapps.FotoStranaSocial.prototype.toSocialUserId = function (ourUserId) {
    return ourUserId.substr(3);
};

cleverapps.FotoStranaSocial.prototype._getUserID = function () {
    return this.fromSocialUserId(cleverapps.getRequestParameters().viewerId);
};

cleverapps.FotoStranaSocial.prototype.getAccessToken = function () {
    return "FS_" + cleverapps.getRequestParameters().authKey;
};

cleverapps.FotoStranaSocial.prototype._login = function (callback) {
    callback();
};

cleverapps.FotoStranaSocial.prototype._inviteFriends = function (options, callback) {
    cleverapps.platform.exitFullscreen(function () {
        FSClient.event("invite", function (response) {
            callback(response.send ? cleverapps.CODE_SUCCEED : cleverapps.CODE_CANCELLED);
        });
    });
};

cleverapps.FotoStranaSocial.prototype._request = function (options, callback) {
    if (typeof options.to !== "object") {
        options.to = [options.to];
    }
    var uids = [];
    options.to.forEach(function (uid) {
        uids.push(this.toSocialUserId(uid));
    }.bind(this));

    cleverapps.platform.exitFullscreen(function () {
        FSClient.event("sendMessageAndInvite", function (response) {
            callback(response.messSent || response.invSent ? cleverapps.CODE_SUCCEED : cleverapps.CODE_CANCELLED);
        }, {
            message: options.message,
            customIds: uids.join(",")
        });
    });
};

cleverapps.FotoStranaSocial.prototype._shareDialog = function (data, callback) {
    cleverapps.platform.exitFullscreen(function () {
        FSClient.event("postUserEventOnWall", function (response) {
            callback(response.result === "success" ? cleverapps.CODE_SUCCEED : cleverapps.CODE_CANCELLED);
        }, {
            title: data.title,
            text: data.description,
            imgUrl: data.picture
        });
    });
};

cleverapps.FotoStranaSocial.prototype.loadUsersData = function (ids, callback) {
    if (!ids || !ids.length) {
        callback(cleverapps.CODE_CANCELLED, []);
        return;
    }

    FSClient.api("User.getProfiles", {
        userIds: ids.join(","),
        fields: "user_name, user_lastname, photo_small"
    }, function (data) {
        var res = [];
        if (data.response) {
            for (var id in data.response) {
                res.push(this.formatUserData(data.response[id]));
            }
            callback(cleverapps.CODE_SUCCEED, res);
            return;
        }
        callback(cleverapps.CODE_FAILED, res);
    }.bind(this));
};

cleverapps.FotoStranaSocial.prototype._listFriends = function (callback) {
    FSClient.api("User.getAppFriends", {
        appId: cleverapps.config.fotostrana.appId,
        limit: 500
    }, function (data) {
        this.loadUsersData(data.response, callback);
    }.bind(this));
};

cleverapps.FotoStranaSocial.prototype._listInvitableFriends = function (callback) {
    FSClient.api("User.getFriends", {
        limit: 200
    }, function (data) {
        if (data.response && data.response.length) {
            var allIds = data.response;

            FSClient.api("User.getAppFriends", {
                appId: cleverapps.config.fotostrana.appId,
                limit: 500
            }, function (data) {
                if (data.response && data.response.length) {
                    allIds = cleverapps.substract(allIds, data.response);
                }
                this.loadUsersData(allIds, callback);
            }.bind(this));
        }
    }.bind(this));
};

cleverapps.FotoStranaSocial.prototype.formatUserData = function (user) {
    return {
        id: this.fromSocialUserId(user.user_id),
        name: user.user_name + " " + user.user_lastname,
        first_name: user.user_name,
        picture: {
            data: {
                url: user.photo_small
            }
        }
    };
};

cleverapps.FotoStranaSocial.prototype._aboutMe = function (callback) {
    this.loadUsersData([this.toSocialUserId(cleverapps.platform.getUserID())], function (code, data) {
        if (code === cleverapps.CODE_SUCCEED && data.length) {
            callback(data[0]);
        }
    });
};