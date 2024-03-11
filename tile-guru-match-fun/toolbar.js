/**
 * Created by ivan on 10.04.18.
 */

var Toolbar = function () {
    this.items = [];
    this.freezed = false;
    this.enabled = false;

    this.onUpdateItemsListener = function () {};
    this.onAddItemListener = function () {};
    this.onEnableListener = function () {};
    this.onForceItem = function () {};

    if (cleverapps.config.type === "merge") {
        this.addItem(new OrdersToolbarItem());
        this.addItem(new UnitsLibraryToolbarItem());
        this.addItem(new UnitShopToolbarItem());
        this.addItem(new TravelBookToolbarItem());
        this.addItem(new ClansToolbarItem());
        this.addItem(new CustomersToolbarItem());
    } else if (cleverapps.config.type === "battlefield") {
        this.addItem(new ArmyLibraryToolbarItem());
    } else if (["merge", "match3", "differences", "solitaire", "board", "tile3"].includes(cleverapps.config.type)) {
        this.addItem(new FriendRequestsToolbarItem());
        this.addItem(new PeriodicBonusToolbarItem());

        if (cleverapps.dailyTasks) {
            this.addItem(new DailyTasksToolbarItem());
        }

        this.addItem(new LeaderBoardToolbarItem());
        this.addItem(new RewardedVideoToolbarItem());
    } else if (["blocks"].includes(cleverapps.config.type)) {
        this.addItem(new RewardedVideoToolbarItem());
        this.addItem(new LeaderBoardToolbarItem());
    }

    if (typeof BonusRoundToolbarItem !== "undefined") {
        this.addItem(new BonusRoundToolbarItem());
    }
};

Toolbar.prototype.getSceneItems = function () {
    return this.items.filter(function (item) {
        return item.isAvailableOnScene();
    });
};

Toolbar.prototype.anyItemWithForce = function () {
    for (var i = 0; i < this.items.length; i++) {
        var force = this.items[i].getForce();
        if (force && this.items[i].isVisible() && !cleverapps.forces.isShown(force.id)) {
            return this.items[i];
        }
    }

    return undefined;
};

Toolbar.prototype.showAnyForce = function () {
    var item = this.anyItemWithForce();

    cleverapps.meta.display({
        focus: "toolbarItemForce",
        control: "toolbar",
        actions: [
            function (f) {
                this.updateItems();
                cleverapps.timeouts.setTimeout(f, 500);
            }.bind(this),

            function (f) {
                this.onForceItem();
                item.showForce();
                cleverapps.forces.onceForceClosed = f;
            }.bind(this)
        ]
    });
};

Toolbar.prototype.addItem = function (item) {
    if (this.getItem(item.type) !== undefined) {
        return;
    }
    this.items.push({});
    var index = this.items.length - 1;
    while (index > 0 && this.items[index - 1].type > item.type) {
        this.items[index] = this.items[index - 1];
        index--;
    }

    this.items[index] = item;

    this.onAddItemListener(item, index);
};

Toolbar.prototype.hasVisibleItems = function () {
    return this.items.filter(function (item) {
        return item.isVisible();
    }).length > 0;
};

Toolbar.prototype.resetByType = function (itemType) {
    var item = this.getItem(itemType.type);
    if (item) {
        item.resetState();
        this.updateItems();
    }
};

Toolbar.prototype.resetItemsState = function () {
    this.items.forEach(function (item) {
        item.resetState && item.resetState();
    });
};

Toolbar.prototype.getItem = function (type) {
    for (var i = 0; i < this.items.length; ++i) {
        if (this.items[i].type === type) {
            return this.items[i];
        }
    }
    return undefined;
};

Toolbar.prototype.updateItems = function (silent) {
    if (this.freezed) {
        return;
    }

    this.onUpdateItemsListener(silent);
    this._update(); // to process enable, disable visibility when no items in toolbar
};

Toolbar.prototype.freezeUpdates = function () {
    this.freezed = true;
};

Toolbar.prototype.unfreezeUpdates = function () {
    this.freezed = false;
    this.updateItems();
};

Toolbar.prototype._update = function () {
    if (this.hasVisibleItems()) {
        this.enable();
    } else {
        this.disable();
    }
};

Toolbar.prototype.enable = function () {
    if (!this.enabled) {
        this.enabled = true;
        this.onEnableListener(this.enabled);
    }
};

Toolbar.prototype.disable = function () {
    if (this.enabled) {
        this.enabled = false;
        this.onEnableListener(this.enabled);
    }
};
