/**
 * Created by slava on 23.03.17.
 */

cleverapps.Social = function () {
    Connectable.call(this);
};

cleverapps.Social.prototype = Object.create(Connectable.prototype);
cleverapps.Social.prototype.constructor = cleverapps.Social;

cleverapps.Social.prototype.connect = function (callback) {
    if (this.connecting) {
        return;
    }

    this.connecting = true;
    this._connect(cleverapps.waitNoMore(Platform.WAIT_CONNECT_TIMEOUT, function (status) {
        this.connecting = false;

        callback(status);

        console.log("Social.connect, isLoggedIn: " + this.isLoggedIn());
        if (this.isLoggedIn()) {
            this.onLogin();
        } else {
            var deviceId = cleverapps.platform.getDeviceId();
            if (deviceId) {
                cleverapps.platform.setUserID(deviceId);
            }
        }
    }.bind(this)));
};

cleverapps.Social.prototype.isLoggedIn = function () {
};

cleverapps.Social.prototype._getUserID = function () {
};

cleverapps.Social.prototype.getAccessToken = function () {
};

cleverapps.Social.prototype.onLogin = function () {
    var oldId = cleverapps.platform.getUserID();
    var newId = this._getUserID();

    console.log("Social.onLogin", oldId, newId);

    cleverapps.platform.setUserID(newId);

    cleverapps.platform.trigger("login", {
        oldId: oldId,
        newId: newId
    });
};

cleverapps.Social.prototype.login = function (callback) {
    console.log("Social.login");

    this._login(function () {
        if (this.isLoggedIn()) {
            console.log("Social.login success");

            this.onLogin();

            callback(cleverapps.CODE_SUCCEED);
        } else {
            console.log("Social.login fail");

            callback(cleverapps.CODE_FAILED);
        }
    }.bind(this));
};

cleverapps.Social.prototype._login = function (callback) {
    callback();
};

cleverapps.Social.prototype.logout = function () {
};

cleverapps.Social.prototype.inviteFriends = function (options, callback) {
    if (cleverapps.platform.isConnected(Platform.SOCIAL)) {
        this._inviteFriends(options, callback);
    } else {
        callback(cleverapps.CODE_FAILED);
    }
};

cleverapps.Social.prototype._inviteFriends = function (options, callback) {
    callback(cleverapps.CODE_FAILED);
};

cleverapps.Social.prototype.request = function (options, callback) {
    if (cleverapps.platform.isConnected(Platform.SOCIAL)) {
        this._request(options, callback);
    } else {
        callback(cleverapps.CODE_FAILED);
    }
};

cleverapps.Social.prototype._request = function (options, callback) {
    callback(cleverapps.CODE_FAILED);
};

cleverapps.Social.prototype.shareDialog = function (options, callback) {
    if (cleverapps.platform.isConnected(Platform.SOCIAL)) {
        this._shareDialog(options, callback);
    } else {
        callback(cleverapps.CODE_FAILED);
    }
};

cleverapps.Social.prototype._shareDialog = function (options, callback) {
    callback(cleverapps.CODE_FAILED);
};

cleverapps.Social.prototype.listFriends = function (callback) {
    if (cleverapps.platform.isConnected(Platform.SOCIAL)) {
        this._listFriends(callback);
    } else {
        callback(cleverapps.CODE_FAILED, []);
    }
};

cleverapps.Social.prototype._listFriends = function (callback) {
    callback(cleverapps.CODE_SUCCEED, []);
};

cleverapps.Social.prototype.listInvitableFriends = function (callback) {
    if (cleverapps.platform.isConnected(Platform.SOCIAL)) {
        this._listInvitableFriends(callback);
    } else {
        callback(cleverapps.CODE_FAILED, []);
    }
};

cleverapps.Social.prototype._listInvitableFriends = function (callback) {
    callback(cleverapps.CODE_SUCCEED, []);
};

cleverapps.Social.prototype.aboutMe = function (callback) {
    if (cleverapps.platform.isConnected(Platform.SOCIAL)) {
        this._aboutMe(callback);
    } else {
        callback({});
    }
};

cleverapps.Social.prototype._aboutMe = function (callback) {
    this.aboutUser("me", callback);
};

cleverapps.Social.prototype.aboutUser = function (options, callback) {
    if (cleverapps.platform.isConnected(Platform.SOCIAL)) {
        this._aboutUser(options, callback);
    } else {
        callback({});
    }
};

cleverapps.Social.prototype._aboutUser = function () {
};

cleverapps.Social.prototype.deleteAllRequests = function () {
};

cleverapps.Social.prototype.api = function () {
};

cleverapps.Social.prototype.sendActivity = function () {
};

cleverapps.Social.prototype.markAchievement = function () {
};

cleverapps.Social.prototype.hasPromoGift = function (callback) {
    callback(false);
};

cleverapps.Social.prototype.usePromoGift = function () {};

cleverapps.Social.prepareId = function (uid) {
    return "" + uid;
};

cleverapps.Social.prototype.checkConnection = function (onSuccess, onFailure, options) {
    var afterLogin = function () {
        onSuccess && onSuccess();
    };

    if (cleverapps.flags.nologin) {
        afterLogin();
        return;
    }

    if (typeof onFailure === "object") {
        options = onFailure;
        onFailure = function () {};
    }

    onFailure = onFailure || function () {};
    options = options || {};

    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        cleverapps.notification.create("SocialManager.Initialization");
        onFailure();
        return;
    }

    options = Object.assign({}, options);
    options.onSuccess = afterLogin;
    options.onFailure = onFailure;

    if (!this.isLoggedIn()) {
        if (options.withWindow || cleverapps.platform.needWindowForLogin()) {
            new FbConnectWindow(options);
        } else {
            this.login(afterLogin, onFailure);
        }
    } else {
        afterLogin();
    }
};

cleverapps.Social.prototype.sendRequest = function (to, type, onSuccess) {
    if (!Array.isArray(to)) {
        to = [to];
    }

    this.checkConnection(function () {
        this.request({
            "to": to,
            "message": Messages.get(type + ".message"),
            "title": Messages.get(type + ".title")
        }, function (code) {
            if (code === cleverapps.CODE_SUCCEED) {
                levels.friendSorter.markUsed(to);

                var friends = cleverapps.friends.listIds();
                var sentToFriends = to.filter(function (sentId) {
                    return friends.indexOf(sentId) !== -1;
                });

                if (sentToFriends.length > 0) {
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.MESSAGE_SENT_FRIEND, { value: sentToFriends.length });
                }

                if (to.length - sentToFriends.length > 0) {
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.MESSAGE_SENT_INVITE, { value: to.length - sentToFriends.length });
                }

                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.MESSAGE_SENT_PREFIX + type, { value: to.length });

                if (onSuccess) {
                    onSuccess();
                }
            } else {
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.MESSAGE_CANCEL_PREFIX + type, { value: to.length });

                if ([cleverapps.CODE_CANCELLED, cleverapps.CODE_CANCELLED_FACEBOOK_DIALOG].includes(code)) {
                    var eventName = cleverapps.EVENTS.MESSAGE_ERROR + "_" + cleverapps.platform.source;
                    if (typeof code === "number") {
                        eventName += "_" + code;
                    }
                    cleverapps.eventLogger.logEvent(eventName);
                }
            }
        });
    }.bind(this));
};

cleverapps.Social.prototype.getCodes = function () {
    return this.getCode().split("-").sort();
};

cleverapps.Social.prototype.getCode = function () {
    return cleverapps.platform.source;
};

cleverapps.Social.prototype.getName = function () {
    return "";
};

cleverapps.Social.prototype.waitWindowCallback = function (callback) {
    var waitWindow = undefined;

    if (!cleverapps.meta.isFocused()) {
        cleverapps.meta.display({
            focus: "waitWindowCallback",
            action: function (f) {
                waitWindow = new WaitWindow();
                cleverapps.meta.onceNoWindowsListener = f;
            }
        });
    } else {
        waitWindow = new WaitWindow();
    }

    return function () {
        if (waitWindow) {
            waitWindow.close();
        }
        callback.apply(this, arguments);
    };
};

cleverapps.Social.prototype.drawBase64 = function (image) {
    var canvas = document.createElement("canvas");
    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas.toDataURL("image/jpg");
};

cleverapps.Social.prototype.getBase64Image = function (image, callback) {
    var onFinish = this.waitWindowCallback(callback);

    cc.loader.load(image, function (err, images) {
        var loadedImage = (images && Array.isArray(images) && images.length > 0) ? images[0] : undefined;

        if (!err && loadedImage === undefined) {
            err = cleverapps.CODE_FAILED;
        }

        onFinish(err, !err ? this.drawBase64(loadedImage.getHtmlElementObj()) : undefined);
    }.bind(this));
};

cleverapps.Social.MAX_INVITE_RANDOM_FRIENDS = 10;

cleverapps.Social.ACTIVITY = {
    LVL_PASSED: 0,
    DAILY_TASK: 1
};

cleverapps.Social.ACTIVITIES_CONFIG = {};

cleverapps.Social.ACTIVITIES_CONFIG[cleverapps.Social.ACTIVITY.LVL_PASSED] = {
    probability: 0.25,
    messages: [{
        title: "Activity.PassLevel.title",
        body: "Activity.PassLevel.body1"
    }, {
        title: "Activity.PassLevel.title",
        body: "Activity.PassLevel.body2"
    }, {
        title: "Activity.PassLevel.title",
        body: "Activity.PassLevel.body3"
    }
    ]
};

cleverapps.Social.ACTIVITIES_CONFIG[cleverapps.Social.ACTIVITY.DAILY_TASK] = {
    probability: 0.5,
    messages: [{
        title: "Activity.DailyTask.title",
        body: "Activity.DailyTask.body1"
    }, {
        title: "Activity.DailyTask.title",
        body: "Activity.DailyTask.body2"
    }]
};
