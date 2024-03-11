/**
 * Created by ivan on 11.04.18.
 */

var UnitShopToolbarItem = function () {
    ToolbarItem.call(this, ToolbarItem.UNIT_SHOP);

    this.enable();
};

UnitShopToolbarItem.prototype = Object.create(ToolbarItem.prototype);
UnitShopToolbarItem.prototype.constructor = UnitShopToolbarItem;

UnitShopToolbarItem.prototype.resetState = function () {
    this.tabWithFree = undefined;
    cleverapps.unitsShop.getAvailableShops().forEach(function (shop) {
        if (cleverapps.unitsShop.tabs[shop.tab].getFreeProduct()) {
            this.tabWithFree = shop.tab;
        }
    }.bind(this));

    if (this.tabWithFree !== undefined) {
        this.mark();
    } else {
        this.unmark();
    }
};

UnitShopToolbarItem.prototype.isVisible = function () {
    return cleverapps.unitsShop && cleverapps.unitsShop.getAvailableShops().length > 0;
};

UnitShopToolbarItem.prototype.onClick = function () {
    var shops = cleverapps.unitsShop.getAvailableShops();
    cleverapps.meta.display({
        focus: "displayUnitsShop",
        control: ["MenuBarGoldItem", "MenuBarCoinsItem"],
        action: function (f) {
            var targetTab = this.tabWithFree !== undefined ? this.tabWithFree : shops[shops.length - 1].tab;
            new UnitsShopWindow({ tab: targetTab });

            cleverapps.meta.onceNoWindowsListener = f;
        }.bind(this)
    });
};

UnitShopToolbarItem.prototype.getForce = function () {
    return cleverapps.unitsShop.getAvailableShops().length > 1 && Forces.UNITS_SHOP_ICON;
};