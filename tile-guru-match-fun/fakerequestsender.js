var FakeRequestSender = {
    load: function () {
        var fakeRequestsData = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.FAKE_REQUESTS);
        if (!fakeRequestsData) {
            fakeRequestsData = {
                lastLoadTime: 0
            };
        }

        return fakeRequestsData;
    },

    save: function (fakeRequestsData) {
        fakeRequestsData.lastLoadTime = Date.now();
        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.FAKE_REQUESTS, fakeRequestsData);
    },

    sendIfNeed: function (friendRequests) {
        if (cleverapps.friends.listIds().length === 0 || cleverapps.config.type === "merge") {
            return;
        }

        if (cleverapps.flags.norequest) {
            return;
        }

        var fakeRequestsData = FakeRequestSender.load();

        var amountToSend = Math.floor((Date.now() - fakeRequestsData.lastLoadTime) / cleverapps.parseInterval(FakeRequestSender.REQUEST_PERIOD));
        if (amountToSend <= 0) {
            return;
        }

        var fakeRequests = friendRequests.notProcessed.filter(function (request) {
            return request.isFake();
        });
        if (amountToSend > FakeRequestSender.MAX_REQUESTS - fakeRequests.length) {
            amountToSend = FakeRequestSender.MAX_REQUESTS - fakeRequests.length;
        }

        var sended = false;
        var activeFriends = levels.friendSorter.listActiveFriends();
        cleverapps.Random.shuffle(activeFriends);

        if (activeFriends.length > 10) {
            activeFriends = activeFriends.slice(0, 10);
        }

        for (var i = 0; i < activeFriends.length && amountToSend > 0; i++) {
            var friend = activeFriends[i];
            if (friendRequests.existRequestFrom(friend.id)) {
                continue;
            }

            var type = cleverapps.Random.mathChoose(this.listFakeRequestsTypes(friendRequests));

            amountToSend--;
            sended = true;

            friendRequests.notProcessed.push(levels.FriendRequest.createFriendRequest({
                id: "__" + Math.floor(Math.random() * 1000000000000000),
                from: friend.id,
                type: type,
                fake: true
            }));
        }

        if (sended) {
            friendRequests.onNewListener();
            FakeRequestSender.save(fakeRequestsData);
            friendRequests.save();
        }
    },

    listFakeRequestsTypes: function (friendRequests) {
        var types = [levels.FriendRequest.TYPE_ASK_HELP_LIVE, levels.FriendRequest.TYPE_ASK_HELP_STAR, levels.FriendRequest.TYPE_ASK_HELP_COINS];
        var availableTypes = friendRequests.listAvailableTypes();

        return types.filter(function (type) {
            return availableTypes.indexOf(type) !== -1;
        });
    }
};

FakeRequestSender.MAX_REQUESTS = 2;

FakeRequestSender.REQUEST_PERIOD = "12 hours";

if (["crocword", "scramble", "magicwords"].indexOf(cleverapps.config.name) !== -1) {
    FakeRequestSender.REQUEST_PERIOD = "3 hours";
}

if (cleverapps.config.debugMode) {
    FakeRequestSender.REQUEST_PERIOD = "1 minute";
}