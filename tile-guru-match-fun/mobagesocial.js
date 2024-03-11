/**
 * Created by slava on 4/21/17.
 */

cleverapps.MobageSocial = function () {
    if (!(this instanceof cleverapps.SPMobageSocial)) {
        console.log("Choosing html5-mobage");
    }

    cleverapps.Social.call(this);

    this.increaseViralBonuses();
};

cleverapps.MobageSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.MobageSocial.prototype.constructor = cleverapps.MobageSocial;

cleverapps.MobageSocial.prototype.increaseViralBonuses = function () {
    TacticalExtendWindow.AMOUNT = 5;
};

cleverapps.MobageSocial.HEIGHT = 860;

cleverapps.MobageSocial.prototype._connect = function (callback) {
    gadgets.window.adjustHeight(cleverapps.MobageSocial.HEIGHT);

    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
    req.send(function (response) {
        if (response.hadError()) {
            // error
            callback(Platform.STATUS_DISCONNECTED);
        } else {
            var item = response.get("viewer");
            if (item.hadError()) {
                // error
                callback(Platform.STATUS_DISCONNECTED);
            } else {
                var viewer = item.getData();

                if (viewer.getId() === "mbga.jp:-1") {
                    // user is not logged in mobage/mobage session expired?
                    callback(Platform.STATUS_DISCONNECTED);
                } else {
                    this.user = cleverapps.MobageSocial.formatUserData(viewer);
                    console.log(this.user);
                    callback(Platform.STATUS_CONNECTED);
                }
            }
        }
    }.bind(this));
};

cleverapps.MobageSocial.prototype.isLoggedIn = function () {
    return true;
};

cleverapps.MobageSocial.prototype._getUserID = function () {
    return this.user && this.user.id;
};

cleverapps.MobageSocial.prototype.getAccessToken = function () {
    return "mbga";
};

cleverapps.MobageSocial.prototype._login = function (callback) {
    callback();
};

cleverapps.MobageSocial.prototype.sendActivity = function (activityType, data) {
    var config = cleverapps.Social.ACTIVITIES_CONFIG[activityType];

    if (config.probability > Math.random()) {
        var message = cleverapps.Random.mathChoose(config.messages);

        var params = {};
        params[opensocial.Activity.Field.TITLE] = Messages.get(message.title);
        params[opensocial.Activity.Field.BODY] = Messages.get(message.body, data);
        var activity = opensocial.newActivity(params);
        opensocial.requestCreateActivity(activity, opensocial.CreateActivityPriority.LOW, function (response) {
            if (response.hadError()) {
                // console.log('Error sending activity', response);
            } else {
                // console.log('ok', response);
            }
        });
    }
};

cleverapps.MobageSocial.prototype._inviteFriends = function (options, callback) {
    var params = {};
    params[opensocial.Message.Field.TITLE] = options.title;

    var reason = opensocial.newMessage(options.message, params);

    opensocial.requestShareApp(
        "VIEWER_FRIENDS",
        reason,
        function (data) {
            if (data.hadError()) {
                callback(cleverapps.CODE_CANCELLED, data);
            } else {
                callback(cleverapps.CODE_SUCCEED);
            }
        }
    );
};

cleverapps.MobageSocial.prototype.requestToOne = function (uid, options, callback) {
    var params = {};
    params[opensocial.Message.Field.TITLE] = options.title;

    var body = options.message;
    var message = opensocial.newMessage(body, params);
    var recipient = uid;

    opensocial.requestSendMessage(recipient, message, function (response) {
        if (response.hadError()) {
            callback(cleverapps.CODE_CANCELLED);
        } else {
            var data = response.getData();
            if (data.recipientIds && data.recipientIds.length > 0) {
                callback(cleverapps.CODE_SUCCEED);
            } else {
                callback(cleverapps.CODE_CANCELLED);
            }
        }
    });
};

cleverapps.MobageSocial.prototype._request = function (options, callback) {
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

cleverapps.MobageSocial.prototype._shareDialog = function (data, callback) {
    var mediaItem = opensocial.newMediaItem("image/jpg", data.picture);
    mediaItem.setField(opensocial.MediaItem.Field.TYPE, opensocial.MediaItem.Type.IMAGE);

    var params = {};
    params[mbga.Diary.Field.TITLE] = data.name;
    params[mbga.Diary.Field.CONTENT] = data.description;
    params[mbga.Diary.Field.MEDIA_ITEMS] = [mediaItem];
    var diary = mbga.newCreateDiary(params);

    mbga.requestCreateDiary(diary, function (response) {
        if (response.hadError()) {
            callback(cleverapps.CODE_FAILED, response);
        } else {
            var diary = response.getData();
            var url = diary.getEntryURL();
            console.log(url);

            callback(url ? cleverapps.CODE_SUCCEED : cleverapps.CODE_CANCELLED);
        }
    });
};

cleverapps.MobageSocial.prototype.listFriendsByApp = function (inApp, callback) {
    var params = {};
    params[opensocial.DataRequest.PeopleRequestFields.MAX] = 1000;
    params[opensocial.DataRequest.PeopleRequestFields.PROFILE_DETAILS] = [
        opensocial.Person.Field.HAS_APP
    ];

    var reqParams = {};
    reqParams[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
    reqParams[opensocial.IdSpec.Field.GROUP_ID] = opensocial.IdSpec.GroupId.FRIENDS;
    var idSpec = opensocial.newIdSpec(reqParams);
    var req = opensocial.newDataRequest();

    req.add(req.newFetchPeopleRequest(idSpec, params), "friends");
    req.send(function (response) {
        if (response.hadError()) {
            callback(cleverapps.CODE_FAILED);
        } else {
            var friends = response.get("friends").getData().asArray();

            // console.log(friends);

            friends = friends.filter(function (friend) {
                var hasApp = friend.getField(opensocial.Person.Field.HAS_APP);
                return hasApp === inApp;
            });

            callback(cleverapps.CODE_SUCCEED, friends.map(cleverapps.MobageSocial.formatUserData));
        }
    });
};

cleverapps.MobageSocial.prototype._listFriends = function (callback) {
    this.listFriendsByApp(true, callback);
};

cleverapps.MobageSocial.prototype._listInvitableFriends = function (callback) {
    this.listFriendsByApp(false, callback);
};

cleverapps.MobageSocial.formatUserData = function (user) {
    var avatarUlr = "";
    var data = {
        id: user.getId(),
        name: user.getDisplayName(),
        first_name: user.getDisplayName()
    };

    try {
        avatarUlr = cleverapps.MobageSocial.proxyAvatar(user.getField(opensocial.Person.Field.THUMBNAIL_URL));
        data.picture = {
            data: {
                url: avatarUlr
            }
        };

        return data;
    } catch (e) {
        if (e instanceof TypeError || e.message && e.message.indexOf("of null") !== -1) {
            var info = e.message + " avatarUrl - " + avatarUlr
                + " reqUserId - " + data.id
                + " reqUserName - " + data.name
                + " stack - " + JSON.stringify(e.stack);
            throw new Error(info);
        } else {
            throw e;
        }
    }
};

cleverapps.MobageSocial.proxyAvatar = function (url) {
    var base = cleverapps.platform.getExternalUrl("proxy");

    var parsed = url.match(/.*profile(.*)/);

    return base + parsed[1];
};

cleverapps.MobageSocial.prototype._aboutMe = function (callback) {
    callback(this.user);
};

cleverapps.MobageSocial.prototype.getName = function () {
    return Messages.get("mbga");
};

cleverapps.MobageSocial.CODE_SUCCEED = "ok";
