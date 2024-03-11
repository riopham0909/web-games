/**
 * Created by slava on 4/21/17.
 */

cleverapps.VKSocial = function () {
    if (!(this instanceof cleverapps.MobileVkSocial)) {
        console.log("Choosing vkBridge-web");
    }
    
    cleverapps.Social.MAX_INVITE_RANDOM_FRIENDS = 1;
    
    cleverapps.Social.call(this);

    if (cleverapps.config.debugMode && !cleverapps.VKSocial.DEBUG_USERS[cleverapps.platform.getUserID()]) {
        document.body.innerHTML = "приложение недоступно";
    }
};

cleverapps.VKSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.VKSocial.prototype.constructor = cleverapps.VKSocial;

cleverapps.VKSocial.prototype._connect = function (callback) {
    this.api("VKWebAppGetAuthToken", {
        app_id: parseInt(cleverapps.config.vk.appId),
        scope: "friends"
    }, function (code, data) {
        console.log("VKWebAppGetAuthToken result: " + code + " " + (data ? JSON.stringify(data) : ""));

        if (code === cleverapps.CODE_SUCCEED) {
            this.accessToken = data.access_token;
            this.scope = data.scope;
        }

        this.resetCounter();

        callback(Platform.STATUS_CONNECTED);
    }.bind(this));
};

cleverapps.VKSocial.prototype.subscribe = function (typeSuccess, typeFail, callback) {
    var cb = function (event) {
        console.log("vkBridge response", event);

        if (event.detail.type === typeSuccess) {
            callback(cleverapps.CODE_SUCCEED, event.detail.data);
            vkBridge.unsubscribe(cb);
        }
        if (event.detail.type === typeFail) {
            callback(cleverapps.CODE_FAILED, event.detail.data);
            vkBridge.unsubscribe(cb);
        }
    };

    vkBridge.subscribe(cb);
};

cleverapps.VKSocial.prototype.sendActivity = function (type, data) {
    if (type !== cleverapps.Social.ACTIVITY.LVL_PASSED) {
        return;
    }

    var params = {
        user_id: cleverapps.platform.getUserID(),
        v: cleverapps.VKSocial.API_VERSION
    };

    if (data.vkId !== undefined) {
        params.activity_id = data.vkId;
    } else {
        params.activity_id = 1;
        params.value = data.levelNo;

        if (cleverapps.Random.mathChoose([0, 1]) && data.score !== undefined) {
            params.activity_id = 2;
            params.value = data.score;
        }
    }

    var paramsArray = [];
    for (var paramName in params) {
        paramsArray.push(paramName + "=" + params[paramName]);
    }

    cleverapps.RestClient.get("/vkappevents?" + paramsArray.join("&"), {});
};

cleverapps.VKSocial.prototype.markAchievement = function (data) {
    if (data.vkId !== undefined) {
        this.sendActivity(cleverapps.Social.ACTIVITY.LVL_PASSED, data);
    }
};

cleverapps.VKSocial.prototype.hasPromoGift = function (callback) {
    var start = new Date(cleverapps.VKSocial.START_DATE).getTime();
    if (cleverapps.VKSocial.DEBUG_USERS[cleverapps.platform.getUserID()]) {
        start = new Date(cleverapps.VKSocial.START_DATE_DEBUG).getTime();
    }

    if (Date.now() < start || Date.now() > new Date(cleverapps.VKSocial.END_DATE).getTime()) {
        callback(false);
        return;
    }

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.RETURNBONUS_CHECK);

    this.api("apps.promoHasActiveGift", { promo_id: cleverapps.VKSocial.RETURN_BONUS_ID }, function (code, data) {
        console.log("promoHasActiveGift result: " + code + " " + (data ? JSON.stringify(data) : ""));

        if (code === cleverapps.CODE_SUCCEED && data.response === 1) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

cleverapps.VKSocial.prototype.usePromoGift = function () {
    this.api("apps.promoUseGift", { promo_id: cleverapps.VKSocial.RETURN_BONUS_ID });
};

cleverapps.VKSocial.prototype.isLoggedIn = function () {
    return true;
};

cleverapps.VKSocial.prototype._getUserID = function () {
    return cleverapps.getRequestParameters().viewer_id;
};

cleverapps.VKSocial.prototype.getAccessToken = function () {
    return "VK_" + cleverapps.getRequestParameters().auth_key;
};

cleverapps.VKSocial.prototype._login = function (callback) {
    callback();
};

cleverapps.VKSocial.prototype._inviteFriends = function (options, callback) {
    this.api("VKWebAppShowInviteBox", {}, callback);
};

cleverapps.VKSocial.prototype.requestToOne = function (uid, options, callback) {
    this.api("VKWebAppShowRequestBox", {
        uid: parseInt(uid),
        message: options.message,
        requestKey: "key"
    }, callback);
};

cleverapps.VKSocial.prototype.showOrderBox = function (options, callback) {
    this.api("VKWebAppShowOrderBox", {
        type: options.type,
        item: options.item
    }, callback);
};

cleverapps.VKSocial.prototype._request = function (options, callback) {
    var to = options.to;
    if (!Array.isArray(to)) {
        to = [to];
    }

    var sended = [];
    var sendOneRequest = function (id) {
        if (id === to.length) {
            callback(sended.length > Math.floor(to.length / 2) ? cleverapps.CODE_SUCCEED : cleverapps.CODE_CANCELLED, sended);
        } else {
            this.requestToOne(to[id], options, function (response) {
                // if (cleverapps.config.debugMode) {
                //     cleverapps.throwAsync({ group: 'DebugMessage', message: "requestToOne - " + JSON.stringify(arguments) });
                // }
                if (response === cleverapps.CODE_SUCCEED) {
                    sended.push(to[id]);
                }
                sendOneRequest(id + 1);
            });
        }
    }.bind(this);
    sendOneRequest(0);
};

cleverapps.VKSocial.prototype.api = function (method, params, callback) {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL) && method !== "VKWebAppGetAuthToken") {
        if (callback) {
            callback(cleverapps.CODE_FAILED);
        }
        return;
    }

    if (method.startsWith("apps.")) {
        params = {
            method: method,
            params: Object.assign({
                v: cleverapps.VKSocial.API_VERSION,
                access_token: this.accessToken
            }, params)
        };

        method = "VKWebAppCallAPIMethod";
    }

    if (callback !== undefined) {
        var typeSuccess = method === "VKWebAppGetAuthToken" ? "VKWebAppAccessTokenReceived" : method + "Result";
        var typeFail = method === "VKWebAppGetAuthToken" ? "VKWebAppAccessTokenFailed" : method + "Failed";
        this.subscribe(typeSuccess, typeFail, callback);
    }

    vkBridge.send(method, params);
};

cleverapps.VKSocial.prototype._shareDialog = function (data, callback) {
    if (!data.vk) {
        throw "No vk data to share!";
    }

    this.api("VKWebAppShowWallPostBox", {
        message: data.description + "\n" + cleverapps.platform.getGameUrl(),
        attachments: data.vk + ",https://vk.com/app" + cleverapps.config.vk.appId
    }, callback);
};

cleverapps.VKSocial.prototype.listFriendsByApp = function (inApp, callback) {
    var getAppFriendsCb = function (code, appData) {
        if (code !== cleverapps.CODE_SUCCEED) {
            callback(cleverapps.CODE_FAILED, []);
            return;
        }

        if (!appData || !appData.response || !appData.response.map) {
            callback(cleverapps.CODE_FAILED, []);
            return;
        }

        var appIds = appData.response.map(cleverapps.VKSocial.prepareId);

        this.api("VKWebAppCallAPIMethod", {
            method: "friends.get",
            params: {
                v: cleverapps.VKSocial.API_VERSION,
                access_token: this.accessToken,
                count: 1000,
                fields: "photo_200"
            }
        }, function (code, data) {
            if (code !== cleverapps.CODE_SUCCEED) {
                callback(cleverapps.CODE_FAILED, []);
                return;
            }

            callback(cleverapps.CODE_SUCCEED, this.prepareFriendsData(data.response && data.response.items, appIds, inApp));
        }.bind(this));
    }.bind(this);

    this.api("VKWebAppCallAPIMethod", {
        method: "friends.getAppUsers",
        params: {
            v: cleverapps.VKSocial.API_VERSION,
            access_token: this.accessToken
        }
    }, getAppFriendsCb);
};

cleverapps.VKSocial.prototype.prepareFriendsData = function (friendsData, appIds, inApp) {
    var friends = (friendsData || []).filter(function (friend) {
        return friend.deactivated === undefined;
    });

    return friends.map(cleverapps.VKSocial.formatUserData).filter(function (friend) {
        return inApp === (appIds.indexOf(friend.id) !== -1);
    });
};

cleverapps.VKSocial.prototype._listFriends = function (callback) {
    this.listFriendsByApp(true, callback);
};

cleverapps.VKSocial.prototype._listInvitableFriends = function (callback) {
    this.listFriendsByApp(false, callback);
};

cleverapps.VKSocial.prototype._aboutMe = function (callback) {
    this.api("VKWebAppGetUserInfo", {}, function (code, data) {
        if (code === cleverapps.CODE_SUCCEED) {
            callback(cleverapps.VKSocial.formatUserData(data));
        }
    });
};

cleverapps.VKSocial.prototype.resetCounter = function () {
    this.api("VKWebAppCallAPIMethod", {
        method: "setCounter",
        params: {
            v: cleverapps.VKSocial.API_VERSION,
            access_token: this.accessToken,
            counter: 0,
            increment: 0
        }
    }, function (code) {
        if (code === cleverapps.CODE_FAILED) {
            console.log("VK.resetCounter error");
        }
    });
};

cleverapps.VKSocial.prototype.getName = function () {
    return Messages.get("vk");
};

cleverapps.VKSocial.prepareId = function (uid) {
    return "" + uid;
};

cleverapps.VKSocial.formatUserData = function (user) {
    return {
        id: cleverapps.VKSocial.prepareId(user.id),
        name: user.first_name + " " + user.last_name,
        first_name: user.first_name,
        picture: {
            data: {
                url: (user.photo_200 && user.photo_200.indexOf("camera_200.png") === -1) ? user.photo_200 : undefined
            }
        }
    };
};

cleverapps.VKSocial.DEFAULT_HEIGHT = 720;
cleverapps.VKSocial.DEFAULT_WIDTH = 800;
cleverapps.VKSocial.MIN_HEIGHT = 480;
cleverapps.VKSocial.SCREEN_HEIGHT_RESERVED = 230;

cleverapps.VKSocial.API_VERSION = "5.107";

cleverapps.VKSocial.DEBUG_USERS = cleverapps.createSet([
    "8593874", // Vitaly
    "519644122", // Petr
    "559432346", // Clever Apps
    "120601236", // Michael Timkin
    "13506358", // Nail
    "662073098", // Andrey Popov
    "4252816", // Andrey Kargapolov
    "575473277", // Denis Kuzin
    "512342080", // Stepa
    "201054870", // Vlad
    "9938687", // Vsevolod
    "241941018", // Evgenia Morozova
    "153901140", // Ivan Scholohov
    "16681526", // Olga Eremina
    "59691942", // Alexander Bredihin
    "9933151", // Bogdan
    "159103233", // Artem Vinokurov
    "122220961", // Eugenia Galkina
    "99189882", // Sergei Bogdanov
    "807887621", // Denis Alexandrov
    "451315686", // Natalia Sadovaya
    "244780021", // Evgeny Senckewitch
    "62287676", // Stepan Puchik
    "547943773" // Anastasiya Fokina
]);

cleverapps.VKSocial.START_DATE = "2024-02-05";
cleverapps.VKSocial.START_DATE_DEBUG = "2024-02-01";
cleverapps.VKSocial.END_DATE = "2024-08-06";

cleverapps.VKSocial.RETURN_BONUS_ID = 33;

cleverapps.VKSocial.MISSIONS = [{
    id: 3,
    level: 1
}, {
    id: 4,
    level: 2
}, {
    id: 5,
    level: 3
}, {
    id: 6,
    level: 4
}, {
    id: 7,
    level: 5
}, {
    id: 8,
    level: 6
}, {
    id: 9,
    level: 10
}, {
    id: 10,
    level: 20
}, {
    id: 11,
    level: 50
}, {
    id: 12,
    level: 100
}, {
    id: 13,
    level: 150
}, {
    id: 14,
    level: 200
}, {
    id: 15,
    level: 300
}, {
    id: 16,
    level: 500
}, {
    id: 17,
    level: 750
}, {
    id: 18,
    level: 1000
}, {
    id: 19,
    level: 1500
}, {
    id: 20,
    level: 2000
}];
