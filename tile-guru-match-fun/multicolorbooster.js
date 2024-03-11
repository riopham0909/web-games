/**
 * Created by andrey on 21.05.2020
 */

var MultiColorBooster = function() {
    BaseBoosterBefore.call(this, cleverapps.Boosters.TYPE_MULTICOLOR);
};

MultiColorBooster.prototype = Object.create(BaseBoosterBefore.prototype);
MultiColorBooster.prototype.constructor = MultiColorBooster;

MultiColorBooster.prototype.execute = function() {
    BaseBoosterBefore.prototype.execute.call(this);

    var amount = 1;

    var multicolorsCreated = Game.currentGame.field.addRandomMulticolor(amount, {
        boosterBefore: true
    });
    if (multicolorsCreated < amount ) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.BOOSTER_MULTICOLOR_NO_PLACE, {value: amount - multicolorsCreated});
        this.onGiveUp();
    }
};

