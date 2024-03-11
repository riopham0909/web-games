/**
 * Created by vladislav on 9/12/2023
 */

cleverapps.WechatSocial = function () {
    console.log("Choosing WechatSocial");

    cleverapps.Social.call(this);

    this.pingThrottled = cleverapps.timeredThrottle(10000, function () {
        if (cleverapps.platform.isConnected(Platform.SOCIAL)) {
            this.ping();
        }
    }.bind(this));

    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, this.pingThrottled.bind(this));
    cleverapps.timeouts.setInterval(this.pingThrottled.bind(this), cleverapps.parseInterval("1 minute"));
};

cleverapps.WechatSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.WechatSocial.prototype.constructor = cleverapps.WechatSocial;

cleverapps.WechatSocial.prototype._connect = function (callback) {
    this.ping(function (code) {
        if (code === cleverapps.CODE_SUCCEED) {
            callback(Platform.STATUS_CONNECTED);
        } else {
            callback(Platform.STATUS_DISCONNECTED);
        }
    });
};

cleverapps.WechatSocial.prototype._login = function (callback) {
    this.ping(callback);
};

cleverapps.WechatSocial.prototype._getUserID = function () {
    return this.userId;
};

cleverapps.WechatSocial.prototype.isLoggedIn = function () {
    return Boolean(this.userId);
};

cleverapps.WechatSocial.prototype.getAccessToken = function () {
    return "wechat";
};

cleverapps.WechatSocial.prototype.ping = function (callback) {
    var code;

    var player = new ActionPlayer([
        function (f) {
            if (!this.userId) {
                f();
                return;
            }

            wx.checkSession({
                success: function () {
                    console.log("wx checkSession success");
                    callback && callback(cleverapps.CODE_SUCCEED);
                },

                fail: function () {
                    console.log("wx checkSession fail");
                    f();
                }
            });
        }.bind(this),

        function (f, stop) {
            wx.login({
                success: function (response) {
                    console.log("login success", response);

                    code = response && response.code;

                    f();
                },

                fail: function (response) {
                    cleverapps.config.debugMode && cleverapps.notification.create("login - " + JSON.stringify(response));
                    console.log("login fail", response);
                    stop();
                }
            });
        },

        function (next, stop) {
            var path = "/wechat/code2session/" + encodeURIComponent(cleverapps.platform.getUserID()) + "/" + encodeURIComponent(code);

            var attempts = 3;

            var nextAttempt = function () {
                if (attempts <= 0) {
                    stop();
                } else {
                    cleverapps.timeouts.setTimeout(code2Session, 3000);
                }
            };

            var code2Session = function () {
                attempts--;

                cleverapps.RestClient.get(path, {}, function (response) {
                    var openid = response && response.openid;

                    if (response.errmsg || response.errcode || !openid) {
                        var message = "code2Session error - " + (response.errmsg || response.errcode || "empty openid");
                        cleverapps.config.debugMode && cleverapps.notification.create(message);
                        console.log(message);
                        nextAttempt();
                        return;
                    }

                    console.log("code2Session", openid);

                    this.userId = openid;

                    if (cleverapps.platform.isConnected(Platform.SOCIAL) && cleverapps.platform.haveTmpId()) {
                        this.onLogin();
                    }

                    next();
                }.bind(this), function (response) {
                    cleverapps.config.debugMode && cleverapps.notification.create("code2session request error");
                    console.log("code2Session fail", response);
                    nextAttempt();
                });
            }.bind(this);

            code2Session();
        }.bind(this)
    ]);

    player.onFailure(function () {
        cleverapps.throwAsync("wechat login failure");
        callback && callback(cleverapps.CODE_FAILED);
    });

    player.play(function () {
        callback && callback(cleverapps.CODE_SUCCEED);
    });
};

cleverapps.WechatSocial.prototype.getUserInfo = function (callback) {
    var authSetting;

    var player = new ActionPlayer([
        function (f, stop) {
            wx.getSetting({
                success: function (res) {
                    console.log("getSetting - " + JSON.stringify(res));
                    authSetting = res.authSetting;
                    f();
                },

                fail: function (err) {
                    console.log("getSetting fail - " + JSON.stringify(err));
                    stop();
                }
            });
        },

        function (f, stop) {
            if (authSetting["scope.userInfo"]) {
                f();
                return;
            }

            wx.authorize({
                scope: "scope.userInfo",
                success: function (res) {
                    console.log("authorize - " + JSON.stringify(res));
                    f();
                },

                fail: function (err) {
                    console.log("authorize fail - " + JSON.stringify(err));
                    stop();
                }
            });
        },

        function (f, stop) {
            wx.getUserInfo({
                success: function (response) {
                    console.log("getUserInfo - " + JSON.stringify(response));
                    this.userInfo = response.userInfo;
                    f();
                }.bind(this),

                fail: function (err) {
                    console.log("getUserInfo fail - " + JSON.stringify(err));
                    stop();
                }
            });
        }.bind(this)
    ]);

    player.onComplete(callback);
    player.play();
};

cleverapps.WechatSocial.prototype._aboutMe = function (callback) {
    if (this.userInfo) {
        callback({
            name: this.userInfo.nickName,
            first_name: this.userInfo.nickName
        });
    }
};