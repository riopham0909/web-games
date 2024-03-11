/**
 * https://doc.thinkingdata.cn/ta-manual/latest/en/installation/installation/client_sdk/game_engine_sdk_installation/cocoscreator_sdk_installation/cocoscreator_sdk_installation.html#_1-sdk-integration
 *
 * Created by andrey on 01.11.2023
 */

var ThinkingData = function () {
    window.thinkingdata = new ThinkingAnalyticsAPI({
        appId: cleverapps.config.wechat.thinkingData.appId,
        serverUrl: cleverapps.config.wechat.thinkingData.serverUrl,
        autoTrack: {
            appShow: true,
            appHide: true
        }
    });

    this.queue = [];

    this.trackedTutorials = cleverapps.createSet(ThinkingData.TUTORIALS_ORDER);

    thinkingdata.init();
    this.initTotalAmount();

    this.updateUserId();
};

ThinkingData.prototype.initTotalAmount = function () {
    this.totalPriceAmount = cleverapps.paymentsHistory.price.reduce(function (sum, price) {
        var loadedPrice = cleverapps.payments.calcLoadedPrice(price);

        var loadedPriceAmount = cleverapps.payments.getLoadedPriceAmount(loadedPrice);

        return sum + loadedPriceAmount;
    }, 0);
};

ThinkingData.prototype.updateUserId = function () {
    if (cleverapps.platform.haveTmpId()) {
        return;
    }

    this.initialized = true;

    thinkingdata.login(cleverapps.platform.getUserID());

    this.send("userSetOnce", { register_time_v1: new Date(cleverapps.user.registered) });

    if (cleverapps.user.channel) {
        this.send("userSetOnce", { channel: cleverapps.user.channel });
    }

    this.send("userSet", {
        last_login_time: new Date(),
        current_coin: cleverapps.user.soft,
        current_diamond: cleverapps.user.gold,
        current_level: Math.round(cleverapps.user.getFloatLevel()),
        current_energy: cleverapps.lives && cleverapps.lives.amount,
        current_hero: cleverapps.unitsLibrary && cleverapps.unitsLibrary.listOpenedOfType("hero").length
    });

    for (var i = 0; i < this.queue.length; i++) {
        this.send(this.queue[i].method, this.queue[i].properties);
    }
    this.queue = [];
};

ThinkingData.prototype.logEvent = function (eventName, properties) {
    properties = Object.assign({}, properties || {}, {
        cur_level: Math.round(cleverapps.user.getFloatLevel()),
        cur_diamond: cleverapps.user.gold,
        cur_coin: cleverapps.user.soft,
        cur_energy: cleverapps.lives && cleverapps.lives.amount,
        total_days: cleverapps.user.getDaysSinceRegistration(),
        total_purchase_amount: this.totalPriceAmount
    });

    if (properties.store_type) {
        properties.store_type = properties.store_type.replace("ShopWindow.title.", "");
    }

    properties.eventName = eventName;

    this.send("track", properties);
};

ThinkingData.prototype.logPurchase = function (product) {
    this.totalPriceAmount += product.loadedPriceAmount;

    this.send("userSetOnce", { first_pay_time: new Date() });
    this.send("userSet", { last_pay_time: new Date() });

    this.send("userAdd", {
        total_pay_amount: product.loadedPriceAmount,
        total_pay_count: 1
    });
};

ThinkingData.prototype.logTutorialStep = function (tutorialId, step) {
    if (!this.trackedTutorials[tutorialId]) {
        return;
    }
    
    var newGuideId = step;
    for (var i = 0; i < ThinkingData.TUTORIALS_ORDER.length; i++) {
        var id = ThinkingData.TUTORIALS_ORDER[i];

        if (id === tutorialId) {
            break;
        }

        newGuideId += MergeTutorials[id].steps.length;
    }

    this.logEvent("new_guide", { new_guide_id: newGuideId });
};

ThinkingData.prototype.logWatchAds = function () {
    this.send("userAdd", { total_ad_num: 1 });
};

ThinkingData.prototype.send = function (method, properties) {
    if (!this.initialized) {
        this.queue.push({ method: method, properties: properties });

        if (this.queue.length > ThinkingData.QUEUE_LIMIT) {
            this.queue.shift();
        }

        return;
    }

    switch (method) {
        case "userSetOnce":
        case "userSet":
        case "userAdd":
            thinkingdata[method](properties);
            break;
        case "track":
            var eventName = properties.eventName;
            delete properties.eventName;
            thinkingdata.track(eventName, properties);
            break;
    }
};

ThinkingData.TUTORIALS_ORDER = [
    "dwarf",
    "wheat_3",
    "dishes_0",
    "openfog2",
    "wood_1",
    "wood_2"
];

ThinkingData.IsAvailable = function () {
    return cleverapps.platform.oneOf(Wechat) && cleverapps.config.wechat && cleverapps.config.wechat.thinkingData;
};

ThinkingData.QUEUE_LIMIT = 100;