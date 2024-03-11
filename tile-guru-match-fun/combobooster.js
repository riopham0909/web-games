/**
 * Created by andrey on 21.05.2020
 */

var ComboBooster = function() {
    BaseBoosterBefore.call(this, cleverapps.Boosters.TYPE_COMBO);
};

ComboBooster.prototype = Object.create(BaseBoosterBefore.prototype);
ComboBooster.prototype.constructor = ComboBooster;

ComboBooster.prototype.execute = function() {
    BaseBoosterBefore.prototype.execute.call(this);

    var amount = ComboBooster.COMBOS_AMOUNT;
    var timeouts = ComboBooster.COMBOS_TIMEOUTS.slice(0, amount);

    var combosCreated = Game.currentGame.field.addRandomCombo(amount, {
        boosterBefore: true,
        timeouts: timeouts
    });
    if (combosCreated < amount) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.BOOSTER_COMBO_NO_PLACE, {value: (amount - combosCreated)});
    }
    if (combosCreated <= amount - ComboBooster.COMBOS_AMOUNT) {
        this.onGiveUp();
    }
};

ComboBooster.COMBOS_AMOUNT = 5;
ComboBooster.COMBOS_TIMEOUTS = [0, 120, 250, 360, 500, 620, 750, 860, 1000, 1100];