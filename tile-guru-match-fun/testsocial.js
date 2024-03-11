/**
 * Created by slava on 4/5/17.
 */

var TestSocial = function () {
    console.log("Choosing TestSocial");

    cleverapps.BaseFB.call(this);
};

TestSocial.prototype = Object.create(cleverapps.BaseFB.prototype);
TestSocial.prototype.constructor = TestSocial;

TestSocial.prototype.updateSession = function (id) {
    var expire = new Date();
    expire.setMonth(expire.getMonth() + 3);

    this.id = id;
    this.token = "123";
    this.expires = expire.getTime();

    document.cookie = "tsid=" + this.id + "; path=/; expires=" + expire.toUTCString();
};

TestSocial.prototype.removeSession = function () {
    this.id = undefined;
    this.token = undefined;
    this.expires = undefined;

    document.cookie = "tsid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

TestSocial.prototype.loadSession = function () {
    var match = document.cookie && document.cookie.match(/tsid=([^;]+)/);
    if (match) {
        this.updateSession(match[1]);
    }
};

TestSocial.prototype._connect = function (callback) {
    this.DIALOG_CANCELLED = 2;

    this.id = undefined;
    this.expires = undefined;
    this.token = undefined;

    setTimeout(function () {
        this.loadSession();
        callback(Platform.STATUS_CONNECTED);
    }.bind(this), 1000);
};

TestSocial.prototype._shareDialog = function (shareData, callback) {
    cc.loader.loadImg(shareData.picture, function (err, img) {
        var debugInfo = new cc.Sprite(img);
        var scene = cleverapps.scenes.getRunningScene();
        scene.addChild(debugInfo);
        debugInfo.setPositionRound(scene.width / 2, scene.height / 2);

        var end = function (res) {
            debugInfo.removeFromParent();
            callback(res, "TestSocial");
        };

        setTimeout(function () {
            if (confirm("Do you to post " + JSON.stringify(shareData) + "?")) {
                end(cleverapps.CODE_SUCCEED);
            } else {
                end(cleverapps.Social.DIALOG_CANCELLED);
            }
        }, 200);
    });
};

TestSocial.prototype.isExpired = function () {
    return !this.expires || this.expires < Date.now();
};

TestSocial.prototype.isLoggedIn = function () {
    return Boolean(this.id);
};

TestSocial.prototype._getUserID = function () {
    return this.id;
};

TestSocial.prototype.getAccessToken = function () {
    return this.isExpired() ? undefined : this.token;
};

TestSocial.prototype._login = function (callback) {
    new FakeLoginWindow(function (id) {
        if (id) {
            this.updateSession(id);
        } else {
            this.removeSession();
        }

        callback();
    }.bind(this));
};

TestSocial.prototype.logout = function () {
    this.removeSession();
};

TestSocial.prototype._inviteFriends = function (options, callback) {
    options.picture = Share.getData("default").picture;
    this.shareDialog(options, callback);
};

TestSocial.prototype._request = function (options, callback) {
    delete options.element;

    callback = callback || function () {};
    if (confirm("Do you to post " + JSON.stringify(options) + "?")) {
        callback(cleverapps.CODE_SUCCEED, { to: [TestSocial.INVITABLE_USERS.invitable_1.id] });
    } else {
        callback(cleverapps.Social.DIALOG_CANCELLED, "TestSocial");
    }
};

TestSocial.prototype._listFriends = function (callback) {
    setTimeout(function () {
        callback(cleverapps.CODE_SUCCEED, cleverapps.values(TestSocial.USERS));
    }, 500);
};

TestSocial.prototype._listInvitableFriends = function (callback) {
    setTimeout(function () {
        callback(cleverapps.CODE_SUCCEED, cleverapps.values(TestSocial.INVITABLE_USERS));
    }, 500);
};

TestSocial.prototype.api = function (method, callback) {
    switch (method) {
        case "/me/?fields=is_eligible_promo":

            FB = {
                ui: function (params, callback) {
                    callback({
                        status: "completed"
                    });
                }
            };

            callback(cleverapps.CODE_SUCCEED, {
                is_eligible_promo: 1
            });
            break;
    }
};

TestSocial.prototype._aboutMe = function (callback) {
    setTimeout(function () {
        callback({
            currency: {
                user_currency: "USD"
            },
            name: "FakeFB User",
            first_name: "TestSocial",
            picture: {
                data: {
                    url: "https://graph.facebook.com/100001828353521/picture?height=200&width=200"
                }
            }
        });
    }, 500);
};

TestSocial.isAppropriate = function () {
    return cleverapps.platform.oneOf(TestPlatform);
};

TestSocial.USERS = {
    alpha: {
        name: "Alpha",
        first_name: "Alpha",
        picture: {
            data: {
                url: "https://graph.facebook.com/41803173/picture?height=200&width=200"
            }
        }
    },
    beta: {
        name: "Beta",
        first_name: "Beta",
        picture: {
            data: {
                url: "https://graph.facebook.com/692982514/picture?height=200&width=200"
            }
        }
    },
    gamma: {
        name: "Gamma",
        first_name: "Gamma",
        picture: {
            data: {
                url: "https://graph.facebook.com/100028444590540/picture?height=200&width=200"
            }
        }
    }
};

Object.keys(TestSocial.USERS).forEach(function (id) {
    TestSocial.USERS[id].id = id;
});

TestSocial.INVITABLE_USERS = {
    invitable_1: {
        name: "Invitable1",
        first_name: "Invitable1",
        picture: {
            data: {
                url: "https://graph.facebook.com/100001008129789/picture?height=200&width=200"
            }
        }
    },
    invitable_2: {
        name: "Invitable2",
        first_name: "Invitable2",
        picture: {
            data: {
                url: "https://graph.facebook.com/100011706990070/picture?height=200&width=200"
            }
        }
    },
    invitable_3: {
        name: "Invitable3",
        first_name: "Invitable3",
        picture: {
            data: {
                url: "https://graph.facebook.com/100001575006940/picture?height=200&width=200"
            }
        }
    },
    invitable_4: {
        name: "Invitable4",
        first_name: "Invitable4",
        picture: {
            data: {
                url: "https://graph.facebook.com/100000318466656/picture?height=200&width=200"
            }
        }
    }
};

Object.keys(TestSocial.INVITABLE_USERS).forEach(function (id) {
    TestSocial.INVITABLE_USERS[id].id = id;
});
