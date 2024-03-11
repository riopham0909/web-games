/**
 * Created by r4zi4l on 05.08.2021
 */

var FreeRubiesIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.free_rubies_json
    });
};

FreeRubiesIcon.prototype = Object.create(SideBarIcon.prototype);
FreeRubiesIcon.prototype.constructor = FreeRubiesIcon;

FreeRubiesIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "RubiesShopFromIcon",
        control: ["MenuBarGoldItem"],
        action: function (f) {
            new HardCurrencyShopWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};

FreeRubiesIcon.prototype.resetState = function () {
    this.available = cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition();
    this.setAttention(this.available && cleverapps.rewardedAdsManager.isAvailable(RewardedAdsManager.REWARDED));
};
