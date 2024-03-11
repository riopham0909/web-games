/**
 * Created by anatoly on 01/09/2023
 */

cleverapps.WortalSocial = function () {
    console.log("Choosing Wortal Social");

    cleverapps.Social.call(this);
};

cleverapps.WortalSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.WortalSocial.prototype.constructor = cleverapps.WortalSocial;

cleverapps.WortalSocial.prototype._getUserID = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        return;
    }

    return Wortal.player.getID();
};

cleverapps.WortalSocial.prototype._login = function (callback) {
    callback();
};

cleverapps.WortalSocial.prototype.isLoggedIn = function () {
    return !!this._getUserID();
};

cleverapps.WortalSocial.prototype._aboutMe = function (callback) {
    callback({
        currency: {
            user_currency: "USD"
        },
        name: Wortal.player.getName(),
        first_name: Wortal.player.getName(),
        picture: {
            data: {
                url: Wortal.player.getPhoto()
            }
        }
    });
};

cleverapps.WortalSocial.prototype._request = function (options, callback) {
    Wortal.context.createAsync(options.to[0]).then(function () {
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

cleverapps.WortalSocial.prototype._update = function (options, callback) {
    this.getBase64Image(Share.getData("wortal").picture, function (err, image) {
        if (err) {
            console.log(err);
            callback(cleverapps.CODE_FAILED);
        } else {
            callback(cleverapps.CODE_SUCCEED);
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.REQUEST);
            Wortal.context.updateAsync({
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

cleverapps.WortalSocial.prototype._inviteFriends = function (data, callback) {
    this.getBase64Image(Share.getData("wortal").picture, function (err, image) {
        if (err) {
            console.log(err);
            callback(cleverapps.CODE_FAILED);
        } else {
            Wortal.context.inviteAsync({
                image: image,
                text: data.message,
                cta: data.title
            }).then(function () {
                callback(cleverapps.CODE_SUCCEED);
            }).catch(function (e) {
                console.log(e);
                callback(cleverapps.CODE_FAILED);
            });
        }
    });
};

cleverapps.WortalSocial.prototype._shareDialog = function (data, callback) {
    this.getBase64Image(data.picture, function (err, image) {
        if (err) {
            console.log(err);
            callback(cleverapps.CODE_FAILED);
        } else {
            cleverapps.countPendingRequests(Wortal.context.shareAsync({
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

cleverapps.WortalSocial.prototype._listFriends = function (callback) {
    Wortal.player.getConnectedPlayersAsync()
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

cleverapps.WortalSocial.prototype._listInvitableFriends = function (callback) {
    callback(cleverapps.CODE_SUCCEED, []);
};

cleverapps.WortalSocial.prototype.getAccessToken = function () {
    return "wortal";
};