/**
 * Created by ivan on 10.04.18.
 */

var ToolbarView = cc.Node.extend({
    ctor: function () {
        this._super();

        this.toolbar = cleverapps.toolbar;
        this.toolbar.resetItemsState();
        this.toolbar.updateItems();

        var styles = cleverapps.styles.ToolbarView;

        this.setAnchorPoint2();
        this.setContentSize(0, styles.bg.height);

        this.createBg();

        this.itemsViews = [];
        this.toolbar.getSceneItems().forEach(function (item) {
            var view = new ToolbarItemView(item);
            this.itemsViews.push(view);
            this.addChild(view);
        }.bind(this));

        this.toolbar.onAddItemListener = this.createListener(this.addItem.bind(this));
        this.toolbar.onUpdateItemsListener = this.createListener(this.updateItems.bind(this));
        this.toolbar.onEnableListener = this.createListener(this.updateEnabled.bind(this));
        this.toolbar.onForceItem = this.createListener(this.onForceItem.bind(this));

        this.updateItems(true);
        this.updateSize();
        this.updatePosition();

        this.toggle = this.createListener(function (visible, silent) {
            if (!visible && !this.isShown()) {
                return;
            }

            this.stopAllActions();
            if (!visible) {
                this.hide(silent);
            } else if (this.toolbar.enabled) {
                this.show(silent);
            }
        }.bind(this));
    },

    updatePosition: function () {
        this.setPositionRound(cleverapps.styles.ToolbarView.position);
    },

    updateSize: function () {
        var baseScale = cleverapps.resolution.mode === cleverapps.WideMode.HORIZONTAL ? 1.2 : 1;
        this.setScale(this.bg.width > cleverapps.UI.getSceneSize().width ? cleverapps.UI.getSceneSize().width / this.bg.width : baseScale);
        this._updateBg();
    },

    createBg: function () {
        this.bg = new cc.Scale9Sprite(bundles.toolbar.frames.toolbar_bg_png);
        var offsetY = cleverapps.styles.ToolbarView.bg.offsetY;
        this.addChild(this.bg);
        this.bg.height = this.height;
        this.bg.setPositionRound(this.width / 2, this.height / 2 + offsetY);
    },

    onForceItem: function () {
        this.show(true);
    },

    addItem: function (item, index) {
        var ViewClass = item.getViewClass();
        var itemView = new ViewClass(item);
        this.addChild(itemView);
        this.itemsViews.splice(index, 0, itemView);
        this.updateItems();
    },

    updateItems: function (silent) {
        var styles = cleverapps.styles.ToolbarView;

        var visibleItemsViews = [];
        var changedItems = [];
        var toInvisible = [];

        var oldVisibleAmount = 0;

        this.itemsViews.forEach(function (itemView) {
            var oldVisible = itemView.visible;
            if (oldVisible) {
                oldVisibleAmount++;
            }
            var visible = itemView.model.isVisible();
            if (visible !== oldVisible) {
                changedItems.push(itemView);
                if (visible) {
                    itemView.setVisible(true);
                } else if (silent) {
                    itemView.setVisible(false);
                } else {
                    toInvisible.push(itemView);
                    itemView.stopAllActions();
                    itemView.runAction(new cc.Sequence(
                        new cc.ScaleTo(0.3, 0),
                        new cc.CallFunc(function () {
                            itemView.setVisible(false);
                            itemView.setScale(1);
                        })
                    ));
                }
            }
            if (visible) {
                visibleItemsViews.push(itemView);
            }
        });

        var totalWidth = (visibleItemsViews.length - 1) * styles.margin;
        visibleItemsViews.forEach(function (view) {
            view.baseScaleX = 1;
            totalWidth += view.width;
        });

        if (visibleItemsViews.length > 0) { // need this check to prevent of calculating negative width value
            cleverapps.UI.arrangeWithMargins(visibleItemsViews, {
                direction: cleverapps.UI.HORIZONTAL,
                margin: styles.margin,
                y: this.height / 2 + styles.items.dy,
                iterator: function (view, x, y) {
                    x += styles.margin + styles.bg.padding;

                    if (silent) {
                        view.scale = 1;
                        view.setPositionRound(x, y);
                    } else {
                        if (changedItems.indexOf(view) !== -1) {
                            view.scale = 0;
                            view.setPositionRound(x, y);
                        }

                        view.stopAllActions();
                        view.runAction(
                            new cc.Spawn(
                                // eslint-disable-next-line new-cap
                                new cc.ScaleTo(0.6, 1).easing(cc.easeBackOut(0.05)),
                                new cc.MoveTo(0.6, cc.p(x, y))
                            )
                        );
                    }
                }
            });
        }

        totalWidth += 2 * styles.margin + 2 * styles.bg.padding;
        this.setContentSize(totalWidth, this.height);

        this.updateBg(oldVisibleAmount, visibleItemsViews.length, silent);
    },

    updateBg: function (oldVisibleAmount, visibleAmount, silent) {
        this.bg.stopAllActions();
        if (silent || visibleAmount > oldVisibleAmount) {
            this._updateBg();
        } else {
            this.bg.runAction(new cc.Sequence(
                new cc.DelayTime(0.6),
                new cc.CallFunc(this._updateBg.bind(this))
            ));
        }
    },

    _updateBg: function () {
        this.bg.setContentSize2(this.width, this.height + cleverapps.UI.getBgOffset());
        this.bg.setPositionRound(this.width / 2, this.height + cleverapps.styles.ToolbarView.bg.offsetY - this.bg.height / 2);

        if (this.decors) {
            this.decors.forEach(function (decor) {
                decor.removeFromParent();
            });
            delete this.decors;
        }
        this.decors = SceneDecors.add(this.bg, cleverapps.skins.getSlot("toolbarDecors"));
    },

    updateEnabled: function (enabled) {
        this.stopAllActions();
        if (enabled && cleverapps.windows.list.length === 0) {
            this.hide(true);
            this.show();
        } else {
            this.hide();
        }
    }
});

cleverapps.styles.ToolbarView = {
    position: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: 0 }
    },

    bg: {
        height: 205,
        padding: 0,
        offsetY: -90
    },
    hover: {
        margin: 6
    },
    items: {
        dy: -45
    },
    margin: 30
};
