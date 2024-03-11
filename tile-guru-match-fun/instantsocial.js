/**
 * Created by slava on 4/21/17.
 */

cleverapps.InstantSocial = function () {
    console.log("Choosing Instant-facebook");

    cleverapps.Social.call(this);

    SelectFriendWindow.MAX_SELECTED = 1;
};

cleverapps.InstantSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.InstantSocial.prototype.constructor = cleverapps.InstantSocial;

cleverapps.InstantSocial.prototype._update = function (options, callback) {
    this.getBase64Image(Share.getData("default").picture, function (err, image) {
        if (err) {
            console.log(err);
            callback(cleverapps.CODE_FAILED);
        } else {
            callback(cleverapps.CODE_SUCCEED);
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.REQUEST);
            FBInstant.updateAsync({
                action: "CUSTOM",
                image: image,
                text: {
                    default: options.message
                },
                template: options.template,
                strategy: "IMMEDIATE",
                notification: "PUSH"
            });
        }
    });
};

cleverapps.InstantSocial.prototype.isLoggedIn = function () {
    return !!this._getUserID();
};

cleverapps.InstantSocial.prototype._getUserID = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        return;
    }

    return FBInstant.player.getID();
};

cleverapps.InstantSocial.prototype._request = function (options, callback) {
    FBInstant.context.createAsync(options.to[0]).then(function () {
        this._update({
            template: "request",
            message: options.message
        }, callback);
    }.bind(this)).catch(function (error) {
        console.log("send request to " + options.to[0] + " failed", error);

        if (["SAME_CONTEXT", "INVALID_PARAM"].indexOf(error.code) !== -1) {
            callback(cleverapps.CODE_SUCCEED);
            return;
        }

        callback(cleverapps.CODE_FAILED);
    });
};

cleverapps.InstantSocial.prototype._inviteFriends = function (data, callback) {
    this.getBase64Image(Share.getData("default").picture, function (err, image) {
        if (err) {
            console.log(err);
            callback(cleverapps.CODE_FAILED);
        } else {
            FBInstant.inviteAsync({
                image: image,
                text: data.message,
                cta: data.title
            }).then(function () {
                callback(cleverapps.CODE_SUCCEED);
            }).catch(function () {
                callback(cleverapps.CODE_FAILED);
            });
        }
    });
};

cleverapps.InstantSocial.prototype._shareDialog = function (data, callback) {
    this.getBase64Image(data.picture, function (err, image) {
        if (err) {
            console.log(err);
            callback(cleverapps.CODE_FAILED);
        } else {
            cleverapps.countPendingRequests(FBInstant.shareAsync({
                image: image,
                text: data.description,
                cta: data.title,
                shareDestination: ["NEWSFEED"],
                switchContext: false
            })).then(function () {
                callback(cleverapps.CODE_SUCCEED);
            }).catch(function () {
                callback(cleverapps.CODE_FAILED);
            });
        }
    });
};

cleverapps.InstantSocial.prototype._listFriends = function (callback) {
    FBInstant.player.getConnectedPlayersAsync()
        .then(function (players) {
            var list = players.map(function (player) {
                return {
                    id: player.getID(),
                    first_name: player.getName(),
                    picture: {
                        data: {
                            url: player.getPhoto()
                        }
                    }
                };
            });

            callback(cleverapps.CODE_SUCCEED, list);
        })
        .catch(function () {
            callback(cleverapps.CODE_FAILED);
        });
};

cleverapps.InstantSocial.prototype._listInvitableFriends = function (callback) {
    callback(cleverapps.CODE_SUCCEED, []);
};

cleverapps.InstantSocial.prototype._aboutMe = function (callback) {
    callback({
        currency: {
            user_currency: "USD"
        },
        name: FBInstant.player.getName(),
        first_name: FBInstant.player.getName(),
        picture: {
            data: {
                url: FBInstant.player.getPhoto()
            }
        }
    });
};

cleverapps.InstantSocial.prototype.getAccessToken = function () {
    return "instant";
};

cleverapps.InstantSocial.prototype.getName = function () {
    return Messages.get("facebook");
};