/**
 * Created by slava on 15/2/18
 */

var FriendSorter = function() {
    this.data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.SORTER);

    if (!this.data) {
        this.data = {};
    }

    if (cleverapps.config.debugMode) {
        FriendSorter.PRIVACY_INTERVAL = '1 minute';
    }

    this.update();
};

FriendSorter.PRIVACY_INTERVAL = '1 day';

FriendSorter.prototype.update = function() {
    var remained = {};
    var now = Date.now();

    var changed = false;

    for (var id in this.data) {
        if (this.data[id] + cleverapps.parseInterval(FriendSorter.PRIVACY_INTERVAL) > now) {
            remained[id] = this.data[id];
        } else {
            changed = true;
        }
    }

    if (changed) {
        this.data = remained;

        this.save();
    }
};

FriendSorter.prototype.save = function() {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.SORTER, this.data);
};

FriendSorter.prototype.canUse = function(id) {
    return this.data[id] === undefined;
};

FriendSorter.prototype.markUsed = function(ids) {
    ids.forEach(function(id) {
        this.data[id] = Date.now();
    }, this);

    this.save();
};

FriendSorter.prototype.listActiveFriends = function() {
    return cleverapps.friends.listFriends();
};

FriendSorter.prototype.listInactiveFriends = function() {
    var res = cleverapps.invitalbleFriends.listFriends();

    this.update();

    res = res.filter(function(friend) {
        return friend && this.data[friend.id] === undefined;
    }, this);

    return res;
};