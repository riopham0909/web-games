/**
 * Created by olga on 11.01.2023
 */

var SpecialEnergyOfferIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.special_energy_offer_json,
        priority: SideBar.PRIORITY_REDUNDANT
    });
    this.available = true;
    this.resetState();
};

SpecialEnergyOfferIcon.prototype = Object.create(SideBarIcon.prototype);
SpecialEnergyOfferIcon.prototype.constructor = SpecialEnergyOfferIcon;

SpecialEnergyOfferIcon.prototype.resetState = function () {
    if (!Game.currentGame) {
        return;
    }

    var leftTime = Game.currentGame.specialEnergyOffer.getIconLeftTime();
    if (leftTime <= 0) {
        cleverapps.sideBar.removeTemporaryIcon(this);
    } else {
        this.setLeftTime(leftTime);
    }
};

SpecialEnergyOfferIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "SpecialEnergyOfferWindow",
        action: function (f) {
            new SpecialEnergyOfferWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};
