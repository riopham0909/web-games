/**
 * Created by vladislav on 11.01.2022
 */

var WindowBoosterBefore = function (booster, level) {
    cleverapps.EventEmitter.call(this);

    this.booster = booster;
    this.level = level;

    this.selected = false;

    this.changeAmountListener = this.booster.on("changeAmount", this.onChangeAmount.bind(this));

    this.onChangeAmount();
};

WindowBoosterBefore.prototype = Object.create(cleverapps.EventEmitter.prototype);
WindowBoosterBefore.prototype.constructor = WindowBoosterBefore;

WindowBoosterBefore.prototype.onChangeAmount = function () {
    if (this.isDisabled()) {
        delete this.bonus;
    } else {
        this.bonus = Lantern.GetBoosterBonus(this.level, this.booster);
    }

    this.trigger("changeAmount");
};

WindowBoosterBefore.prototype.getIcon = function () {
    if (this.isDisabled()) {
        return bundles.boosters_before.frames.booster_before_lock_png;
    }

    return this.booster.icon;
};

WindowBoosterBefore.prototype.getLevelAvailable = function () {
    return cleverapps.humanReadableNumber({ floatLevel: this.booster.available.level });
};

WindowBoosterBefore.prototype.getAmount = function () {
    return this.booster.getAmount();
};

WindowBoosterBefore.prototype.getForce = function () {
    return this.booster.force;
};

WindowBoosterBefore.prototype.getPrice = function () {
    return this.booster.getPrice().amount;
};

WindowBoosterBefore.prototype.setSelected = function (selected) {
    if (this.selected !== selected) {
        this.selected = selected;
        this.trigger("update");
    }
};

WindowBoosterBefore.prototype.onClick = function () {
    if (cleverapps.forces.isRunningForce()) {
        cleverapps.forces.closeRunningForce();
    }

    if (this.isLantern() || !this.isActive()) {
        return;
    }

    if (this.isAd()) {
        cleverapps.rewardedAdsManager.loadAndPlay({
            type: RewardedAdsManager.REWARDED,
            adLimit: this.booster.limit,
            callback: function () {
                cleverapps.adsLimits.watch(this.booster.limit);
                cleverapps.boosters.add(this.booster.id, 1);
                this.setSelected(true);
            }.bind(this)
        });
        return;
    }

    if (this.isSelected()) {
        this.setSelected(false);
    } else if (this.booster.canExecute() || this.booster.buy()) {
        this.setSelected(true);
    }
};

WindowBoosterBefore.prototype.isSelected = function () {
    return this.selected;
};

WindowBoosterBefore.prototype.isActive = function () {
    return this.booster.isAvailable();
};

WindowBoosterBefore.prototype.isDisabled = function () {
    return !this.booster.isAvailable() || this.booster.isUpcoming();
};

WindowBoosterBefore.prototype.isUpcoming = function () {
    return this.booster.isUpcoming();
};

WindowBoosterBefore.prototype.isAd = function () {
    return this.booster.isAdsAvailable() && this.getAmount() <= 0;
};

WindowBoosterBefore.prototype.isLantern = function () {
    return Lantern.GetBoosterBonus(this.level, this.booster) && !this.booster.isForceAvailable();
};

WindowBoosterBefore.prototype.showTutorialStep = function (f) {
    if (this.booster.isForceAvailable() && this.isActive()) {
        if (!cleverapps.boosters.has(this.booster.id)) {
            cleverapps.boosters.add(this.booster.id, 1);
        }

        this.trigger("showForce", f);
    } else {
        f();
    }
};

WindowBoosterBefore.prototype.onExit = function () {
    if (this.changeAmountListener) {
        this.changeAmountListener.clear();
        delete this.changeAmountListener;
    }
};
