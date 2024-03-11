/**
 * Created by iamso on 10.08.2021
 */

var SubscriptionTileModel = function (data) {
    TileModel.call(this, data);

    this.onClaim = function () {};
    if (cleverapps.subscription) {
        cleverapps.subscription.on("update", this.updateModelState.bind(this), this);
    }
};

SubscriptionTileModel.prototype = Object.create(TileModel.prototype);
SubscriptionTileModel.prototype.constructor = SubscriptionTileModel;

SubscriptionTileModel.prototype.getReward = function () {
    var instantRewards = Subscription.calcSource() === "instant" && RewardsConfig.SubscriptionInstant;
    var reward = cleverapps.clone(instantRewards || RewardsConfig.Subscription, true);
    if (reward.worker && reward.worker.subscription && !reward.worker.amount) {
        reward.worker.amount = 1;
    }
    return reward;
};

SubscriptionTileModel.prototype.getTitle = function () {
    return Messages.get("TileShop.subscription.title");
};

SubscriptionTileModel.prototype.getViewClassName = function () {
    return SubscriptionTile;
};

SubscriptionTileModel.prototype.getCurrentActionText = function () {
    return cleverapps.subscription.isRewardReady() ? "Claim" : "TileShop.subscription.details"; 
};

SubscriptionTileModel.prototype.isEnabled = function () {
    return Subscription.IsAvailable() && cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition()
        && (cleverapps.subscription.isActive() || !cleverapps.flags.videoAdsMainMonetization);
};

SubscriptionTileModel.prototype.isAvailable = function () {
    return Subscription.IsAvailable() && !cleverapps.subscription.getLeftTime();
};

SubscriptionTileModel.prototype.isAttention = function () {
    return cleverapps.subscription && cleverapps.subscription.needsAttention();
};

SubscriptionTileModel.prototype.isSmall = function () {
    return false;
};

SubscriptionTileModel.prototype.getDescription = function () {
    var description = {};
    if (Subscription.IsAvailable()) {
        description.rewards = this.getReward();
    } else {
        description.title = "TileShop.subscription.reachLvl";
    }
    return description;
};

SubscriptionTileModel.prototype.getDisabledPrice = function () {
    return Messages.get(Subscription.IsAvailable() ? "Claim" : "TileShop.tile.level", {
        level: cleverapps.humanReadableNumber({ floatLevel: Subscription.AVAILABLE.level })
    });
};

SubscriptionTileModel.prototype.getRewardsIcon = function () {
    return bundles.tile_shop.frames.prem_crown;
};
