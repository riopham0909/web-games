/**
 * Created by slava on 11/9/18
 */

var PiggyBank = function () {
    this.active = undefined;
    this.when = undefined;
    this.level = undefined;
    this.amount = 0;

    this.load();
};

PiggyBank.prototype.load = function () {
    var save = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.PIGGY_BANK) || {};
    this.active = save.active || false;
    this.when = save.when || undefined;
    this.level = save.level || 0;
    this.amount = save.amount || 0;

    this.updateState();
};

PiggyBank.prototype.getInfo = function () {
    return {
        active: this.active,
        when: this.when,
        level: this.level,
        amount: this.amount
    };
};

PiggyBank.prototype.updateInfo = function (data, fromServer) {
    this.active = data.active;
    this.when = data.when;
    this.level = data.level;
    this.amount = data.amount;
    
    this.save(fromServer);
};

PiggyBank.prototype.getLeftTime = function () {
    return cleverapps.parseInterval(PiggyBank.LIFETIME) - (Date.now() - this.when);
};

PiggyBank.prototype.getProduct = function () {
    return Product.Create(PiggyBank.PRODUCTS[this.level]) || Product.Create(PiggyBank.VIRTUAL_PRODUCTS[this.level]);
};

PiggyBank.prototype.buy = function (closeShopCallback) {
    var product = this.getProduct();
    product.reward = this.getReward() || product.reward;

    product.buy(function (success) {
        if (success) {
            this.stop();

            closeShopCallback();
        }
    }.bind(this));
};

PiggyBank.prototype.updateState = function () {
    var needSave = false;

    if (this.active) {
        if (this.when + cleverapps.parseInterval(PiggyBank.LIFETIME) < Date.now()) {
            this.active = false;
            this.when += cleverapps.parseInterval(PiggyBank.LIFETIME);
            needSave = true;

            this.logStop();
        }
    }

    if (!this.active) {
        if (this.when === undefined || this.when + cleverapps.parseInterval(PiggyBank.INTERMISSION) < Date.now()) {
            this.start();
            needSave = false;
        }
    }

    if (needSave) {
        this.save();
    }

    clearTimeout(this.timer);
    this.timer = new cleverapps.LongTimeout(function () {
        cleverapps.sideBar.resetByClassName(PiggyBankIcon);
    }, this.getLeftTime());
};

PiggyBank.prototype.save = function (fromServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.PIGGY_BANK, this.getInfo());
    if (!fromServer) {
        cleverapps.synchronizer.addUpdateTask("piggybank");
    }
};

PiggyBank.prototype.getReward = function () {
    if (this.isActive()) {
        var reward = {};
        reward[this.getRewardCurrency()] = this.amount;
        return reward;
    }
};

PiggyBank.prototype.getBaseAmount = function () {
    return this.getProduct().reward[this.getRewardCurrency()];
};

PiggyBank.prototype.getAddAmount = function () {
    return (this.getMaxAmount() - this.getBaseAmount()) / PiggyBank.WINS_TO_FULFILL;
};

PiggyBank.prototype.getMaxAmount = function () {
    return Math.round(this.getBaseAmount() * PiggyBank.MAX_COEF / PiggyBank.WINS_TO_FULFILL) * PiggyBank.WINS_TO_FULFILL;
};

PiggyBank.prototype.isFull = function () {
    return this.amount >= this.getMaxAmount();
};

PiggyBank.prototype.add = function (amount) {
    if (this.isFull()) {
        return;
    }

    this.amount += amount;

    this.save();

    if (this.isFull()) {
        cleverapps.sideBar.resetByClassName(PiggyBankIcon);
    }
};

PiggyBank.MAX_COEF = 1.4;

PiggyBank.prototype.start = function () {
    this.active = true;
    this.when = Date.now();

    this.level = cleverapps.paymentsHistory.classify();
    if (this.level === cleverapps.PaymentsHistory.BRACKET_UNDECIDED) {
        this.level = cleverapps.PaymentsHistory.BRACKET_NONE;
    }
    if (this.level === cleverapps.PaymentsHistory.BRACKET_BIGWHALE) {
        this.level = cleverapps.PaymentsHistory.BRACKET_WHALE;
    }

    this.amount = this.getBaseAmount();
    this.save();
};

PiggyBank.prototype.getCurrentAmount = function () {
    var amount = cleverapps.formatAmount(this.amount);
    return this.getRewardCurrency() === "soft" ? "@@" + amount : "$$" + amount;
};

PiggyBank.prototype.getCurrentPrice = function () {
    return this.getProduct().getCurrentPrice();
};

PiggyBank.prototype.getRewardCurrency = function () {
    return this.getProduct().reward.soft ? "soft" : "hard";
};

PiggyBank.prototype.logStop = function () {
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.PIGGY_BANK + "_stop");
    if (this.isFull()) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.PIGGY_BANK + "_stop_full");
    }
};

PiggyBank.prototype.stop = function () {
    this.logStop();

    this.active = false;
    this.when = Date.now();
    this.save();

    cleverapps.sideBar.resetByClassName(PiggyBankIcon);
};

PiggyBank.prototype.isActive = function () {
    if (!levels.user.checkAvailable(PiggyBank.AVAILABLE)) {
        return false;
    }

    if (cleverapps.flags.videoAdsMainMonetization) {
        return false;
    }

    this.updateState();

    return this.active;
};

PiggyBank.OnRestoreSuccess = function () {
    if (cleverapps.piggyBank) {
        cleverapps.piggyBank.stop();
    }
};

PiggyBank.GetRestoreReward = function () {
    if (cleverapps.piggyBank && cleverapps.piggyBank.isActive()) {
        return cleverapps.piggyBank.getReward();
    }
};

PiggyBank.AVAILABLE = {
    level: 3.6
};

PiggyBank.PRODUCTS = ["piggybank500", "piggybank1800", "piggybank6000", "piggybank25000"];
PiggyBank.VIRTUAL_PRODUCTS = ["piggybankSmall", "piggybankMedium", "piggybankLarge", "piggybankHuge"];

PiggyBank.WINS_TO_FULFILL = 10;
PiggyBank.LIFETIME = cleverapps.config.debugMode ? "10 minutes" : "3 days";
PiggyBank.INTERMISSION = cleverapps.config.debugMode ? "1 minute" : "3 days";

if (cleverapps.config.type === "board") {
    PiggyBank.WINS_TO_FULFILL = 5;
}