/**
 * Created by r4zi4l on 04.08.2021
 */

var LimitedVideoTileModel = function (data) {
    TileModel.call(this, data);

    this.baseReward = cleverapps.flags.videoAdsMainMonetization && this.product.mainMonetizationReward || this.product.reward;

    if (typeof this.baseReward === "function") {
        this.baseReward = this.baseReward();
    }

    this.adsLimit = this.product.adsLimit();

    cleverapps.adsLimits.on("update", this.updateModelState.bind(this), this);
};

LimitedVideoTileModel.prototype = Object.create(TileModel.prototype);
LimitedVideoTileModel.prototype.constructor = LimitedVideoTileModel;

LimitedVideoTileModel.prototype.getTitle = function () {
    var reward = this.baseReward.hard || this.baseReward.soft || this.baseReward.lives || this.baseReward.energy;
    if (Array.isArray(reward)) {
        return Messages.getLocalized(this.product.title, {
            minAmount: reward[0],
            maxAmount: reward[1]
        });
    }
    return Messages.getLocalized(this.product.title, {
        restoreAmount: reward
    });
};

LimitedVideoTileModel.prototype.processReward = function (reward) {
    if (Array.isArray(reward)) {
        return cleverapps.Random.random(reward[0], reward[1]);
    }
    return reward;
};

LimitedVideoTileModel.prototype.isEnabled = function () {
    if (this.product.free) {
        return true;
    }

    return cleverapps.rewardedAdsManager.isEnabled();
};

LimitedVideoTileModel.prototype.isAvailable = function () {
    return cleverapps.adsLimits.state(this.adsLimit) === AdsLimits.STATE_READY;
};

LimitedVideoTileModel.prototype.getReward = function () {
    return this.baseReward;
};

LimitedVideoTileModel.prototype.getDisabledPrice = function () {
    if (cleverapps.adsLimits.state(this.adsLimit) === AdsLimits.STATE_UNAVAILABLE) {
        return Messages.get("TileShop.tile.level", {
            level: cleverapps.adsLimits.getLimitLevel(this.adsLimit)
        });
    }
};

LimitedVideoTileModel.prototype.getCurrentPrice = function () {
    if (this.product.free) {
        return "FREE";
    }
    return "##Watch";
};

LimitedVideoTileModel.prototype.getProductLimit = function () {
    if ([AdsLimits.STATE_UNAVAILABLE, AdsLimits.STATE_LIMITED].indexOf(cleverapps.adsLimits.state(this.adsLimit)) === -1) {
        var countLeft = Messages.getLocalized("TileShop.tile.left", {
            amount: cleverapps.adsLimits.getLimitLeftCount(this.adsLimit)
        });
    }

    if (cleverapps.adsLimits.state(this.adsLimit) === AdsLimits.STATE_LIMITED) {
        var timeLeft = cleverapps.adsLimits.getLimitLeftTime(this.adsLimit);
    }

    return {
        left: countLeft,
        countdown: timeLeft
    };
};

LimitedVideoTileModel.prototype.getProductDescription = function () {
    if (cleverapps.config.type !== "merge") {
        return {
            reward: true
        };
    }

    if (cleverapps.adsLimits.state(this.adsLimit) === AdsLimits.STATE_LIMITED) {
        var timeLeft = cleverapps.adsLimits.getLimitLeftTime(this.adsLimit);
    }

    return {
        text: this.product.description,
        countdown: timeLeft
    };
};

LimitedVideoTileModel.prototype.buy = function () {
    var onSuccess = function () {
        cleverapps.adsLimits.watch(this.adsLimit);
        cleverapps.audio.playSound(bundles.main.urls.shop_buy_effect);

        var reward = {};
        if (this.baseReward.hard) {
            reward.hard = this.processReward(this.baseReward.hard);
        }
        if (this.baseReward.soft) {
            reward.soft = this.processReward(this.baseReward.soft);
        }
        if (this.baseReward.lives) {
            reward.lives = this.processReward(this.baseReward.lives);
        }
        if (this.baseReward.energy) {
            reward.energy = this.processReward(this.baseReward.energy);
        }

        if (cleverapps.meta.isFocused()) {
            new RewardWindow(reward);
        } else {
            cleverapps.meta.display({
                focus: "energyRewardWindow",
                action: function (f) {
                    new RewardWindow(reward);
                    cleverapps.meta.onceNoWindowsListener = f;
                }
            });
        }
    }.bind(this);

    if (this.product.free) {
        onSuccess();
    } else {
        cleverapps.rewardedAdsManager.playRewarded(this.adsLimit, onSuccess);
    }
};
