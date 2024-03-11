/**
 * Created by andrey on 19.02.18.
 */

var PackIcon = function () {
    SideBarIcon.call(this, {
        lottery: true
    });

    cleverapps.flags.on("change:videoAdsMainMonetization", function () {
        cleverapps.sideBar.resetByClassName(PackIcon);
    });
};

PackIcon.prototype = Object.create(SideBarIcon.prototype);
PackIcon.prototype.constructor = PackIcon;

PackIcon.prototype.resetState = function () {
    this.available = cleverapps.packManager.isAvailable();

    if (this.available) {
        var animations = [bundles.sidebar.jsons.pack_icon_json, bundles.sidebar.jsons.pack1_icon_json, bundles.sidebar.jsons.pack2_icon_json];

        this.setAnimation(animations[cleverapps.packManager.get().stage]);
    }
};

PackIcon.prototype.onPressed = function () {
    var controls = ["MenuBarGoldItem", "MenuBarLivesItem", "MenuBarCoinsItem", "MenuBarWandsItem", "MenuBarWorkersItem"];
    cleverapps.meta.display({
        focus: "PackWindow",
        control: controls,
        action: function (f) {
            new PackWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};
