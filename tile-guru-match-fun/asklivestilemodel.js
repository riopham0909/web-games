/**
 * Created by iamso on 24.04.19.
 */

var AskLivesTileModel = function (data) {
    TileModel.call(this, data);
};

AskLivesTileModel.prototype = Object.create(TileModel.prototype);
AskLivesTileModel.prototype.constructor = AskLivesTileModel;

AskLivesTileModel.prototype.getCurrentPrice = function () {
    return "FREE";
};

AskLivesTileModel.prototype.getProductDescription = function () {
    return {
        text: "AskLivesProduct.description"
    };
};

AskLivesTileModel.prototype.isEnabled = function () {
    return !cleverapps.flags.norequest;
};

AskLivesTileModel.prototype.buy = function (closeShopCallback) {
    cleverapps.social.checkConnection(function () {
        new SelectFriendWindow("askLives", function (ids, onSuccessAsk) {
            cleverapps.social.sendRequest(ids, "askLiveRequest", function () {
                ids.forEach(function (id) {
                    if (cleverapps.friends.inApp(id)) {
                        levels.friendRequests.sendServerRequest(id, levels.FriendRequest.TYPE_ASK_LIVE);
                    }
                });

                onSuccessAsk();
                closeShopCallback();
            });
        });
    });
};
