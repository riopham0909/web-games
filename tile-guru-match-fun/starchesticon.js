/**
 * Created by iamso on 26.04.21.
 */

var StarChestIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.star_chest_icon_json
    });
};

StarChestIcon.prototype = Object.create(SideBarIcon.prototype);
StarChestIcon.prototype.constructor = StarChestIcon;

StarChestIcon.prototype.resetState = function () {
    this.available = cleverapps.starChest !== undefined;

    var text = cleverapps.starChest.stars + "/" + cleverapps.StarChest.GOAL_AMOUNT;
    this.setTitle(text);
    this.setAttention(cleverapps.starChest.stars >= cleverapps.StarChest.GOAL_AMOUNT);
};

StarChestIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "StarChestWindow",
        action: function (f) {
            new StarChestWindow();

            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};
