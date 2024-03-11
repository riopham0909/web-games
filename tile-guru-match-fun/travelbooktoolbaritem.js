/**
 * Created by ivan on 11.04.18.
 */

var TravelBookToolbarItem = function () {
    ToolbarItem.call(this, ToolbarItem.TRAVEL_BOOK);

    this.enable();
};

TravelBookToolbarItem.prototype = Object.create(ToolbarItem.prototype);
TravelBookToolbarItem.prototype.constructor = TravelBookToolbarItem;

TravelBookToolbarItem.prototype.resetState = function () {
    if (cleverapps.travelBook.needsAttention()) {
        this.mark();
    } else {
        this.unmark();
    }

    cleverapps.travelBook.chooseForce();
};

TravelBookToolbarItem.prototype.getForce = function () {
    return cleverapps.travelBook.chosenForForce && Forces.TRAVEL_BOOK;
};

TravelBookToolbarItem.prototype.isVisible = function () {
    return cleverapps.user.checkAvailable(TravelBook.AVAILABLE);
};

TravelBookToolbarItem.prototype.onClick = function () {
    cleverapps.meta.display({
        focus: "TravelBook",
        actions: [
            function (f) {
                new TravelBookWindow();
                cleverapps.meta.onceNoWindowsListener = f;
            },

            function (f) {
                delete cleverapps.travelBook.chosenForForce;
                f();
            }
        ]
    });
};