/**
 * Created by slava on 8/8/17
 */

var BaseBooster = function (id) {
    cleverapps.EventEmitter.call(this);
    this.id = id;

    var data = cleverapps.Boosters.CONFIG[id];
    this.price = data.price;
    this.force = data.force;
    this.available = data.available;
    this.icon = data.icon;
    this.limit = data.limit;
    this.executeEffect = data.executeEffect;
    this.disableForceOnInactive = data.disableForceOnInactive;
};

BaseBooster.prototype = Object.create(cleverapps.EventEmitter.prototype);
BaseBooster.prototype.constructor = BaseBooster;

BaseBooster.prototype.onGameStarted = function () {

};

BaseBooster.prototype.isDisabled = function () {
    return !levels.user.checkAvailable(this.available);
};

BaseBooster.prototype.getPrice = function () {
    if (!this.price) {
        return;
    }
    if (cleverapps.config.soft) {
        return {
            soft: true,
            amount: this.price.soft 
        };
    }
    return { amount: this.price.hard };
};

BaseBooster.prototype.getAmount = function () {
    return cleverapps.boosters.getAmount(this.id);
};

BaseBooster.prototype.setAmount = function (amount) {
    return cleverapps.boosters.setAmount(this.id, amount);
};

BaseBooster.prototype.buy = function () {
    var eventName = cleverapps.EVENTS.SPENT.BOOSTER;
    var price = this.getPrice();
    var bought = price.soft ? cleverapps.user.spendSoft(eventName, price.amount)
        : cleverapps.user.spendHard(eventName, price.amount);

    if (bought) {
        cleverapps.boosters.add(this.id, 1);
    }

    return bought;
};

BaseBooster.prototype.use = function () {
    if (cleverapps.boosters.has(this.id)) {
        cleverapps.boosters.take(this.id);

        this.logUseEvents();

        this.onUsed();
    }
};

BaseBooster.prototype.logUseEvents = function () {
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.HINT_USED, { value: this.getPrice().amount });
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.BOOSTERS_EXECUTE + "_" + this.id);
};

BaseBooster.prototype.onUsed = function () {
    cleverapps.eventBus.trigger("taskEvent", DailyTasks.USE_BOOSTER);
};

BaseBooster.prototype.execute = function () {
    this.use();
};

BaseBooster.prototype.canExecute = function () {
    return cleverapps.boosters.has(this.id);
};

BaseBooster.prototype.isAdsAvailable = function () {
    var price = this.getPrice().amount;
    var enoughToBuy = cleverapps.config.soft ? cleverapps.user.canTakeSoft(price) : cleverapps.user.canTakeHard(price);
    return cleverapps.adsLimits.state(this.limit) === AdsLimits.STATE_READY && !enoughToBuy;
};

BaseBooster.prototype.isForceAvailable = function () {
    return this.isAvailable() && !cleverapps.forces.isShown(this.force.id);
};

BaseBooster.prototype.isAvailable = function () {
    return !cleverapps.gameModes.noBoosters && levels.user.checkAvailable(this.available);
};

BaseBooster.prototype.getState = function () {
    if (this.canExecute()) {
        return BaseBooster.AMOUNT_STATE;
    } if (this.isAdsAvailable()) {
        return BaseBooster.ADS_STATE;
    }
    return BaseBooster.PRICE_STATE;
};

BaseBooster.AMOUNT_STATE = 0;
BaseBooster.ADS_STATE = 1;
BaseBooster.PRICE_STATE = 2;
