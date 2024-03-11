/**
 * Created by slava on 15/8/17
 */

levels.FriendRequests = function () {
    this.load();

    this.lastServerReload = 0;
    this.onNewListener = function () {};
    this.onChangeListener = function () {};

    if (cleverapps.flags.norequest) {
        this.deleteFakeRequests();
    }

    this.serverReload();
    FakeRequestSender.sendIfNeed(this);

    setInterval(function () {
        this.serverReload();
        FakeRequestSender.sendIfNeed(this);
    }.bind(this), cleverapps.parseInterval("1 minute"));
};

levels.FriendRequests.prototype.load = function () {
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.FRIEND_REQUESTS);
    if (!data) {
        this.notProcessed = [];
        this.processedIds = [];
    } else {
        this.notProcessed = [];
        var availableTypes = this.listAvailableTypes();
        data.notProcessed = data.notProcessed.filter(function (request) {
            return availableTypes.indexOf(request.type) !== -1;
        });
        for (var i = 0; i < data.notProcessed.length; i++) {
            this.notProcessed.push(levels.FriendRequest.createFriendRequest(data.notProcessed[i]));
        }
        this.processedIds = data.processedIds;
    }
};

levels.FriendRequests.prototype.save = function () {
    var notProcessed = [];
    for (var i = 0; i < this.notProcessed.length; i++) {
        notProcessed.push(this.notProcessed[i].getData());
    }
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.FRIEND_REQUESTS, {
        notProcessed: notProcessed,
        processedIds: this.processedIds
    });
};

levels.FriendRequests.prototype.idInNotProcessed = function (id) {
    for (var i = 0; i < this.notProcessed.length; i++) {
        if (this.notProcessed[i].getId() === id) {
            return true;
        }
    }
    return false;
};

levels.FriendRequests.prototype.lastNotProcessedId = function () {
    for (var i = this.notProcessed.length - 1; i >= 0; i--) {
        if (this.notProcessed[i].canView()) {
            return this.notProcessed[i].id;
        }
    }
    return false;
};

levels.FriendRequests.prototype.existNotProcessed = function () {
    for (var i = 0; i < this.notProcessed.length; i++) {
        if (this.notProcessed[i].canView()) {
            return true;
        }
    }
    return false;
};

levels.FriendRequests.prototype.existRequestFrom = function (from) {
    for (var i = 0; i < this.notProcessed.length; i++) {
        if (this.notProcessed[i].canView() && this.notProcessed[i].from === from) {
            return true;
        }
    }
    return false;
};

levels.FriendRequests.prototype.existRequestTypes = function (types) {
    for (var i = 0; i < this.notProcessed.length; i++) {
        if (types.indexOf(this.notProcessed[i].type) >= 0) {
            return true;
        }
    }
    return false;
};

levels.FriendRequests.prototype.processById = function (id) {
    var changed = false;
    var onServer = false;

    for (var i = 0; i < this.notProcessed.length; i++) {
        if (this.notProcessed[i].getId() === id) {
            if (this.notProcessed[i].onServer()) {
                onServer = true;
            }
            this.notProcessed.splice(i, 1);
            changed = true;
            break;
        }
    }
    if (onServer) {
        this.processedIds.push(id);
        this.deleteOnServerById(id);
    }

    if (changed) {
        this.onChangeListener();
    }

    this.save();
};

levels.FriendRequests.prototype.onServerLoad = function (data) {
    var newProcessedIds = [];
    var added = false;
    var availableTypes = this.listAvailableTypes();
    if (!Array.isArray(data)) {
        cleverapps.throwAsync("FriendRequests.onServerLoad data type is - " + (typeof data));
        data = [];
    }
    data = data.filter(function (request) {
        return availableTypes.indexOf(request.type) !== -1;
    });
    for (var i = 0; i < data.length; i++) {
        if (this.processedIds.indexOf(data[i].id) >= 0) {
            this.deleteOnServerById(data[i].id);
            newProcessedIds.push(data[i].id);
        } else if (!this.idInNotProcessed(data[i].id)) {
            this.notProcessed.push(levels.FriendRequest.createFriendRequest({
                id: data[i].id,
                from: data[i].fromUserId,
                type: data[i].type
            }));
            added = true;
        }
    }
    this.processedIds = newProcessedIds;
    this.save();

    if (added) {
        this.onNewListener();
        this.onChangeListener();
    }
};

levels.FriendRequests.prototype.sendServerRequest = function (toUserId, type) {
    cleverapps.RestClient.post("/friendrequests/create/" + encodeURIComponent(cleverapps.platform.getUserID()) + "/a", {
        toUserId: toUserId,
        type: type
    });
};

levels.FriendRequests.prototype.deleteOnServerById = function (id) {
    cleverapps.RestClient.post("/friendrequests/delete/" + encodeURIComponent(cleverapps.platform.getUserID()) + "/a", {
        id: id
    });
};

levels.FriendRequests.prototype.serverReload = function () {
    if (this.lastServerReload < Date.now() - cleverapps.parseInterval(levels.FriendRequests.RELOAD_INTERVAL) && cleverapps.synchronizer.synced) {
        this.lastServerReload = Date.now();
        cleverapps.RestClient.get("/friendrequests/getmy/" + encodeURIComponent(cleverapps.platform.getUserID()) + "/a", {}, this.onServerLoad.bind(this));
    }
};

levels.FriendRequests.prototype.deleteFakeRequests = function () {
    var filtered = this.notProcessed.filter(function (request) {
        return !request.fake;
    });

    if (filtered.length !== this.notProcessed.length) {
        this.notProcessed = filtered;
        this.onChangeListener();
        this.save();
    }
};

levels.FriendRequests.prototype.listAvailableTypes = function () {
    var types = [
        levels.FriendRequest.TYPE_STUCK_HELP_COINS
    ];

    if (typeof match3 === "undefined") {
        types = types.concat([
            levels.FriendRequest.TYPE_SENT_COINS,
            levels.FriendRequest.TYPE_ASK_COINS,
            levels.FriendRequest.TYPE_SENT_HELP_COINS,
            levels.FriendRequest.TYPE_ASK_HELP_COINS
        ]);
    }

    if (cleverapps.lives) {
        types = types.concat([
            levels.FriendRequest.TYPE_SENT_HELP_LIVE,
            levels.FriendRequest.TYPE_ASK_HELP_LIVE,
            levels.FriendRequest.TYPE_SENT_LIVE,
            levels.FriendRequest.TYPE_ASK_LIVE
        ]);
    }

    if (cleverapps.starChest) {
        types = types.concat(([
            levels.FriendRequest.TYPE_SENT_HELP_STAR,
            levels.FriendRequest.TYPE_ASK_HELP_STAR,
            levels.FriendRequest.TYPE_SENT_STAR,
            levels.FriendRequest.TYPE_ASK_STAR
        ]));
    }

    return types;
};

levels.FriendRequests.RELOAD_INTERVAL = "10 minutes";