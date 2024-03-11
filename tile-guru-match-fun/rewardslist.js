/**
 * Created by r4zi4l on 22.06.2022
 */

var RewardsList = function (reward, options) {
    this.options = options || {};
    this.rewards = [];

    Object.keys(reward).forEach(function (type) {
        var value = reward[type];

        if (type === "unit") {
            type = "units";
        }

        if (!RewardTypes[type]) {
            cleverapps.throwAsync("unknown reward type '" + type + "'");
            return;
        }

        if (type === "boosters") {
            Object.keys(value).filter(function (id) {
                return value[id];
            }).forEach(function (id) {
                this.rewards.push(new Reward(type, { id: id, amount: value[id] }, this.options));
            }, this);
            return;
        }

        if (type === "keys") {
            Object.keys(value).filter(function (name) {
                return value[name];
            }).forEach(function (name) {
                this.rewards.push(new Reward(type, { name: name, amount: value[name] }, this.options));
            }, this);
            return;
        }

        if (type === "herolevels") {
            value.forEach(function (herolevel) {
                this.rewards.push(new Reward(type, { color: herolevel[0], level: herolevel[1] }, this.options));
            }, this);
            return;
        }

        if (type === "units") {
            cleverapps.toArray(value).forEach(function (unit) {
                this.rewards.push(new Reward(type, unit, this.options));
            }, this);
            return;
        }

        if (type === "mission") {
            var mission = cleverapps.missionManager.findRunningMission(value.missionType);
            if (mission) {
                this.rewards.push(new Reward(type, value, this.options));
            }
            return;
        }

        if (type === "clover") {
            if (!Game.currentGame || !Game.currentGame.secondaryMission || !Game.currentGame.secondaryMission.isRunning()) {
                return;
            }
        }

        if (type === "troopCards") {
            for (var i = 0; i < value.amount; i++) {
                this.rewards.push(new Reward("troop", {
                    code: TroopCards.PickCode(value.probabilities),
                    stage: 0
                }));
            }
            return;
        }

        this.rewards.push(new Reward(type, value, this.options));
    }, this);
    this.rewards = this.sortRewards();
};

RewardsList.prototype.sortRewards = function () {
    return this.rewards.filter(function (reward) {
        return !reward.isFlyingUnderShadow();
    }).concat(this.rewards.filter(function (reward) {
        return reward.isFlyingUnderShadow();
    }));
};

RewardsList.prototype.receiveRewards = function () {
    if (this.received) {
        return;
    }
    this.received = true;

    this.rewards.forEach(function (reward) {
        reward.receiveReward();
    });
};

RewardsList.prototype.onAnimationFinished = function () {
    this.rewards.forEach(function (reward) {
        reward.onAnimationFinished();
    });
};

RewardsList.prototype.listRewards = function () {
    return this.rewards;
};

RewardsList.prototype.listControls = function () {
    return this.rewards.reduce(function (controls, reward) {
        return controls.concat(reward.listControls());
    }, []);
};

RewardsList.prototype.listBundles = function () {
    return this.rewards.reduce(function (controls, reward) {
        return controls.concat(reward.listBundles());
    }, []);
};

RewardsList.prototype.isBigReward = function () {
    return this.rewards.some(function (reward) {
        return reward.type === "units" && (reward.value.code === "coinsplant" || reward.value.code === "rubiesplant" || reward.value.code === "magicplant" && reward.value.stage === 5);
    });
};

RewardsList.prototype.collectRewardsAnimation = function (source, options) {
    options = options || {};

    var jumpSides = ["left", "right"];
    var delay = options.delay || 0;
    var side = 0;
    var deltaOffset = 0;

    this.rewards.forEach(function (reward) {
        options.jumpSide = jumpSides[side % jumpSides.length];
        options.delay = delay;
        options.deltaOffset = deltaOffset;
        reward.collectRewardsAnimation(source, options);

        side += 1;
        delay += 500 + reward.getFlyingAmount() * 250;
        deltaOffset += cleverapps.styles.RewardsList.deltaOffset;
    });
    return delay || 0;
};

RewardsList.prototype.filter = function (filter) {
    this.rewards = this.rewards.filter(filter);
};

RewardsList.prototype.underShadowRewardIndex = function () {
    var index = 0;

    for (; index < this.rewards.length; ++index) {
        if (this.rewards[index].isFlyingUnderShadow()) {
            return index;
        }
    }

    return index;
};

cleverapps.styles.RewardsList = {
    deltaOffset: -28
};
