/**
 * Created by vladislav on 6/5/19
 */

var ShopWindow = Window.extend({
    ctor: function (options) {
        this.options = options || {};
        this.tab = this.options.tab;

        if (this.tab === ShopWindow.TABS.HARD_CURRENCY && cleverapps.flags.videoAdsMainMonetization && !cleverapps.rewardedAdsManager.isEnabled()) {
            return false;
        }

        if (options.force && options.force.productOptions) {
            var productKey = options.force.productKey;
            this.originalProduct = cleverapps.clone(VirtualProducts[productKey]);
            VirtualProducts[productKey] = Object.assign(VirtualProducts[productKey], options.force.productOptions);
        }

        this.onFinishShowUp = function () {};
        this._super.apply(this, arguments);
    },

    customize: function () {
        this._super();
        if (this.needGoldInfo()) {
            this.goldInfo = new ShopUserGoldView();
        }

        Lottery.addText(this);
    },

    needGoldInfo: function () {
        return ShopUserGoldView.IsAvailable() && !this.isVertical() && this.tab !== ShopWindow.TABS.LIVES;
    },

    updateGoldInfo: function () {
        if (this.needGoldInfo()) {
            this.goldInfo = this.goldInfo || new ShopUserGoldView();
            this.goldInfo.showUp();
        } else {
            this.goldInfo && this.goldInfo.hide(undefined, true);
        }
    },

    onWindowLoaded: function () {
        var styles = cleverapps.styles.ShopWindow;
        this._super({
            name: "shopwindow_tab" + this.tab,
            content: this.createContent(this.tab),
            title: this.getTitle(),
            noBackground: true,
            notCloseByTouchInShadow: true,
            closeButtonDelay: true,
            styles: styles
        });

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.SHOP_OPEN + this.tab, {
            store_type: this.getTitle()
        });

        this.adjustShopWindow();

        this.tiles.forEach(function (tile) {
            if (tile.onReady) {
                tile.onReady();
            }
        });

        this.scroll.scrollTo(cleverapps.UI.ScrollView.SCROLLS.LOWER_RIGHT);

        var tile = this.selectTileForScroll();

        var target = tile || cleverapps.UI.ScrollView.SCROLLS.UPPER_LEFT;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.8),
            new cc.CallFunc(function () {
                this.scroll.scrollTo(target, 0.8, {
                    easing: cc.easeBackInOut(),
                    callback: this.onFinishShowUp
                });

                if (this.options.finger && tile) {
                    this.runAction(new cc.Sequence(
                        new cc.DelayTime(0.5),
                        new cc.CallFunc(function () {
                            tile.addFinger();
                        })
                    ));
                }
            }, this),
            new cc.CallFunc(function () {
                if (this.options.force) {
                    this.showTileForce();
                }
            }, this)
        ));
    },

    showTileForce: function () {
        var tile = this.tiles.find(function (tile) {
            return tile.tileModel.product.key === this.options.force.productKey;
        }, this);

        if (tile) {
            cleverapps.forces.create(tile.button, { pointer: true }, { actives: [tile] });
        }
    },

    getTitle: function () {
        var text = "ShopWindow.title";

        if (cleverapps.config.type === "merge") {
            switch (this.tab) {
                case ShopWindow.TABS.HARD_CURRENCY: text = "ShopWindow.title.ruby"; break;
                case ShopWindow.TABS.LIVES: text = "ShopWindow.title.energy"; break;
                case ShopWindow.TABS.SOFT_CURRENCY: text = "ShopWindow.title.coins"; break;
                case ShopWindow.TABS.UNITS_FRUIT: text = "ShopWindow.title.fruit"; break;
                case ShopWindow.TABS.UNITS_RESOURCE: text = "ShopWindow.title.resource"; break;
                case ShopWindow.TABS.UNITS_DISCOUNT: text = "ShopWindow.title.discount"; break;
                case ShopWindow.TABS.UNITS_EXPEDITION_HALLOWEEN: text = "ShopWindow.title.expedition.halloween"; break;
                case ShopWindow.TABS.UNITS_EXPEDITION_XMAS: text = "ShopWindow.title.expedition.xmas"; break;
                case ShopWindow.TABS.UNITS_EXPEDITION_DRAGONIA: text = "ShopWindow.title.expedition.dragonia"; break;
                case ShopWindow.TABS.UNITS_EXPEDITION_DRAGONIA2: text = "ShopWindow.title.expedition.dragonia"; break;
                case ShopWindow.TABS.UNITS_EXPEDITION_DRAGONIA3: text = "ShopWindow.title.expedition.dragonia"; break;
                case ShopWindow.TABS.UNITS_EXPEDITION_UNDERSEA: text = "ShopWindow.title.expedition.undersea"; break;
                case ShopWindow.TABS.UNITS_ADS: text = "ShopWindow.title.ads"; break;
                case ShopWindow.TABS.UNITS_ADS_VIP: text = "ShopWindow.title.ads_vip"; break;
                case ShopWindow.TABS.UNITS_ADS_UNDECIDED: text = "ShopWindow.title.ads"; break;
                case ShopWindow.TABS.UNITS_EXPEDITION_RAPUNZEL: text = "ShopWindow.title.expedition.rapunzel"; break;
                case ShopWindow.TABS.UNITS_EXPEDITION_EASTER: text = "ShopWindow.title.expedition.easter"; break;
                case ShopWindow.TABS.UNITS_EXPEDITION_COLLECTIONS: text = "ShopWindow.title.expedition.collections"; break;
                case ShopWindow.TABS.UNITS_EXPEDITION_CHINA: text = "ShopWindow.title.expedition.china"; break;
            }
        }

        return text;
    },

    onHide: function () {
        this._super();

        if (this.goldInfo) {
            this.goldInfo.hide(undefined, true);
        }
        this.hidden = true;
    },

    buyProduct: function (tileModel, buyParams) {
        if (this.closingNow || this.hidden) {
            return;
        }

        if (cleverapps.forces.isRunningForce()) {
            cleverapps.forces.closeRunningForce();
        }

        tileModel.buy(this.close.bind(this, true), buyParams);

        if (this.options.onBought) {
            this.options.onBought();
        }

        if (this.originalProduct) {
            VirtualProducts[this.options.force.productKey] = this.originalProduct;
        }
    },

    isVertical: function () {
        return cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL;
    },

    adjustShopWindow: function (options) {
        this.shopLayout.scale = 1;
        this.windowTitle && this.windowTitle.setVisible(!(this.isVertical()));

        var available = cleverapps.UI.calcBoundaries(this.getOverlappingNodes());
        available = cc.rectSubPadding(available, this.getBackgroundPadding());

        if (this.isVertical()) {
            this.shopLayout.setScale(Math.min(this.shopLayout.scale, available.width / this.shopLayout.width));
        }

        var scale = 1;

        if (!this.isVertical()) {
            this.shopLayout.setScale(Math.min(this.shopLayout.scale, available.height / this.shopLayout.height));

            if (cleverapps.resolution.mode === cleverapps.WideMode.HORIZONTAL && cc.sys.isMobile) {
                scale = cleverapps.styles.ShopWindow.horizontalMobile.scale;
                this.shopLayout.setScale(this.shopLayout.getScale() * scale);
            }
        }

        var winSize = cleverapps.UI.getSceneSize();
        var scene = cleverapps.scenes.getRunningScene();
        var screenArea = scene.getGlobalBoundingBox();
        var contentBox = this.shopLayout.getBoundingBox();

        contentBox.height /= scale;

        var wrapHeight, wrapY, y;

        if (this.isVertical()) {
            wrapHeight = contentBox.height + winSize.height - available.height;
            wrapY = available.y + available.height / 2;
            y = contentBox.height / 2 + available.y;
        } else {
            wrapHeight = screenArea.height;
            wrapY = this.convertToWorldSpace(0, 0).y;
            y = cc.nearestToRect(
                cc.rectSubPadding(available, cc.padding({ x: contentBox.width / 2, y: contentBox.height / 2 })),
                cc.rectGetCenter(screenArea)
            ).y;
        }

        this.contentWrap.setContentSize2(contentBox.width + winSize.width - available.width, wrapHeight);

        if (!options || !options.changeSize) {
            this.contentWrap.setPositionRound(this.convertToNodeSpace(cc.p(available.x + available.width / 2, wrapY)));
        }

        this.shopLayout.setPositionRound(this.convertToNodeSpace(cc.p(available.x + contentBox.width / 2, y)));

        this.scroll.setContentSize2(winSize);
        this.scroll.setPositionRound({ align: "center" }, { align: "center" });
        this.scroll.updateInnerContent();
    },

    updateSize: function () {
        this._super();

        if (this.scroll.dir === cleverapps.UI.ScrollView.DIR_HORIZONTAL && this.isVertical()
            || this.scroll.dir === cleverapps.UI.ScrollView.DIR_VERTICAL && !this.isVertical()) {
            this.scroll.removeFromParent(true);
            this.createContent(this.tab);
            this.updateGoldInfo();
        }

        this.windowTitle.setVisible(!this.isVertical());
        this.adjustShopWindow({ changeSize: true });
    },

    createTilesLayout: function () {
        var styles = cleverapps.styles.ShopWindow;

        var rowLength = this.isVertical() ? 2 : this.tiles.length;

        var padding = styles.padding;
        if (cleverapps.resolution.mode === cleverapps.WideMode.HORIZONTAL && cc.sys.isMobile) {
            padding = styles.horizontalMobile.padding;
        }

        this.shopLayout = new cleverapps.WrapGridLayout(this.tiles, {
            columns: rowLength,
            margin: styles.margin,
            padding: padding,
            ascZOrder: true
        });
    },

    createTiles: function (tab) {
        var tileModels = ShopProductSource.listTileModels(tab);

        this.tiles = tileModels.map(function (tileModel) {
            var ViewClassName = tileModel.getViewClassName();
            if (tileModel instanceof SubscriptionTileModel) {
                tileModel.onClaim = this.close.bind(this);
            }
            return new ViewClassName(tileModel, {
                onClicked: this.buyProduct.bind(this),
                cart: this.cart
            });
        }, this);
    },

    createContent: function (tab) {
        this.createTiles(tab);
        this.createTilesLayout();

        this.contentWrap = new cc.Node();
        this.contentWrap.setAnchorPoint2();
        this.contentWrap.addChild(this.shopLayout);
        this.contentWrap.visibilityCheckList = this.tiles;

        this.scroll = new cleverapps.UI.ScrollView(this.contentWrap, {
            childrenVisibility: cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_FULLCHECK,
            childrenVisibilityPadding: cleverapps.styles.ShopWindow.tilesVisibilityPadding,
            direction: this.isVertical() ? cleverapps.UI.ScrollView.DIR_VERTICAL : cleverapps.UI.ScrollView.DIR_HORIZONTAL,
            clipping: false,
            scrollBarEnabled: false
        });
        this.scroll.setLocalZOrder(1);
        this.addChild(this.scroll);

        this.adjustShopWindow();

        return new cc.Node();
    },

    selectTileForScroll: function () {
        var selectedTile;
        if (this.options.priorityType) {
            selectedTile = this.tiles.find(function (tile) {
                return tile instanceof this.options.priorityType;
            }.bind(this));
        }

        selectedTile = selectedTile || this.tiles.find(function (tile) {
            return tile.tileModel.isAttention();
        });

        selectedTile = selectedTile || this.tiles.find(function (tile) {
            return tile.tileModel.wantsScroll();
        });

        return selectedTile;
    },

    onShow: function (startDelay) {
        this.updateGoldInfo();

        this.hidden = undefined;
        this.tilesLayoutShowAnimation(startDelay);

        if (this.options.force) {
            cleverapps.meta.setEventNodes([]);
        }

        this._super();
    },

    onClose: function () {
        if (this.tab === ShopWindow.TABS.LIVES && cleverapps.config.type === "merge"
            && !cleverapps.lives.canTake(cleverapps.lives.getMaxLives() * 0.2) && Game.currentGame.specialEnergyOffer.isReady()
            && !(cleverapps.windows.currentWindow() instanceof RewardWindow)) {
            Game.currentGame.specialEnergyOffer.wantsToShow();
        }
    },

    close: function (silent) {
        if (!this.closingNow) {
            if (cleverapps.forces.isRunningForce()) {
                cleverapps.forces.closeRunningForce();
            }
            if (this.goldInfo) {
                this.goldInfo.remove(undefined, silent);
            }
            this.closingNow = true;
            var _close = this._super;

            if (this.isCurrent()) {
                cleverapps.meta.setEventNodes([]);
            }

            var buyed = cleverapps.windows.currentWindow() instanceof RewardWindow
                || typeof UnitsShopTab !== "undefined" && UnitsShopTab.cartUnits && UnitsShopTab.cartUnits.length > 0;

            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.SHOP_CLOSE, {
                store_type: this.getTitle(),
                stay_time: (Date.now() - this.openTime) <= 30000 ? "sec0_30" : "sec30_more",
                stay_whether_to_buy: buyed ? 1 : 0
            });

            if (silent === true) {
                if (!this.closed) {
                    _close.call(this);
                }
            } else {
                var styles = cleverapps.styles.ShopWindow;
                if (this.closeButton instanceof BandButton) {
                    this.closeButton.hide();
                }
                if (this.scrollBarBG) {
                    this.scrollBarBG.runAction(new cc.FadeOut(0.3));
                }

                if (this.windowTitle) {
                    var hidePos = cc.p(this.windowTitle.x, cleverapps.UI.getSceneSize().height + this.windowTitle.height / 2);
                    var downPos = cc.p(this.windowTitle.x, this.windowTitle.y - styles.title.hideAnimation.moveDownY);
                    this.windowTitle.runAction(
                        new cc.Sequence(
                            new cc.MoveTo(0.15, downPos),
                            new cc.MoveTo(0.3, hidePos).easing(cc.easeIn(1))
                        )
                    );
                }

                this.tilesLayoutCloseAnimation(_close.bind(this));
            }
        }
    },

    tilesLayoutShowAnimation: function (startDelay) {
        var step = 0.075;
        startDelay = startDelay || 0;
        var maxDelay = startDelay + step * Math.ceil((this.tiles.length - 1) * 0.5) + 0.5;
        for (var index = this.tiles.length - 1; index >= 0; index--) {
            var delay = startDelay + step * Math.ceil(index * 0.5);
            var badge = this.tiles[index].tileBadge;
            if (badge) {
                badge.setVisible(false);
                badge.runAction(new cc.Sequence(
                    new cc.ScaleTo(0, 0),
                    new cc.DelayTime(maxDelay),
                    new cc.PlaySound(bundles.tile_shop.urls.badge_appear_effect),
                    new cc.Show(),
                    new cc.ScaleTo(0.4, badge.scale).easing(cc.easeBackOut())
                ));
            }
            var adsBubble = this.tiles[index].adsBubble;
            if (adsBubble) {
                adsBubble.setActive(false);
                adsBubble.runAction(new cc.Sequence(
                    new cc.DelayTime(maxDelay),
                    new cc.CallFunc(adsBubble.setActive.bind(adsBubble, true))
                ));
            }
            this.tiles[index].setVisible(false);
            this.tiles[index].runAction(new cc.Sequence(
                new cc.ScaleTo(0, 0),
                new cc.CallFunc(function () {
                    if (!this.beyondScroll) {
                        this.setVisible(true);
                    }
                }.bind(this.tiles[index])),
                new cc.DelayTime(delay),
                new cc.ScaleTo(0.4, this.tiles[index].scale).easing(cc.easeBackOut())
            ));
        }
    },

    tilesLayoutCloseAnimation: function (closeCallback) {
        var step = 0.075;
        var close = cleverapps.wait(this.tiles.length, closeCallback);
        for (var index = this.tiles.length - 1; index >= 0; index--) {
            this.tiles[index].runAction(new cc.Sequence(
                new cc.DelayTime(step * Math.ceil(index * 0.5)),
                new cc.ScaleTo(0.3, 0).easing(cc.easeBackIn()),
                new cc.CallFunc(close.bind(this, index))
            ));
        }
    },

    beforeCloseAnimation: function (callback) {
        if (this.goldInfo && this.goldInfo.isRunning()) {
            this.goldInfo.addCleaner(callback);
        } else {
            callback();
        }
    }
});

var LivesShopWindow = ShopWindow.extend({
    ctor: function (options) {
        options = options || {};

        this._super({
            tab: ShopWindow.TABS.LIVES,
            onBought: options.onBought,
            force: options.force
        });
    }
});

var SoftCurrencyShopWindow = ShopWindow.extend({
    ctor: function (options) {
        options = options || {};

        this._super({
            tab: ShopWindow.TABS.SOFT_CURRENCY,
            force: options.force
        });
    }
});

var HardCurrencyShopWindow = ShopWindow.extend({
    ctor: function () {
        this._super({
            tab: ShopWindow.TABS.HARD_CURRENCY
        });
    }
});

ShopWindow.prototype.listBundles = function () {
    return ["tile_shop"];
};

ShopWindow.TABS = {
    HARD_CURRENCY: 0,
    LIVES: 1,
    SOFT_CURRENCY: 2,
    UNITS_FRUIT: 3,
    UNITS_RESOURCE: 4,
    UNITS_DISCOUNT: 5,
    UNITS_EXPEDITION_HALLOWEEN: 6,
    UNITS_EXPEDITION_XMAS: 8,
    UNITS_EXPEDITION_DRAGONIA: 10,
    UNITS_EXPEDITION_UNDERSEA: 12,
    UNITS_ADS: 14,
    UNITS_ADS_VIP: 15,
    UNITS_ADS_UNDECIDED: 19,
    FOGS_VALUABLES: 20,
    UNITS_EXPEDITION_DRAGONIA2: 21,
    UNITS_EXPEDITION_RAPUNZEL: 22,
    UNITS_EXPEDITION_EASTER: 23,
    UNITS_EXPEDITION_COLLECTIONS: 24,
    UNITS_EXPEDITION_DRAGONIA3: 25,
    UNITS_EXPEDITION_CHINA: 26
};

cleverapps.styles.ShopWindow = {
    scrollBarBG: {
        height: 24,
        paddingX: 20,
        y: 20
    },

    title: {
        hideAnimation: {
            moveDownY: 30
        }
    },
    margin: { x: 30, y: 30 },
    padding: { x: 10, y: 10 },
    tilesVisibilityPadding: 30,

    horizontalMobile: {
        scale: 1.25,
        padding: { x: 0, top: 140, bottom: 90 }
    },

    mouseScrollSpeed: 400
};

cleverapps.overrideStyles(cleverapps.styles.DECORATORS, {
    TILE_SHOP_BADGE_STROKE: {
        color: new cc.Color(100, 34, 22, 255),
        size: 2
    },

    TILE_SHOP_SHADOW: {
        color: new cc.Color(100, 34, 22, 200),
        direction: cc.size(0, -3),
        blur: 1
    },

    TILE_SHOP_STROKE: {
        color: new cc.Color(100, 34, 22, 255),
        size: 3
    }
});
