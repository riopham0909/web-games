/**
 * Created by ivan on 11.04.18.
 */

var UnitsLibraryToolbarItem = function () {
    ToolbarItem.call(this, ToolbarItem.UNITS_LIBRARY);

    this.enable();
};

UnitsLibraryToolbarItem.prototype = Object.create(ToolbarItem.prototype);
UnitsLibraryToolbarItem.prototype.constructor = UnitsLibraryToolbarItem;

UnitsLibraryToolbarItem.prototype.resetState = function () {
    if (cleverapps.unitsLibrary.hasAnyFresh(cleverapps.unitsLibrary.listTabCodes(cleverapps.travelBook.getCurrentPage().id))) {
        this.mark();
    } else {
        this.unmark();
    }
};

UnitsLibraryToolbarItem.prototype.isVisible = function () {
    return !cleverapps.config.editorMode && Game.currentGame && (!Game.currentGame.isMainGame() || cleverapps.gameLevel.getLevel() >= 3);
};

UnitsLibraryToolbarItem.prototype.onClick = function () {
    cleverapps.meta.display({
        control: ["MenuBarCoinsItem"],
        focus: "UnitsLibraryIconClicked",
        action: function (f) {
            new UnitsLibraryWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};