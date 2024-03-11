/**
 * Created by iamso on 21.01.19.
 */

cleverapps.SPMobageSocial = function () {
    console.log("Choosing sp-mobage");

    cleverapps.MobageSocial.call(this);

    this.clientData = {
        clientId: cleverapps.config.mbga.appId + "-4",
        state: "mobage-connect_" + Math.random().toString(36).slice(-16),
        code: null,
        connected: false,
        platformLogin: false
    };

    var host = cleverapps.config.deployment;
    this.clientData.redirectUrl = host + "/publish/html5" + (cleverapps.config.debugMode ? "-staging" : "") + "/index.html";

    cleverapps.timeouts.setInterval(this.periodicCheck.bind(this), cleverapps.parseInterval(cleverapps.SPMobageSocial.CHECK_STATUS_INTERVAL));
};

cleverapps.SPMobageSocial.prototype = Object.create(cleverapps.MobageSocial.prototype);
cleverapps.SPMobageSocial.prototype.constructor = cleverapps.SPMobageSocial;

cleverapps.SPMobageSocial.prototype.needTokenRefresh = function () {
    if (this.clientData.token && this.clientData.token.expireTime) {
        return this.clientData.token.expireTime <= Date.now();
    }
    return true;
};

cleverapps.SPMobageSocial.prototype.checkAccessToken = function (callback) {
    callback = callback || function () {};

    var sendRequest = function (params) {
        var paramsArray = [];
        for (var paramName in params) {
            // eslint-disable-next-line no-prototype-builtins
            if (params.hasOwnProperty(paramName)) {
                paramsArray.push(paramName + "=" + params[paramName]);
            }
        }
        cleverapps.RestClient.get(params.path + "?" + paramsArray.join("&"), {}, function (response) {
            this.clientData.token.accessToken = response.accessToken;
            this.clientData.token.refreshToken = response.refreshToken;
            this.clientData.token.expireTime = Date.now() + (response.expiresIn * 1000);
            // console.log('new accessToken', this.clientData.token);
            callback();
        }.bind(this));
    }.bind(this);

    var params = {
        redirect_uri: this.clientData.redirectUrl
    };

    if (!this.clientData.token) {
        this.clientData.token = {};
        params.path = "/spmbgatoken/get";
        params.code = this.clientData.code;
        sendRequest(params);
    } else if (this.needTokenRefresh()) {
        params.path = "/spmbgatoken/refresh";
        params.refresh_token = this.clientData.token.refreshToken;
        sendRequest(params);
    } else {
        callback();
    }
};

cleverapps.SPMobageSocial.prototype._connect = function (callback) {
    this.loggedIn = false;

    this.checkLoginStatus(callback);
};

cleverapps.SPMobageSocial.prototype.getPlayerInfo = function (callback) {
    var params = {
        userId: "@me",
        groupId: "@self",
        fields: ["id", "displayName", "thumbnailUrl"]
    };

    mobage.api.people.get(params, function (error, result) {
        if (error) {
            console.log("Failed requesting user info", error);

            callback(Platform.STATUS_DISCONNECTED);
        } else {
            this.user = cleverapps.SPMobageSocial.formatUserData(result);

            callback(Platform.STATUS_CONNECTED);
        }
    }.bind(this));
};

cleverapps.SPMobageSocial.prototype._login = function (callback) {
    callback();
};

cleverapps.SPMobageSocial.prototype.checkLoginStatus = function (callback) {
    callback = callback || function () {};

    var afterLogin = function () {
        this.loggedIn = true;
        this.getPlayerInfo(callback);
    }.bind(this);

    try {
        mobage.oauth.getConnectedStatus({ state: this.clientData.state }, function (err, result) {
            if (err) {
                this.clientData.platformLogin = err.login;
                this.clientData.connected = err.connected;

                this.processAutoLogin(afterLogin);
            } else {
                this.clientData.platformLogin = true;
                this.clientData.connected = true;
                this.clientData.code = result.response.code;

                afterLogin();
            }
        }.bind(this));
    } catch (e) {
        console.log("Get connect status error", e);
        callback(Platform.STATUS_DISCONNECTED);
    }
};

cleverapps.SPMobageSocial.prototype.periodicCheck = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        return;
    }

    if (!this.checkInProcess) {
        this.checkInProcess = true;
        try {
            mobage.oauth.getConnectedStatus({ state: this.clientData.state }, function (err, result) {
                this.checkInProcess = false;

                if (result) {
                    this.clientData.code = result.response.code;
                    this.checkAccessToken();
                }
            }.bind(this));
        } catch (e) {
            this.checkInProcess = false;
            console.log("Get connect status error", e);
        }
    }
};

cleverapps.SPMobageSocial.prototype.processAutoLogin = function (callback) {
    var waitingList = ResourceProcessor.calcAlwaysNeed();

    var interval = setInterval(function () {
        if (!cleverapps.bundleLoader.isLoaded(waitingList)) {
            return;
        }

        clearInterval(interval);

        var layer = this.createAutoLoginScreen(callback);
        layer.updateSize = function () {
            var newSize = cleverapps.UI.getSceneSize();
            layer.setContentSize2(newSize);
            layer.buttonNode.setPositionRound(newSize.width / 2, newSize.height / 2);
        };
    }.bind(this), 300);
};

cleverapps.SPMobageSocial.prototype.createAutoLoginScreen = function (callback) {
    var size = cleverapps.UI.getSceneSize();
    var overlay = new cc.LayerColor(cleverapps.styles.COLORS.WHITE, size.width, size.height);
    cleverapps.scenes.getRunningScene().addChild(overlay, 9999);

    var buttonNode = overlay.buttonNode = new SpPlatformButtons(size.width, function () {
        overlay.removeFromParent();
        callback();
    });

    overlay.addChild(buttonNode);
    buttonNode.setPositionRound(size.width / 2, size.height / 2);

    return overlay;
};

cleverapps.SPMobageSocial.prototype.isLoggedIn = function () {
    return this.loggedIn;
};

cleverapps.SPMobageSocial.formatUserData = function (user) {
    return {
        id: user.id,
        name: user.displayName,
        first_name: user.displayName,
        picture: {
            data: {
                url: cleverapps.SPMobageSocial.proxyAvatar(user.thumbnailUrl)
            }
        }
    };
};

cleverapps.SPMobageSocial.proxyAvatar = function (url) {
    var base = cleverapps.config.deployment + "/proxy/sp";
    var parsed = url.match(/.*img_u(.*)/);
    return base + parsed[1];
};

cleverapps.SPMobageSocial.prototype.listFriendsByApp = function (inApp, callback) {
    var params = {
        userId: "@me",
        groupId: "@friends",
        fields: ["id", "displayName", "thumbnailUrl", "hasApp"]
    };

    mobage.api.people.get(params, function (error, result) {
        if (error) {
            console.log("Failed fetching friends", error);
            callback(cleverapps.CODE_FAILED);
        } else {
            var friends = result.entry;
            friends = friends.filter(function (friend) {
                return friend.hasApp === inApp;
            });

            callback(cleverapps.CODE_SUCCEED, friends.map(cleverapps.SPMobageSocial.formatUserData));
        }
    });
};

cleverapps.SPMobageSocial.prototype._inviteFriends = function (options, callback) {
    mobage.ui.open(
        "invitation",
        {},
        function (error, result) {
            if (error) {
                callback(cleverapps.CODE_FAILED, error);
            } else if (result.response.result.channel === "mobage") {
                callback(cleverapps.CODE_SUCCEED);
            } else {
                callback(cleverapps.CODE_CANCELLED);
            }
        }
    );
};

cleverapps.SPMobageSocial.prototype._request = function (options, callback) {
    callback(cleverapps.CODE_SUCCEED);
};

cleverapps.SPMobageSocial.prototype._shareDialog = function (data, callback) {
    callback(cleverapps.CODE_SUCCEED);
};

// eslint-disable-next-line no-unused-vars
cleverapps.SPMobageSocial.prototype.sendActivity = function (activityType, data) {

};

cleverapps.SPMobageSocial.MOBAGE_API = {
    SANDBOX: "https://cdn-sb-connect.mobage.jp/jssdk/mobage-jssdk-client.3.9.1.min.js",
    PRODUCTION: "https://cdn-connect.mobage.jp/jssdk/mobage-jssdk-client.3.9.1.min.js"
};

cleverapps.SPMobageSocial.CHECK_STATUS_INTERVAL = "10 minutes";