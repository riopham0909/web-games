/**
 * Created by slava on 4/21/17.
 */

cleverapps.OKSocial = function () {
    console.log("Choosing html5-ok");

    cleverapps.Social.call(this);
};

cleverapps.OKSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.OKSocial.prototype.constructor = cleverapps.OKSocial;

cleverapps.OKSocial.prototype.isLoggedIn = function () {
    return cleverapps.platform.isConnected(Platform.SOCIAL);
};

cleverapps.OKSocial.prototype.setStatus = function (event, status) {
    if (!cleverapps.platform.isConnected(Platform.PLATFORM)) {
        return;
    }
    console.log("setStatus", event, status);
    FAPI.Client.call({
        method: "sdk.setStatus",
        event: event,
        status: status
    }, cleverapps.platform.createFAPICallback(function (code, data, error) {
        console.log("sdk.setStatus response", JSON.stringify(arguments));

        var logEvent = "set_status_ok";
        if (code !== cleverapps.OKSocial.CODE_SUCCEED) {
            logEvent = "set_status_error";

            if (error && (error.error_msg || error.error_code)) {
                cleverapps.throwAsync("sdk.setStatus event: '" + event + "' status: '" + status + "' error: " + JSON.stringify(error));
            }
        }
        cleverapps.eventLogger.logEvent(logEvent);
    }));
};

cleverapps.OKSocial.prototype._getUserID = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        return;
    }

    return FAPI.Util.getRequestParameters().logged_user_id;
};

cleverapps.OKSocial.prototype.getAccessToken = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        return;
    }

    return "OK_" + FAPI.Util.getRequestParameters().session_key + "_" + FAPI.Util.getRequestParameters().auth_sig;
};

cleverapps.OKSocial.prototype._login = function (callback) {
    callback();
};

cleverapps.OKSocial.prototype._inviteFriends = function (options, callback) {
    cleverapps.platform.listeners.showInvite = function (code, data) {
        if (data === "noUsers") {
            cleverapps.notification.create("inviteFriends.noUsers");
        }

        if (code !== cleverapps.OKSocial.CODE_SUCCEED) {
            callback(cleverapps.CODE_CANCELLED, data);
            return;
        }

        callback(cleverapps.CODE_SUCCEED);
    };

    cleverapps.platform.exitFullscreen(function () {
        FAPI.UI.showInvite(options.message);
    });
};

cleverapps.OKSocial.prototype._request = function (options, callback) {
    if (typeof options.to === "object") {
        options.to = options.to.join(";");
    }

    cleverapps.platform.listeners.showNotification = function (code, data) {
        if (code === "error" && data === "noUsers") {
            callback(cleverapps.CODE_SUCCEED, []);
            return;
        }

        if (code !== cleverapps.OKSocial.CODE_SUCCEED) {
            callback(cleverapps.CODE_CANCELLED, data);
            return;
        }

        data = data.split(",");

        callback(cleverapps.CODE_SUCCEED, data);
    };

    cleverapps.platform.exitFullscreen(function () {
        FAPI.UI.showNotification(options.message, "", options.to);
    });
};

cleverapps.OKSocial.prototype._shareDialog = function (data, callback) {
    var media = [
        {
            "type": "app",
            "text": data.description,
            "images": [{
                "url": data.picture,
                "title": data.name
            }],
            "actions": [
                {
                    "text": data.name,
                    "mark": data.name
                }
            ]
        }
    ];

    // if (cleverapps.config.debugMode) {
    //     console.log(JSON.stringify(media));
    // }

    cleverapps.platform.listeners.postMediatopic = function (code, data) {
        if (code !== cleverapps.OKSocial.CODE_SUCCEED) {
            callback(cleverapps.CODE_CANCELLED, data);
            return;
        }
        callback(cleverapps.CODE_SUCCEED);
    };

    cleverapps.platform.exitFullscreen(function () {
        FAPI.UI.postMediatopic({
            "media": media
        }, true);
    });
};

cleverapps.OKSocial.prototype.loadFriendsPerPage = function (ids, callback) {
    var MAX_FRIENDS = 1000;
    ids = ids.slice(0, MAX_FRIENDS);

    var chunkSize = 100;

    var chunks = [];
    for (var i = 0; i < ids.length; i += chunkSize) {
        chunks.push(ids.slice(i, i + chunkSize));
    }

    var waiting = chunks.length;
    var data = [];

    var onLoaded = function (dataChunk) {
        if (dataChunk !== cleverapps.CODE_CANCELLED) {
            data = data.concat(dataChunk);
        }
        waiting--;

        if (waiting === 0) {
            callback(cleverapps.CODE_SUCCEED, data);
        }
    };

    chunks.forEach(function (chunk) {
        this.aboutUser(chunk, onLoaded, onLoaded);
    }.bind(this));
};

cleverapps.OKSocial.prototype._listFriends = function (callback) {
    FAPI.Client.call({
        method: "friends.getAppUsers"
    }, cleverapps.platform.createFAPICallback(function (code, data, error) {
        if (code !== cleverapps.OKSocial.CODE_SUCCEED) {
            console.log("list friends error: " + error);
            callback(cleverapps.CODE_CANCELLED);
            return;
        }

        var ids = data.uids;

        cleverapps.social.loadFriendsPerPage(ids, callback);
    }));
};

cleverapps.OKSocial.prototype._listInvitableFriends = function (callback) {
    FAPI.Client.call({
        method: "friends.get",
        sort_type: "PRESENT"
    }, cleverapps.platform.createFAPICallback(function (code, data, error) {
        if (code !== cleverapps.OKSocial.CODE_SUCCEED) {
            console.log("list ivitable friends error: " + error);
            callback(cleverapps.CODE_CANCELLED);
            return;
        }

        var allIds = data;

        FAPI.Client.call({
            method: "friends.getAppUsers"
        }, cleverapps.platform.createFAPICallback(function (code, data, error) {
            if (code !== cleverapps.OKSocial.CODE_SUCCEED) {
                console.log("list friends error: " + error);
                callback(cleverapps.CODE_CANCELLED);
                return;
            }

            var inAppIds = data.uids;

            cleverapps.social.loadFriendsPerPage(cleverapps.substract(allIds, inAppIds), callback);
        }));
    }));
};

cleverapps.OKSocial.formatUserData = function (user) {
    // Replace https://i.mycdn.me/res/stub_128x128.gif & https://itest.mycdn.me/res/stub_128x128.gif for our own stub image
    if (user.pic128x128.indexOf("stub_128x128.gif") !== -1) {
        user.pic128x128 = "";
    }
    // https://api.ok.ru/img/stub/user/male/128.png
    if (user.pic128x128.indexOf("stub/user") !== -1) {
        user.pic128x128 = "";
    }

    return {
        id: user.uid,
        name: user.first_name + " " + user.last_name,
        first_name: user.first_name,
        picture: {
            data: {
                url: user.pic128x128
            }
        }
    };
};

cleverapps.OKSocial.prototype._aboutUser = function (userId, callback, onFailure) {
    var isSingle = !Array.isArray(userId);

    var onLoadedUser = function (code, data, error) {
        if (code !== cleverapps.OKSocial.CODE_SUCCEED) {
            if (onFailure) {
                onFailure(cleverapps.CODE_CANCELLED, error);
            }
            return;
        }

        var users = data.map(function (userData) {
            return cleverapps.OKSocial.formatUserData(userData);
        });

        if (isSingle) {
            callback(users[0]);
        } else {
            callback(users);
        }
    };

    if (!isSingle) {
        userId = userId.join(",");
    }

    FAPI.Client.call({
        uids: userId,
        fields: "first_name,last_name,uid,pic128x128",
        method: "users.getInfo"
    }, cleverapps.platform.createFAPICallback(onLoadedUser));
};

cleverapps.OKSocial.prototype.getName = function () {
    return Messages.get("ok");
};

cleverapps.OKSocial.prototype._aboutMe = function (callback) {
    // console.log('about me: ' + cleverapps.platform.getUserID())
    this.aboutUser(cleverapps.platform.getUserID(), callback);
};

cleverapps.OKSocial.CODE_SUCCEED = "ok";
