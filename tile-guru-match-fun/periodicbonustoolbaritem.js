/**
 * Created by ivan on 11.04.18.
 */

var PeriodicBonusToolbarItem = function () {
    ToolbarItem.call(this, ToolbarItem.PERIODIC_BONUS);

    this.countdown = cleverapps.periodicBonus.countdown;

    cleverapps.periodicBonus.changeLockedListener = this.changeLocked.bind(this);

    this.changeLocked();
};

PeriodicBonusToolbarItem.prototype = Object.create(ToolbarItem.prototype);
PeriodicBonusToolbarItem.prototype.constructor = PeriodicBonusToolbarItem;

PeriodicBonusToolbarItem.prototype.isVisible = function () {
    return levels.user.checkAvailable(cleverapps.MiniGame.AVAILABLE);
};

PeriodicBonusToolbarItem.prototype.unlock = function () {
    this.mark();
};

PeriodicBonusToolbarItem.prototype.changeLocked = function () {
    if (cleverapps.periodicBonus.locked) {
        this.disable();
    } else {
        this.enable();
        this.mark();
    }
};

PeriodicBonusToolbarItem.prototype.onClick = function () {
    if (cleverapps.periodicBonus.locked) {
        cleverapps.notification.create(cleverapps.periodicBonus.closedText, {
            image: this.icon
        });
        return;
    }

    this.unmark();

    cleverapps.meta.display({
        focus: "MiniGameWindowFromToolbar",
        action: function (f) {
            cleverapps.periodicBonus.openWindow(f);
        }
    });
};