/**
 * Created by slava on 4/21/17.
 */

cleverapps.MyMailRuSocial = function () {
    if (!(this instanceof cleverapps.MobileMyMailRuSocial)) {
        console.log("Choosing html5-MyMailRu");
    }

    cleverapps.Social.call(this);
};

cleverapps.MyMailRuSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.MyMailRuSocial.prototype.constructor = cleverapps.MyMailRuSocial;

cleverapps.MyMailRuSocial.prototype._connect = function (callback) {
    this.listeners = {
        friendsInvitation: function () {},
        friendsRequest: function () {},
        streamPublish: function () {}
    };

    mailru.events.listen(mailru.app.events.friendsInvitation, function (event) {
        this.listeners.friendsInvitation(event);
    }.bind(this));

    mailru.events.listen(mailru.app.events.friendsRequest, function (event) {
        this.listeners.friendsRequest(event);
    }.bind(this));

    mailru.events.listen(mailru.common.events.streamPublish, function (event) {
        this.listeners.streamPublish(event);
    }.bind(this));

    callback(Platform.STATUS_CONNECTED);
};

cleverapps.MyMailRuSocial.prototype.isLoggedIn = function () {
    return true;
};

cleverapps.MyMailRuSocial.prototype._getUserID = function () {
    return cleverapps.getRequestParameters().vid;
};

cleverapps.MyMailRuSocial.prototype.getAccessToken = function () {
    var names = [], params = cleverapps.getRequestParameters();
    for (var name in params) {
        if (name !== "sig") {
            names.push(name);
        }
    }
    names.sort();
    var str = "";
    for (var i = 0; i < names.length; i++) {
        str += names[i] + "=" + params[names[i]];
    }
    return "MM_" + params.sig + "_" + str;
};

cleverapps.MyMailRuSocial.prototype._login = function (callback) {
    callback();
};

cleverapps.MyMailRuSocial.prototype._inviteFriends = function (options, callback) {
    this.listeners.friendsInvitation = function (event) {
        if (event.status === "opened") {
            return;
        }
        callback(event.data && event.data.length ? cleverapps.CODE_SUCCEED : cleverapps.CODE_CANCELLED);
    };

    cleverapps.platform.exitFullscreen(function () {
        mailru.app.friends.invite({ text: options.message });
    });
};

cleverapps.MyMailRuSocial.prototype._request = function (options, callback) {
    this.listeners.friendsRequest = function (event) {
        if (event.status === "opened") {
            return;
        }
        if (event.data && event.data.length) {
            callback(cleverapps.CODE_SUCCEED, event.data);
        } else {
            callback(cleverapps.CODE_CANCELLED);
        }
    };

    cleverapps.platform.exitFullscreen(function () {
        mailru.app.friends.request({
            text: options.message,
            image_url: Share.getData("default").picture,
            friends: options.to
        });
    });
};

cleverapps.MyMailRuSocial.prototype._shareDialog = function (data, callback) {
    this.listeners.streamPublish = function (event) {
        if (event.status === "opened") {
            return;
        }
        if (event.status === "publishSuccess") {
            callback(cleverapps.CODE_SUCCEED);
        } else {
            console.log(event.status);
            callback(cleverapps.CODE_CANCELLED);
        }
    };
    var postData = {
        title: data.name,
        text: data.description,
        img_url: data.picture
    };

    cleverapps.platform.exitFullscreen(function () {
        mailru.common.stream.post(postData);
    });
};

cleverapps.MyMailRuSocial.prototype._listFriends = function (callback) {
    mailru.common.friends.getAppUsers(function (list) {
        var friends = [];
        for (var i = 0; i < list.length; i++) {
            friends.push(cleverapps.MyMailRuSocial.formatUserData(list[i]));
        }
        callback(cleverapps.CODE_SUCCEED, friends);
    }, true);
};

cleverapps.MyMailRuSocial.prototype._listInvitableFriends = function (callback) {
    mailru.common.friends.getExtended(function (list) {
        var friends = [];
        for (var i = 0; i < list.length; i++) {
            if (!list[i].app_installed) {
                friends.push(cleverapps.MyMailRuSocial.formatUserData(list[i]));
            }
        }
        callback(cleverapps.CODE_SUCCEED, friends);
    });
};

cleverapps.MyMailRuSocial.formatUserData = function (user) {
    return {
        id: user.uid,
        name: user.first_name + " " + user.last_name,
        first_name: user.first_name,
        picture: {
            data: {
                url: user.pic_128
            }
        }
    };
};

cleverapps.MyMailRuSocial.prototype._aboutUser = function (userId, callback, onFailure) {
    var isSingle = !Array.isArray(userId);

    mailru.common.users.getInfo(function (data) {
        if (data.error) {
            if (onFailure) {
                onFailure(cleverapps.CODE_FAILED, data.error);
            }
            return;
        }

        if (!data || typeof data.map !== "function") {
            cleverapps.throwAsync("MailRU aboutUser response - " + JSON.stringify(data));
        }

        var users = data.map(function (userData) {
            return cleverapps.MyMailRuSocial.formatUserData(userData);
        });
        if (isSingle) {
            callback(users[0]);
        } else {
            callback(users);
        }
    }, userId);
};

cleverapps.MyMailRuSocial.prototype._aboutMe = function (callback) {
    // console.log('about me: ' + cleverapps.platform.getUserID())
    this.aboutUser(cleverapps.platform.getUserID(), callback);
};