/**
 * Created by andrey on 02.07.2020
 */

var BaseBoosterBefore = function (id) {
    BaseBooster.call(this, id);

    this.spentEvent = cleverapps.EVENTS.SPENT.BOOSTER_BEFORE;
};

BaseBoosterBefore.prototype = Object.create(BaseBooster.prototype);
BaseBoosterBefore.prototype.constructor = BaseBoosterBefore;

BaseBoosterBefore.prototype.onUsed = function () {
    cleverapps.eventBus.trigger("taskEvent", DailyTasks.USE_BOOSTER_BEFORE);
};

BaseBoosterBefore.prototype.onGiveUp = function () {
    if (cleverapps.lives && !this.getLanternBonus()) {
        cleverapps.boosters.add(this.id, 1);
    }
};

BaseBoosterBefore.prototype.getLanternBonus = function () {
    return Lantern.GetBoosterBonus(Game.currentGame.level, this);
};

BaseBoosterBefore.prototype.logUseEvents = cleverapps.extendFunc(BaseBoosterBefore.prototype.logUseEvents, function () {
    if (!this.getLanternBonus()) {
        this._super();
    }
});

BaseBoosterBefore.prototype.execute = cleverapps.extendFunc(BaseBoosterBefore.prototype.execute, function () {
    var bonus = this.getLanternBonus();

    if (bonus) {
        this.setAmount(this.getAmount() + 1);
    }

    this._super();
});

BaseBoosterBefore.prototype.getExecuteDuration = function () {
    return cleverapps.config.name === "scramble" ? 0 : 0.3;
};

BaseBoosterBefore.prototype.isUpcoming = function () {
    var boosters = cleverapps.boosters.listBoostersBefore();

    for (var i = 0; i < boosters.length; i++) {
        if (!boosters[i].isAvailable()) {
            return boosters[i] === this;
        }
    }

    return false;
};