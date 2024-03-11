/**
 * Created by Oleg on 28/12/18
 */

var Subscription = function () {
    cleverapps.EventEmitter.call(this);

    this.active = false;
    this.rewardTime = 0;
    this.tokens = {};

    this.updateInfo(cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.SUBSCRIPTION) || {}, false);

    this.reload();
    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, this.reload.bind(this));
};

Subscription.prototype = Object.create(cleverapps.EventEmitter.prototype);
Subscription.prototype.constructor = Subscription;

Subscription.calcSource = function () {
    var source = cleverapps.platform.source;
    if (source === "mobile_ok") {
        source = "web_ok";
    }
    return source;
};

Subscription.prototype.getInfo = function (toServer) {
    var sourceData = {
        active: this.active,
        rewardTime: this.rewardTime,
        tokens: this.tokens
    };

    if (toServer && cleverapps.platform.oneOf(Apple)) {
        delete sourceData.tokens;
    }

    var data = {};
    data[Subscription.calcSource()] = sourceData;
    return data;
};

Subscription.prototype.updateInfo = function (data, fromServer) {
    var source = Subscription.calcSource();
    data = data && data[source];
    if (data) {
        this.active = Boolean(data.id) || data.active;
        this.rewardTime = data.rewardTime || data.lastRewardTime || 0;
        this.tokens = cleverapps.override({}, data.tokens || {}, this.tokens);

        this.save(fromServer);
    }
};

Subscription.prototype.save = function (fromServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.SUBSCRIPTION, this.getInfo());

    if (!fromServer) {
        cleverapps.synchronizer.addUpdateTask("subscription");
    }
};

Subscription.prototype.getLeftTime = function () {
    if (!this.isActive()) {
        return;
    }

    return Math.max(this.rewardTime + cleverapps.parseInterval(Subscription.REWARD_INTERVAL) - Date.now(), 0);
};

Subscription.prototype.scheduleReload = function () {
    clearTimeout(this.reloadTimeout);
    this.reloadTimeout = new cleverapps.LongTimeout(this.reload.bind(this), cleverapps.parseInterval(Subscription.RELOAD_INTERVAL));
};

Subscription.prototype.reload = function () {
    this.scheduleReload();

    if (cleverapps.platform.oneOf(CleverApps) && !cleverapps.config.debugMode && this.active) {
        this.active = false;
        this.save();
        this.trigger("update");
    }

    if (!Subscription.IsAvailable() || cleverapps.isLocalhost() || cleverapps.platform.oneOf(CleverApps)) {
        return;
    }

    cleverapps.payments.getSubscriptionStatus({ tokens: this.tokens }, function (data) {
        var oldActive = this.isActive();

        // console.log("subscription - " + JSON.stringify(data));
        this.active = data && data.active;

        this.save();
        this.trigger("update");

        if (oldActive && !this.isActive()) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SUBSCRIPTION_CANCELLED);
        }
    }.bind(this));
};

Subscription.prototype.buy = function (product, callback) {
    var onSuccess = function (success) {
        if (!success) {
            return;
        }

        if (cleverapps.platform.oneOf(IOS, MacOS, AndroidPlatform)) {
            Subscription.BUY_RELOADS.forEach(function (timeout) {
                new cleverapps.LongTimeout(this.reload.bind(this), cleverapps.parseInterval(timeout));
            }, this);
        }
        this.scheduleReload();

        this.active = true;
        this.rewardTime = 0;
        this.save();

        this.trigger("update");
        this.receiveReward();

        callback();
    }.bind(this);

    if (cleverapps.platform.oneOf(CleverApps)) {
        onSuccess(cleverapps.config.debugMode);
    } else {
        product.buy(onSuccess);
    }
};

Subscription.prototype.addPurchaseTokens = function (purchases, restore) {
    if (!Array.isArray(purchases)) {
        purchases = [purchases];
    }

    var changed = false;
    purchases.forEach(function (purchase) {
        var name = purchase.name;
        var purchaseToken = purchase.purchaseToken;
        var productId = purchase.productId;
        var packageName = purchase.packageName;

        var current = this.tokens[name] || {};

        if (name && purchaseToken && productId && packageName
            && (current.purchaseToken !== purchaseToken || current.productId !== productId
                || current.packageName !== packageName)) {
            this.tokens[name] = {
                productId: productId,
                packageName: packageName,
                purchaseToken: purchaseToken
            };
            changed = true;
        }
    }.bind(this));

    if (changed) {
        if (restore && !this.isActive()) {
            this.lastReloadTime = 0;
            this.reload();
        }
        this.save();
    }
};

Subscription.prototype.isRewardReady = function () {
    return this.getLeftTime() === 0;
};

Subscription.prototype.needsAttention = function () {
    return this.isRewardReady();
};

Subscription.CalcReward = function () {
    var instantRewards = Subscription.calcSource() === "instant" && RewardsConfig.SubscriptionInstant;
    var reward = cleverapps.clone(instantRewards || RewardsConfig.Subscription, true);
    return cleverapps.user.setRandomBoostersReward(reward);
};

Subscription.prototype.receiveReward = function () {
    if (!this.isRewardReady()) {
        return;
    }

    var reward = Subscription.CalcReward();

    if (reward.unit) {
        var left = -Game.currentGame.map.countEmptySlots();
        cleverapps.toArray(reward.unit).forEach(function (unit) {
            left += unit.amount;
        });

        if (left > 0) {
            Game.currentGame.centerHint.createTextHint("Spawn.nospace", { left: left });
            return;
        }
    }

    new RewardWindow(reward, {
        title: "SubscriptionRewardWindow.title",
        name: "subscriptionrewardwindow",
        text: "MiniGameRewardWindow.text",
        toMainWorld: cleverapps.travelBook.isExpedition()
    });

    this.rewardTime = Date.now();

    this.save();
    this.trigger("update");

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SUBSCRIPTION_REWARD);
};
if (cleverapps.config.debugMode) {
    Subscription.prototype.reset = function () {
        this.active = false;
        this.rewardTime = 0;
        this.tokens = {};
        this.save();
    };
}

Subscription.prototype.isActive = function () {
    return this.active;
};

Subscription.prototype.needDisplayWindow = function () {
    return Subscription.IsAvailable() && !this.isActive();
};

Subscription.IsAvailable = function () {
    if (!Subscription.IsModelAvailable()) {
        return false;
    }

    if (cleverapps.subscription && cleverapps.subscription.isActive()) {
        return true;
    }

    if (cleverapps.platform.oneOf(AndroidPlatform) && cleverapps.payments instanceof YooKassaPayments) {
        return false;
    }

    if (cleverapps.payments instanceof InstantPayments && !cleverapps.payments.isSubscriptionsAvailable()) {
        return false;
    }

    return cleverapps.payments.isAvailable() && cleverapps.user.checkAvailable(Subscription.AVAILABLE);
};

Subscription.IsModelAvailable = function () {
    var projects = [];
    switch (cleverapps.platform.source) {
        case "web_ok":
        case "mobile_ok":
            projects = Subscription.MODEL_AVAILABLE_OK;
            break;
        case "facebook":
            projects = Subscription.MODEL_AVAILABLE_FACEBOOK;
            break;
        case "android":
            projects = Subscription.MODEL_AVAILABLE_ANDROID;
            break;
        case "ios":
        case "macos":
            projects = Subscription.MODEL_AVAILABLE_IOS;
            break;
        case "instant":
            projects = cleverapps.config.debugMode ? Subscription.MODEL_AVAILABLE_INSTANT : [];
            break;
        case "cleverapps":
            projects = cleverapps.config.debugMode ? Subscription.MODEL_AVAILABLE_XSOLLA : [];
            break;
    }

    if (cleverapps.config.debugMode && (cleverapps.platform instanceof OKPlatform || cleverapps.platform instanceof MobileOK || TestSocial.isAppropriate())) {
        projects = Subscription.MODEL_AVAILABLE_OK.concat(Subscription.MODEL_AVAILABLE_FACEBOOK);
    }
    return projects.indexOf(cleverapps.config.name) !== -1;
};

Subscription.MODEL_AVAILABLE_OK = ["mergecraft", "wondermerge", "fairy", "heroes", "riddles", "wordsoup", "crocword", "tripeaks", "runes", "olympics", "scramble", "differences", "magicwords"];
Subscription.MODEL_AVAILABLE_FACEBOOK = ["mergecraft", "wondermerge", "fairy", "heroes", "riddles", "wordsoup", "crocword", "tripeaks", "scramble", "magicwords", "runes", "differences"];
Subscription.MODEL_AVAILABLE_ANDROID = ["mergecraft", "wondermerge", "fairy", "heroes", "riddles", "wordsoup", "crocword", "tripeaks", "olympics", "scramble", "differences"];
Subscription.MODEL_AVAILABLE_IOS = ["mergecraft", "crocword", "wordsoup", "tripeaks"];
Subscription.MODEL_AVAILABLE_INSTANT = ["mergecraft", "wondermerge", "fairy", "tripeaks"];
Subscription.MODEL_AVAILABLE_XSOLLA = ["mergecraft", "wondermerge", "fairy", "heroes", "riddles", "wordsoup", "crocword", "tripeaks", "runes", "olympics", "scramble", "differences", "magicwords"];

Subscription.AVAILABLE = {
    level: 6
};

if (cleverapps.config.type === "merge") {
    Subscription.AVAILABLE = {
        level: 7.5
    };
}

Subscription.REWARD_INTERVAL = "24 hours";
Subscription.RELOAD_INTERVAL = "30 minutes";
Subscription.BUY_RELOADS = ["1 minute", "3 minutes", "5 minutes", "10 minutes"];

if (cleverapps.config.debugMode) {
    Subscription.REWARD_INTERVAL = "20 minutes";
    Subscription.RELOAD_INTERVAL = "1 minute";
    Subscription.BUY_RELOADS = ["5 seconds", "10 seconds", "15 seconds", "20 seconds", "30 seconds", "40 seconds"];
}
