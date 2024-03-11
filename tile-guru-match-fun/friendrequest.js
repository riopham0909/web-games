/**
 * Created by slava on 15/8/17
 */

levels.FriendRequest = function (data) {
    this.id = data.id;
    this.from = data.from;
    this.type = data.type;
    this.fake = data.fake;
    this.onRemoveListener = function () {};
};

levels.FriendRequest.prototype.getId = function () {
    return this.id;
};

levels.FriendRequest.prototype.getView = function () {
    if (this.canView()) {
        return levels.FriendRequestView;
    }
    return undefined;
};

levels.FriendRequest.prototype.canView = function () {
    return levels.FriendRequest.REQUEST_TYPES[this.type];
};

levels.FriendRequest.prototype.isFake = function () {
    return this.fake === true;
};

levels.FriendRequest.prototype.onServer = function () {
    return !this.isFake();
};

levels.FriendRequest.prototype.getData = function () {
    return {
        id: this.id,
        from: this.from,
        type: this.type,
        fake: this.fake
    };
};

levels.FriendRequest.prototype.process = function () {
    var data = levels.FriendRequest.REQUEST_TYPES[this.type];

    if (data.checkProcess) {
        if (!data.checkProcess()) {
            return;
        }
    }

    var f = function () {
        if (data.createNewRequestId) {
            levels.friendRequests.sendServerRequest(this.from, data.createNewRequestId);
        }
        if (data.onProcess) {
            data.onProcess(this);
        }

        this.remove();
    }.bind(this);

    if (!data.fbRequest) {
        f();
    } else {
        cleverapps.social.sendRequest(this.from, data.fbRequest, f);
    }
};

levels.FriendRequest.prototype.remove = function () {
    levels.friendRequests.processById(this.getId());
    this.onRemoveListener();
};

levels.FriendRequest.prototype.cancel = function () {
    levels.friendRequests.processById(this.getId());
    this.onRemoveListener();
};

levels.FriendRequest.createFriendRequest = function (data) {
    return new levels.FriendRequest(data);
};

levels.FriendRequest.addLiveProcess = function (request) {
    request.animateCollect("lives", function () {
        cleverapps.lives.give(1, "help");
    });
};

levels.FriendRequest.checkAddLiveProcess = function () {
    return true;
};

levels.FriendRequest.addStarProcess = function (request) {
    request.animateCollect("stars", function () {
        cleverapps.starChest.addStars(1);
    });
};

levels.FriendRequest.addCoinsProcess = function (request, amount) {
    amount = amount || levels.FriendRequest.HELP_COINS_AMOUNT;
    request.animateCollect("hard", function () {
        cleverapps.user.earnHard(cleverapps.EVENTS.EARN.FRIEND_REQUEST, amount);
    });
};

levels.FriendRequest.addCoinsStuckProcess = function (request) {
    levels.FriendRequest.addCoinsProcess(request, levels.FriendRequest.STUCK_COINS_AMOUNT);
};

levels.FriendRequest.TYPE_ASK_LIVE = 0;
levels.FriendRequest.TYPE_SENT_LIVE = 1;
levels.FriendRequest.TYPE_ASK_STAR = 2;
levels.FriendRequest.TYPE_SENT_STAR = 3;
levels.FriendRequest.TYPE_ASK_HELP_LIVE = 4;
levels.FriendRequest.TYPE_SENT_HELP_LIVE = 5;
levels.FriendRequest.TYPE_ASK_HELP_STAR = 6;
levels.FriendRequest.TYPE_SENT_HELP_STAR = 7;
levels.FriendRequest.TYPE_ASK_HELP_COINS = 9;
levels.FriendRequest.TYPE_SENT_HELP_COINS = 10;
levels.FriendRequest.TYPE_ASK_COINS = 12;
levels.FriendRequest.TYPE_SENT_COINS = 13;
levels.FriendRequest.TYPE_STUCK_HELP_COINS = 14;

levels.FriendRequest.HELP_COINS_AMOUNT = 10;
levels.FriendRequest.STUCK_COINS_AMOUNT = 50;

levels.FriendRequest.REQUEST_TYPES = {};

levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_ASK_LIVE] = {
    image: bundles.request_center.frames.send_life_icon,
    button_type: cleverapps.styles.UI.Button.Images.small_button_blue,
    button_text: "Send",
    text: "AskLiveRequest",
    fbRequest: "sendLiveRequest",
    createNewRequestId: levels.FriendRequest.TYPE_SENT_LIVE
};

levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_SENT_LIVE] = {
    image: bundles.request_center.frames.send_life_icon,
    imageText: "+1",
    button_type: cleverapps.styles.UI.Button.Images.small_button_green,
    button_text: "Accept",
    text: "SendLiveRequest",
    fbRequest: "thanksForLiveRequest",
    onProcess: levels.FriendRequest.addLiveProcess,
    checkProcess: levels.FriendRequest.checkAddLiveProcess
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_ASK_STAR] = {
    image: bundles.request_center.frames.send_star_icon,
    button_type: cleverapps.styles.UI.Button.Images.small_button_blue,
    button_text: "Send",
    text: "AskStarRequest",
    fbRequest: "sendStarRequest",
    createNewRequestId: levels.FriendRequest.TYPE_SENT_STAR
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_SENT_STAR] = {
    image: bundles.request_center.frames.send_star_icon,
    imageText: "+1",
    button_type: cleverapps.styles.UI.Button.Images.small_button_green,
    button_text: "Accept",
    text: "SendStarRequest",
    fbRequest: "thanksForStarRequest",
    onProcess: levels.FriendRequest.addStarProcess
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_ASK_HELP_LIVE] = {
    image: bundles.request_center.frames.send_life_icon,
    button_type: cleverapps.styles.UI.Button.Images.small_button_blue,
    button_text: "Send",
    text: "AskHelpRequest",
    fbRequest: "sentHelpRequest",
    createNewRequestId: levels.FriendRequest.TYPE_SENT_HELP_LIVE
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_SENT_HELP_LIVE] = {
    image: bundles.request_center.frames.send_life_icon,
    imageText: "+1",
    button_type: cleverapps.styles.UI.Button.Images.small_button_green,
    button_text: "Accept",
    text: "SentHelpRequest",
    fbRequest: "thanksForHelpRequest",
    onProcess: levels.FriendRequest.addLiveProcess,
    checkProcess: levels.FriendRequest.checkAddLiveProcess
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_ASK_HELP_STAR] = {
    image: bundles.request_center.frames.send_star_icon,
    button_type: cleverapps.styles.UI.Button.Images.small_button_blue,
    button_text: "Send",
    text: "AskHelpRequest",
    fbRequest: "sentHelpRequest",
    createNewRequestId: levels.FriendRequest.TYPE_SENT_HELP_STAR
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_SENT_HELP_STAR] = {
    image: bundles.request_center.frames.send_star_icon,
    imageText: "+1",
    button_type: cleverapps.styles.UI.Button.Images.small_button_green,
    button_text: "Accept",
    text: "SentHelpRequest",
    fbRequest: "thanksForHelpRequest",
    onProcess: levels.FriendRequest.addStarProcess
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_ASK_HELP_COINS] = {
    image: bundles.request_center.frames.send_coins_icon,
    button_type: cleverapps.styles.UI.Button.Images.small_button_blue,
    button_text: "Send",
    text: "AskHelpRequest",
    fbRequest: "sentHelpRequest",
    createNewRequestId: levels.FriendRequest.TYPE_SENT_HELP_COINS
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_SENT_HELP_COINS] = {
    image: bundles.request_center.frames.send_coins_icon,
    imageText: "+10",
    button_type: cleverapps.styles.UI.Button.Images.small_button_green,
    button_text: "Accept",
    text: "SentHelpRequest",
    fbRequest: "thanksForHelpRequest",
    onProcess: levels.FriendRequest.addCoinsProcess
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_ASK_COINS] = {
    image: bundles.request_center.frames.send_coins_icon,
    button_type: cleverapps.styles.UI.Button.Images.small_button_blue,
    button_text: "Send",
    text: "AskCoinsRequest",
    fbRequest: "sendCoinsRequest",
    createNewRequestId: levels.FriendRequest.TYPE_SENT_COINS
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_SENT_COINS] = {
    image: bundles.request_center.frames.send_coins_icon,
    imageText: "+10",
    button_type: cleverapps.styles.UI.Button.Images.small_button_green,
    button_text: "Accept",
    text: "SendCoinsRequest",
    fbRequest: "thanksForCoinsRequest",
    onProcess: levels.FriendRequest.addCoinsProcess
};
levels.FriendRequest.REQUEST_TYPES[levels.FriendRequest.TYPE_STUCK_HELP_COINS] = {
    image: bundles.request_center.frames.accept_stuck_coins_icon,
    imageText: "+50",
    button_type: cleverapps.styles.UI.Button.Images.small_button_green,
    button_text: "Accept",
    text: "SendStuckHelpRequest",
    onProcess: levels.FriendRequest.addCoinsStuckProcess
};

levels.FriendRequest.SYSTEM_ID = -1;