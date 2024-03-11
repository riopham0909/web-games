/**
 * Created by ivan on 11.04.18.
 */

var OrdersToolbarItem = function () {
    ToolbarItem.call(this, ToolbarItem.ORDERS);

    this.enable();
};

OrdersToolbarItem.prototype = Object.create(ToolbarItem.prototype);
OrdersToolbarItem.prototype.constructor = OrdersToolbarItem;

OrdersToolbarItem.prototype.resetState = function () {
    // Harvested can be created at chat scene to accept gift and currentGame will be undefined
    var ready = Game.currentGame && (Game.currentGame.orders.findCanCook() || Game.currentGame.orders.findReady());

    if (ready) {
        this.mark();
    } else {
        this.unmark();
    }
};

OrdersToolbarItem.prototype.isVisible = function () {
    return Game.currentGame && cleverapps.gameLevel && cleverapps.gameLevel.getLevel() >= 2
        && ["main"].indexOf(cleverapps.travelBook.getCurrentPage().id) !== -1 && !cleverapps.config.editorMode;
};

OrdersToolbarItem.prototype.onClick = function () {
    cleverapps.meta.display({
        focus: "OrdersIconClicked",
        action: function (f) {
            new OrdersWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};