/**
 * Created by ivan on 10.04.18.
 */

var ToolbarItem = function (type) {
    Object.assign(this, type);

    this.enabled = false;
    this.marked = false;

    this.onChangeStateListener = function () {};
    this.showForce = function () {};

    this.onFingerOnListener = function () {};
    this.onFingerOffListener = function () {};
};

ToolbarItem.prototype.getText = function () {
};

ToolbarItem.prototype.setFinger = function (finger, duration) {
    finger = !!finger;
    if (this.finger !== finger) {
        this.finger = finger;

        if (finger) {
            clearTimeout(this.fingerTimeout);
            this.onFingerOnListener();

            if (duration) {
                this.fingerTimeout = setTimeout(function () {
                    this.setFinger(false);
                }.bind(this), duration);
            }
        } else {
            this.onFingerOffListener();
        }
    }
};

ToolbarItem.prototype.isVisible = function () {
    return this.enabled;
};

ToolbarItem.prototype.onClick = function () {
    this.unmark();
};

ToolbarItem.prototype.isAvailableOnScene = function () {
    return true;
};

ToolbarItem.prototype.enable = function () {
    if (this.enabled) {
        return;
    }

    this.enabled = true;
    this.onChangeStateListener();

    if (cleverapps.toolbar) {
        cleverapps.toolbar.updateItems();
    }
};

ToolbarItem.prototype.disable = function () {
    if (!this.enabled) {
        return;
    }

    this.unmark();
    this.enabled = false;
    this.onChangeStateListener();

    if (cleverapps.toolbar) {
        cleverapps.toolbar.updateItems();
    }
};

ToolbarItem.prototype.mark = function () {
    if (!this.marked) {
        this.marked = true;
        this.onChangeStateListener();
    }
};

ToolbarItem.prototype.unmark = function () {
    if (this.marked) {
        this.marked = false;
        this.onChangeStateListener();
    }
};

ToolbarItem.prototype.getForce = function () {
    return this.force;
};

ToolbarItem.prototype.getTargetTypes = function () {
    return this.targets;
};

ToolbarItem.FRIEND_REQUESTS = {
    type: 0,
    icon: bundles.toolbar.frames.toolbar_mail_icon_png
};

ToolbarItem.BONUS_GAME = {
    type: 1,
    icon: bundles.toolbar.frames.toolbar_bonusround_icon_png,
    grayscaleDisabled: true,
    force: Forces.BONUS_ROUND_FORCE
};

ToolbarItem.PERIODIC_BONUS = {
    type: 2,
    icon: bundles.toolbar.frames.toolbar_dailybonus_icon_png,
    grayscaleDisabled: true,
    force: Forces.PERIODIC_BONUS_FORCE
};

ToolbarItem.LEADER_BOARD = {
    type: 3,
    icon: bundles.toolbar.frames.toolbar_leader_board_icon_png
};

ToolbarItem.DAILY_TASKS = {
    type: 4,
    icon: bundles.toolbar.frames.toolbar_daily_tasks_icon_png,
    force: Forces.DAILY_TASKS_FORCE
};

ToolbarItem.REWARDED_VIDEO = {
    type: 5,
    icon: bundles.toolbar.frames.toolbar_rewarded_video_icon_png
};

ToolbarItem.ORDERS = {
    type: 6,
    targets: "fruit",
    icon: bundles.toolbar.frames.toolbar_orders_icon_png
};

ToolbarItem.UNITS_LIBRARY = {
    type: 7,
    targets: "unitsLibrary",
    icon: bundles.toolbar.frames.toolbar_units_library_icon_png
};

ToolbarItem.UNIT_SHOP = {
    type: 8,
    icon: bundles.toolbar.frames.toolbar_unit_shop_icon_png,
    force: Forces.UNITS_SHOP_ICON
};

ToolbarItem.TRAVEL_BOOK = {
    type: 9,
    icon: bundles.toolbar.frames.toolbar_travel_book_icon_png,
    force: Forces.TRAVEL_BOOK
};

ToolbarItem.CLANS = {
    type: 10,
    icon: bundles.toolbar.frames.toolbar_clans_icon_png,
    force: Forces.CLANS_ICON
};

ToolbarItem.ARMY_LIBRARY = {
    type: 11,
    targets: "armyLibrary",
    icon: bundles.toolbar.frames.toolbar_units_library_icon_png
};

ToolbarItem.CUSTOMERS = {
    type: 12,
    icon: bundles.toolbar.frames.toolbar_customers_icon_png
};