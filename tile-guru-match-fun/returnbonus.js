/**
 * Created by mac on 9/16/21
 */

var ReturnBonus = function () {
    cleverapps.social.hasPromoGift(function (result) {
        this.hasReward = result;
    }.bind(this));
};

ReturnBonus.prototype.shouldReward = function () {
    return this.hasReward;
};

ReturnBonus.prototype.giveReward = function () {
    cleverapps.meta.display({
        focus: "ReturnBonusRewardWindow",
        action: function (f) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.RETURNBONUS_REWARD);

            this.hasReward = false;
            cleverapps.social.usePromoGift();

            new RewardWindow(ReturnBonus.REWARD, {
                title: "ReturnBonusRewardWindow.title"
            });

            cleverapps.meta.onceNoWindowsListener = f;
        }.bind(this)
    });
};

ReturnBonus.REWARD = { hard: 150 };
if (cleverapps.config.type === "merge") {
    ReturnBonus.REWARD = {
        energy: 100,
        hard: 5,
        soft: 100,
        worker: "6 hour"
    };
} else if (cleverapps.config.type === "match3") {
    ReturnBonus.REWARD = {
        unlimitedLives: "6 hours",
        hard: 100,
        boosters: {
            5: 1,
            6: 1
        }
    };
} else if (cleverapps.config.name === "wordsoup") {
    ReturnBonus.REWARD = {
        homeStar: 10,
        hard: 150
    };
}