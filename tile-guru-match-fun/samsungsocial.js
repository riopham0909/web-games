/**
 * Created by anatoly on 03/12/2023
 */

cleverapps.SamsungSocial = function () {
    console.log("Choosing Samsung Social");
    cleverapps.Social.call(this);

    this.pingThrottled = cleverapps.timeredThrottle(10000, function () {
        if (cleverapps.platform.isConnected(Platform.SOCIAL)) {
            this.ping();
        }
    }.bind(this));

    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, this.pingThrottled.bind(this));
    cleverapps.timeouts.setInterval(this.pingThrottled.bind(this), cleverapps.parseInterval("1 minute"));
};

cleverapps.SamsungSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.SamsungSocial.prototype.constructor = cleverapps.SamsungSocial;

cleverapps.SamsungSocial.prototype._connect = function (callback) {
    GSInstant.addLoginStatusEventListener(function (changeInfo) {
        console.log("login Status Changed : ", JSON.stringify(changeInfo));
        this.loginStatusChanged = true;
    }.bind(this));

    this.ping(function (code) {
        if (code === cleverapps.CODE_SUCCEED) {
            callback(Platform.STATUS_CONNECTED);
        } else {
            callback(Platform.STATUS_DISCONNECTED);
        }
    });
};

cleverapps.SamsungSocial.prototype.ping = function (callback) {
    var player = new ActionPlayer([
        function (f, stop) {
            var status = GSInstant.getLoginStatus();
            console.log("getLoginStatus", status);
            cleverapps.config.debugMode && cleverapps.notification.create("loginStatus - " + JSON.stringify(status));

            if (status.result === "LOGIN") {
                f();
            } else {
                this.userId = undefined;
                stop();
            }
        }.bind(this),

        function (f, stop) {
            this.loadPlayer(f, stop);
        }.bind(this)
    ]);

    player.onFailure(function () {
        callback && callback(cleverapps.CODE_FAILED);
    });
    player.play(function () {
        callback && callback(cleverapps.CODE_SUCCEED);
    });
};

cleverapps.SamsungSocial.prototype._login = function (callback) {
    var player = new ActionPlayer([
        function (f, stop) {
            GSInstant.loginAsync().then(function (result) {
                console.log("login success", result);
                cleverapps.config.debugMode && cleverapps.notification.create("login success - " + JSON.stringify(result));
                f();
            }).catch(function (errObj) {
                var err = errObj && errObj.err;
                console.log("login result", errObj);
                cleverapps.config.debugMode && cleverapps.notification.create("login catch - " + JSON.stringify(errObj));

                if (err === "ALREADY_LOGGED_IN") {
                    f();
                } else {
                    stop();
                }
            });
        },

        function (f, stop) {
            this.loadPlayer(f, stop);
        }.bind(this)
    ]);

    player.onFailure(function () {
        console.log("login failure");
        callback();
    });

    player.play(function () {
        console.log("login success");
        callback();
    });
};

cleverapps.SamsungSocial.prototype.loadPlayer = function (onSuccess, onFailure) {
    GSInstant.player.getPlayerIdAsync()
        .then(function (playerId) {
            console.log("loadPlayer result - " + playerId);
            cleverapps.config.debugMode && cleverapps.notification.create("loadPlayer result - " + playerId);
            this.userId = playerId;
            onSuccess && onSuccess();
        }.bind(this))
        .catch(function (err) {
            console.log("loadPlayer error", err);
            cleverapps.config.debugMode && cleverapps.notification.create("loadPlayer error - " + err);
            onFailure && onFailure();
        });
};

cleverapps.SamsungSocial.prototype._getUserID = function () {
    var userId = this.userId;
    if (!cleverapps.platform.haveTmpId()) {
        userId = userId || cleverapps.platform.getUserID();
    }
    return userId;
};

cleverapps.SamsungSocial.prototype.isLoggedIn = function () {
    var loggedIn = this.userId !== undefined;

    var strict = cleverapps.paymentsManager.isPurchaseRunning();
    if (!strict) {
        loggedIn = loggedIn || !cleverapps.platform.haveTmpId();
    }

    return loggedIn;
};

cleverapps.SamsungSocial.prototype.getAccessToken = function () {
    return "samsung";
};