/**
 * Created by iamso on 05.03.19.
 */

var SideBarView = cc.Node.extend({
    ctor: function (options) {
        this._super();

        this.options = options || {};

        this.updateSize();

        this.slots = SideBar.SLOTS.map(function (slot) {
            var slotView = new SideBarSlotView(slot, this);
            this.addChild(slotView);
            return slotView;
        }, this);

        cleverapps.sideBar.refreshAllIcons();

        cleverapps.sideBar.onAddIcon = this.createListener(this.insert.bind(this));
        cleverapps.sideBar.onMoveIcon = this.createListener(this.move.bind(this));
        cleverapps.sideBar.onRemoveIcon = this.createListener(this.eject.bind(this));
        cleverapps.sideBar.onForceIcon = this.createListener(this.onForce.bind(this));

        for (var i = 0; i < cleverapps.sideBar.icons.length; i++) {
            this.insert(i);
        }

        this.updateZOrder();
    }
});

SideBarView.prototype.updateSize = function () {
    var sceneSize = this.options.size || cc.size(cleverapps.UI.getSceneSize());
    this.setAnchorPoint2();
    this.setContentSize2(sceneSize.width, sceneSize.height);
    this.setPositionRound(sceneSize.width / 2, sceneSize.height / 2);
};

SideBarView.prototype.onForce = function (index) {
    this.slots[index].showForce();
};

SideBarView.prototype.insert = function (index) {
    if (this.slots[index]) {
        this.slots[index].insert(new SideBarIconView(cleverapps.sideBar.icons[index]));
    }
};

SideBarView.prototype.eject = function (index) {
    if (this.slots[index]) {
        this.slots[index].eject();
    }
};

SideBarView.prototype.move = function (dest, source) {
    if (!this.slots[dest]) {
        if (this.slots[source]) {
            this.slots[source].eject();
        }
        return;
    }

    var view;
    if (this.slots[source]) {
        view = this.slots[source].release();
    }

    if (!view) {
        var icon = cleverapps.sideBar.icons[dest];
        view = new SideBarIconView(icon);
    }

    this.slots[dest].insert(view);
};

SideBarView.prototype.updateZOrder = function () {
    this.setLocalZOrder(cleverapps.meta.isFocused() ? BaseWindow.WINDOWS_ZORDER + 1 : SideBarView.ZORDER);
};

SideBarView.ZORDER = 1;
