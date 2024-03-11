/**
 * Created by slava on 4/21/17.
 */

cleverapps.DraugiemSocial = function () {
    console.log("Choosing html5-draugiem");

    cleverapps.Social.call(this);
};

cleverapps.DraugiemSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.DraugiemSocial.prototype.constructor = cleverapps.DraugiemSocial;

cleverapps.DraugiemSocial.prototype._connect = function (callback) {
    // eslint-disable-next-line camelcase
    draugiem_callback_url = cleverapps.platform.getExternalUrl("cleverapps/res/callback.html");
    // eslint-disable-next-line camelcase
    draugiem_domain = "www.draugiem.lv";

    var tokenRetrieved = function (token) {
        this.accessToken = token;
        cleverapps.setUrlHash({ saved_token: token });
        this.api("userdata", {}, function (code, result) {
            this.user = cleverapps.DraugiemSocial.formatUserData(cleverapps.values(result.users)[0]);
            callback(code === cleverapps.CODE_SUCCEED ? Platform.STATUS_CONNECTED : Platform.STATUS_DISCONNECTED);
        }.bind(this));
    }.bind(this);

    var authCode = cleverapps.getRequestParameters().dr_auth_code;
    var oldData = cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.DRAUGIEM_AUTH_DATA);

    if (oldData && oldData.code === authCode) {
        tokenRetrieved(oldData.token);
    } else {
        this.api("authorize", {
            code: authCode
        }, function (code, result) {
            if (!result || result.error || !result.apikey) {
                if (result && result.error && result.error.code === 106) {
                    var tokenFromHash = cleverapps.getRequestParameters(window.location.hash).saved_token;
                    if (tokenFromHash) {
                        tokenRetrieved(tokenFromHash);
                        return;
                    }
                }

                var debugData = JSON.stringify({
                    arguments: arguments,
                    auth_code: authCode
                });

                cleverapps.throwAsync("draugiem authorize empty result " + debugData);
                this.user = cleverapps.DraugiemSocial.formatUserData({ uid: "1" });

                callback(Platform.STATUS_DISCONNECTED);
            } else {
                this.accessToken = result.apikey;
                this.user = cleverapps.DraugiemSocial.formatUserData(result.users[result.uid]);

                cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.DRAUGIEM_AUTH_DATA, {
                    code: authCode,
                    token: this.accessToken
                });

                cleverapps.setUrlHash({ saved_token: this.accessToken });

                callback(Platform.STATUS_CONNECTED);
            }
        }.bind(this));
    }
};

cleverapps.DraugiemSocial.prototype.api = function (apiMethod, params, callback) {
    params.action = apiMethod;
    if (this.accessToken) {
        params.apikey = this.accessToken;
    }

    cleverapps.RestClient.post("/draugiem", params, function (response) {
        if (response.error) {
            console.log("Error response: ", response);
            callback(cleverapps.CODE_FAILED, response);
        } else {
            console.log("Success api response: ", response);
            callback(cleverapps.CODE_SUCCEED, response);
        }
    });
};

cleverapps.DraugiemSocial.prototype.isLoggedIn = function () {
    return true;
};

cleverapps.DraugiemSocial.prototype._getUserID = function () {
    return this.user && this.user.id;
};

cleverapps.DraugiemSocial.prototype.getAccessToken = function () {
    return "DRG_" + this.accessToken;
};

cleverapps.DraugiemSocial.prototype._login = function (callback) {
    callback();
};

cleverapps.DraugiemSocial.prototype.sendActivity = function (activityType, data) {
    if (this.lastActivitySent && Date.now() - this.lastActivitySent < cleverapps.parseInterval("1 day")) {
        return;
    }

    var config = cleverapps.Social.ACTIVITIES_CONFIG[activityType];
    if (config.probability > Math.random()) {
        var message = cleverapps.Random.mathChoose(config.messages);

        var params = {
            prefix: Messages.get(message.title),
            text: Messages.get(message.body, data),
            link: cleverapps.config.deployment
        };
        cleverapps.social.api("add_activity", params, function (code, result) {
            if (result && result.status === "OK") {
                this.lastActivitySent = Date.now();
            }
        }.bind(this));
    }
};

cleverapps.DraugiemSocial.prototype._inviteFriends = function (options, callback) {
    draugiemSendInvite(options.message, "", function (res) {
        if (res) {
            callback(cleverapps.CODE_SUCCEED);
        } else {
            callback(cleverapps.CODE_CANCELLED);
        }
    });
};

cleverapps.DraugiemSocial.prototype.requestToOne = function (uid, options, callback) {
    cleverapps.platform.exitFullscreen(function () {
        var message = options.message + "\n" + cleverapps.platform.getGameUrl();
        draugiemSendMessage(uid, options.title, message, function (sent) {
            if (sent) {
                callback(cleverapps.CODE_SUCCEED);
            } else {
                callback(cleverapps.CODE_FAILED);
            }
        });
    });
};

cleverapps.DraugiemSocial.prototype._request = function (options, callback) {
    var to = options.to;
    if (!Array.isArray(to)) {
        to = [to];
    }

    var sended = [];
    var sendOneRequest = function (id) {
        if (id === to.length) {
            callback(sended.length > 0 ? cleverapps.CODE_SUCCEED : cleverapps.CODE_CANCELLED, sended);
        } else {
            this.requestToOne(to[id], options, function (response) {
                if (response === cleverapps.CODE_SUCCEED) {
                    sended.push(to[id]);
                }
                setTimeout(function () {
                    sendOneRequest(id + 1);
                }, 500);
            });
        }
    }.bind(this);
    sendOneRequest(0);
};

cleverapps.DraugiemSocial.prototype._shareDialog = function (data, callback) {
    cleverapps.platform.exitFullscreen(function () {
        draugiemSay(data.name, cleverapps.platform.getGameUrl(), Messages.get("PlayNow"), data.description, function (added) {
            if (added) {
                callback(cleverapps.CODE_SUCCEED);
            } else {
                callback(cleverapps.CODE_FAILED);
            }
        });
    });
};

cleverapps.DraugiemSocial.prototype.listFriendsByApp = function () {

};

cleverapps.DraugiemSocial.prototype._listFriends = function (callback) {
    this.api("app_friends", {}, function (code, responce) {
        if (code === cleverapps.CODE_SUCCEED) {
            var friendsData = [];
            if (responce.total > 0) {
                friendsData = cleverapps.values(responce.users).map(cleverapps.DraugiemSocial.formatUserData);
            }
            callback(cleverapps.CODE_SUCCEED, friendsData);
        } else {
            callback(cleverapps.CODE_FAILED);
        }
    });
};

cleverapps.DraugiemSocial.prototype._listInvitableFriends = function (callback) {
    callback();
};

cleverapps.DraugiemSocial.formatUserData = function (userData) {
    return {
        id: "" + userData.uid,
        name: userData.surname + " " + userData.name,
        first_name: userData.name,
        picture: {
            data: {
                url: userData.img
            }
        }
    };
};

cleverapps.DraugiemSocial.prototype._aboutMe = function (callback) {
    callback(this.user);
};