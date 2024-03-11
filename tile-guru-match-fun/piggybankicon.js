/**
 * Created by slava on 11/9/18
 */

var PiggyBankIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.piggybank_icon_json
    });

    cleverapps.flags.on("change:videoAdsMainMonetization", function () {
        cleverapps.sideBar.resetByClassName(PiggyBankIcon);
    });
};

PiggyBankIcon.prototype = Object.create(SideBarIcon.prototype);
PiggyBankIcon.prototype.constructor = PiggyBankIcon;

PiggyBankIcon.prototype.resetState = function () {
    this.available = cleverapps.piggyBank.isActive();

    this.setAttention(cleverapps.piggyBank.isFull());

    this.setLeftTime(cleverapps.piggyBank.getLeftTime());
};

PiggyBankIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "PiggyBankWindow",
        control: "MenuBarGoldItem",
        action: function (f) {
            new PiggyBankWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};
