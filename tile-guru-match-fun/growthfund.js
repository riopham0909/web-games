/**
 * Created by iamso on 16.08.2021
 */

var GrowthFund = function () {
    cleverapps.EventEmitter.call(this);

    this.received = -1;
    this.levels = [];

    this.load();
    this.createLevels();

    cleverapps.user.on("incLevel", this.onUserIncLvl.bind(this));
    cleverapps.exp.on("changeExp", this.onUserChangeExp.bind(this));

    if (this.isBought()) {
        cleverapps.playSession.set(cleverapps.EVENTS.FUND_DAU, true);
    }
};

GrowthFund.prototype = Object.create(cleverapps.EventEmitter.prototype);
GrowthFund.prototype.constructor = GrowthFund;

GrowthFund.prototype.isBought = function () {
    return this.received > -1;
};

GrowthFund.prototype.onUserChangeExp = function () {
    if (cleverapps.flags.videoAdsMainMonetization) {
        return;
    }

    var isActive = this.isActive();
    this.wantsAttention = this.wantsAttention || isActive && !this.wasActive;
    this.wasActive = isActive;
};

GrowthFund.prototype.onUserIncLvl = function () {
    if (cleverapps.gameLevel && cleverapps.gameLevel.withOwnLevel) {
        return;
    }

    this.calcLevelsState();

    if (!cleverapps.flags.videoAdsMainMonetization && this.isActive()) {
        if (this.findByLevelNo(cleverapps.user.getVirtualLevel() - 1)) {
            this.wantsAttention = true;
        }
    }
};

GrowthFund.prototype.afterBuy = function (silent) {
    this.buyTime = Date.now();
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FUND_BUY);
    this.received = 0;
    this.save();

    if (!silent) {
        this.onBought();
    }
};

GrowthFund.prototype.onBought = function () {
    this.trigger("updateState");
};

GrowthFund.prototype.createLevels = function () {
    for (var level = GrowthFund.LEVELS.start; level <= GrowthFund.LEVELS.finish; level += GrowthFund.LEVELS.step) {
        this.levels.push({
            levelNo: level,
            reward: GrowthFund.LEVELS.rewards[level] || GrowthFund.LEVELS.rewards.default
        });
    }

    this.calcLevelsState();
};

GrowthFund.prototype.calcLevelsState = function () {
    this.levels.forEach(function (level) {
        if (level.levelNo > cleverapps.user.getVirtualLevel() - 1) {
            level.state = GrowthFund.STATE.INSUFFICIENT;
        } else if (level.levelNo <= this.received) {
            level.state = GrowthFund.STATE.RECEIVED;
        } else if (this.received > 0) {
            if (level.levelNo === this.received + GrowthFund.LEVELS.step) {
                level.state = GrowthFund.STATE.READY;
            } else {
                level.state = GrowthFund.STATE.WAITING;
            }
        } else if (level.levelNo === GrowthFund.LEVELS.start) {
            level.state = GrowthFund.STATE.READY;
        } else {
            level.state = GrowthFund.STATE.WAITING;
        }
    }, this);
};

GrowthFund.prototype.takeReward = function (level) {
    if (!this.buyTime || Date.now() - this.buyTime > cleverapps.parseInterval("10 minutes")) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FUND_GOLD, {
            amount: this.findByLevelNo(level).reward
        });
    }

    this.received = level;
    this.calcLevelsState();
    this.trigger("updateState");
    this.save();
};

GrowthFund.prototype.findByLevelNo = function (level) {
    for (var i in this.levels) {
        if (this.levels[i].levelNo === level) {
            return this.levels[i];
        }
    }
};

GrowthFund.prototype.findFirst = function (state) {
    for (var i in this.levels) {
        if (this.levels[i].state === state) {
            return this.levels[i];
        }
    }
};

GrowthFund.prototype.isRewardReady = function () {
    return this.findFirst(GrowthFund.STATE.READY);
};

GrowthFund.prototype.save = function (fromServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.GROWTHFUND, this.getInfo());

    if (!fromServer) {
        cleverapps.synchronizer.addUpdateTask("growthfund");
    }
};

GrowthFund.prototype.getInfo = function () {
    return this.received;
};

GrowthFund.prototype.load = function () {
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.GROWTHFUND);
    this.setInfo(data === undefined ? -1 : data);
};

GrowthFund.prototype.setInfo = function (data) {
    this.received = data;

    if (typeof data === "object") {
        this.received = -1;
        if (data.bought || data.lastReceived !== undefined) {
            this.received = data.lastReceived || 0;
        }
    }

    this.wasActive = this.isActive();
};

GrowthFund.prototype.updateInfo = function (serverData) {
    this.setInfo(serverData);
    this.save(true);

    this.calcLevelsState();
};

GrowthFund.prototype.isActive = function () {
    return cleverapps.user.getFloatLevel() >= GrowthFund.LEVELS.available || this.isBought();
};

GrowthFund.prototype.getTotalWaitingRewards = function () {
    var total = 0;
    this.levels.forEach(function (level) {
        if ([GrowthFund.STATE.READY, GrowthFund.STATE.WAITING].indexOf(level.state) !== -1) {
            total += level.reward;
        }
    });

    return total;
};

GrowthFund.prototype.needsAttention = function () {
    return this.isBought() && this.isRewardReady() || this.wantsAttention;
};

GrowthFund.GetRestoreReward = function () {
    if (cleverapps.growthFund && !cleverapps.growthFund.isBought()) {
        return { growthFund: true };
    }
};

GrowthFund.STATE = {
    INSUFFICIENT: 0,
    WAITING: 1,
    READY: 2,
    RECEIVED: 3
};

GrowthFund.LEVELS = {
    available: 6.1,
    start: 1,
    finish: 49,
    step: 1,
    rewards: {
        default: 450,
        1: 550
    }
};