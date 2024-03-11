/**
 * Created by andrey on 14.05.18.
 */

var RewardedVideoToolbarItem = function () {
    ToolbarItem.call(this, ToolbarItem.REWARDED_VIDEO);

    this.nextTime = 0;
    cleverapps.adsLimits.on("update", this.update.bind(this));

    this.update();
};

RewardedVideoToolbarItem.prototype = Object.create(ToolbarItem.prototype);
RewardedVideoToolbarItem.prototype.constructor = RewardedVideoToolbarItem;

RewardedVideoToolbarItem.prototype.update = function () {
    if (this.isAvailable()) {
        this.enable();
    } else {
        this.disable();
    }

    var watchCount = cleverapps.adsLimits.getWatchCount(AdsLimits.TYPES.TOOLBAR);

    if (this.watchCount !== watchCount) {
        this.watchCount = watchCount;
        this.onChangeStateListener();
    }
};

RewardedVideoToolbarItem.prototype.getText = function () {
    var reward = this.getReward();
    if (reward.hard) {
        return "+" + reward.hard + "$$";
    }
    return "+" + reward.soft + "@@";
};

RewardedVideoToolbarItem.prototype.enable = function () {
    if (!this.enabled) {
        ToolbarItem.prototype.enable.apply(this);
        this.mark();
    }
};

RewardedVideoToolbarItem.prototype.onClick = function () {
    this.disable();

    cleverapps.rewardedAdsManager.loadAndPlay({
        type: RewardedAdsManager.REWARDED,
        adLimit: AdsLimits.TYPES.TOOLBAR,
        callback: this.reward.bind(this)
    });
};

RewardedVideoToolbarItem.prototype.isAvailable = function () {
    return cleverapps.rewardedAdsManager.isEnabled() && cleverapps.adsLimits.state(AdsLimits.TYPES.TOOLBAR) === AdsLimits.STATE_READY && this.nextTime < Date.now();
};

RewardedVideoToolbarItem.prototype.reward = function () {
    this.nextTime = Date.now() + cleverapps.parseInterval(RewardedVideoToolbarItem.TIMEOUT);

    var reward = this.getReward();
    cleverapps.adsLimits.watch(AdsLimits.TYPES.TOOLBAR);
    cleverapps.meta.displayWhenFreeFocus({
        focus: "RewardedAdToolbarReward",
        action: function (f) {
            new RewardWindow(reward);
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};

RewardedVideoToolbarItem.prototype.getReward = function () {
    var watchCount = cleverapps.adsLimits.getWatchCount(AdsLimits.TYPES.TOOLBAR);
    var amount;
    if (watchCount < 1) {
        amount = 10;
    } else if (watchCount < 2) {
        amount = 5;
    } else {
        amount = 2;
    }

    var type = cleverapps.config.soft ? "soft" : "hard";
    var reward = {};
    reward[type] = amount;
    return reward;
};

RewardedVideoToolbarItem.TIMEOUT = "1 minute";
