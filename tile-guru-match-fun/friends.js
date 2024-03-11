/**
 * Created by slava on 30/8/17
 */

var FriendsCache = function (isInvitable) {
    this.data = {};
    this.player = undefined;
    this.lastUpdateTime = 0;
    this.isInvitable = isInvitable;

    this.load();

    this.onUserUpdatedListener = function () {};
    this.playerInfoChangedListeners = {};
};

FriendsCache.prototype.getStoreKey = function () {
    if (this.isInvitable) {
        return SimpleDataLoader.TYPES.INVITABLE_FRIENDS;
    }
    return SimpleDataLoader.TYPES.FRIENDS;
};

FriendsCache.prototype.reset = function () {
    this.data = {};
    this.player = undefined;
    this.lastUpdateTime = 0;
    this.save();
};

FriendsCache.prototype.load = function () {
    var stored = cleverapps.platform.dataLoader.load(this.getStoreKey());
    if (stored) {
        this.data = stored.data;
        this.player = stored.player;
        this.lastUpdateTime = stored.when;
    }
};

FriendsCache.prototype.save = function () {
    var info = {
        data: this.data,
        player: this.player,
        when: this.lastUpdateTime
    };
    cleverapps.platform.dataLoader.save(this.getStoreKey(), info);
};

FriendsCache.prototype.isEmpty = function () {
    if (this.lastUpdateTime === 0) {
        return true;
    }

    return this.data.length === 0;
};

FriendsCache.prototype.haveData = function () {
    return this.lastUpdateTime !== 0;
};

FriendsCache.prototype.setData = function (friends) {
    // console.log("Loaded new friends list: ", friends);

    this.data = {};
    friends.forEach(function (friend) {
        this.data[friend.id] = {
            id: friend.id,
            name: friend.first_name,
            avatar: friend.picture && friend.picture.data && friend.picture.data.url
        };
    }, this);

    this.lastUpdateTime = Date.now();
    this.save();
};

FriendsCache.prototype.getPlayer = function () {
    var defaultInfo = FriendsCache.DEFAULT_PLAYER_INFO();

    if (this.player) {
        return {
            id: this.player.id || defaultInfo.id,
            self: true,
            name: this.player.name || defaultInfo.name,
            avatar: this.player.avatar || defaultInfo.avatar
        };
    }

    return defaultInfo;
};

FriendsCache.prototype.updatePlayerInfo = function (info) {
    var oldPlayer = this.getPlayer();
    this.player = {
        id: cleverapps.platform.getUserID(),
        self: true,
        name: info.first_name,
        avatar: info.picture && info.picture.data && info.picture.data.url
    };

    this.save();

    if (oldPlayer.id !== this.player.id || oldPlayer.name !== this.player.name || oldPlayer.avatar !== this.player.avatar) {
        this.onUserUpdatedListener();

        cleverapps.values(this.playerInfoChangedListeners).forEach(function (listener) {
            listener(oldPlayer.id);
        });
    }
};

FriendsCache.prototype.getById = function (id) {
    return this.data[id];
};

FriendsCache.prototype.listIds = function () {
    return Object.keys(this.data);
};

FriendsCache.prototype.listFriends = function () {
    return cleverapps.values(this.data);
};

FriendsCache.prototype.inApp = function (id) {
    return this.data[id] !== undefined;
};

FriendsCache.prototype.reload = function () {
    if (!cleverapps.social.isLoggedIn()) {
        // console.log("Waiting for login to update friends results");
        return;
    }

    if (this.isInvitable) {
        // console.log("Will update invitable friends?");
        // console.log("Asking social for invitable friends list");

        cleverapps.social.listInvitableFriends(function (code, friends) {
            if (friends !== undefined) {
                this.setData(friends);
            }
        }.bind(this));
    } else {
        // console.log("Will update friends?");
        // console.log("Asking social for friends list");

        cleverapps.social.listFriends(function (code, friends) {
            if (friends !== undefined) {
                this.setData(friends);
            }
        }.bind(this));
    }
};

FriendsCache.RELOAD_INTERVAL = cleverapps.parseInterval("1 hour");
FriendsCache.DEFAULT_PLAYER_INFO = function () {
    return {
        id: cleverapps.platform.getUserID(),
        self: true,
        name: Messages.get("Friends.You"),
        avatar: "#avatars/default_avatar.png"
    };
};
