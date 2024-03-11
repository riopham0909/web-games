/**
 * Created by r4zi4l on 26.08.2021
 */

var BaseProductTile = cc.Node.extend({
    ctor: function (tileModel, styles, options) {
        this._super();
        this.tileModel = tileModel;
        this.styles = styles;
        this.options = options || {};

        this.setAnchorPoint2();
        this.setContentSize2(styles.width, styles.height);

        this.addBackground();
        this.addDecorators();

        this.updateTileState();

        this.tileModel.onGetView = this.createListener(function () {
            return this;
        }.bind(this));
        this.tileModel.onUpdateTileModel = this.createListener(this.updateTileState.bind(this));
        this.tileModel.onBuyVideoProduct = this.createListener(this.buyVideoProduct.bind(this));
        this.tileModel.onUpdateAvailability = this.createListener(this.updateAvailability.bind(this));
    },

    onExit: function () {
        if (this.tileModel.onExit) {
            this.tileModel.onExit();
        }
    },

    buyVideoProduct: function () {
        this.button.runAction(new cc.Sequence(
            new cc.ScaleTo(0.2, 1.2),
            new cc.CallFunc(function () {
                this.button.setString(this.button.getText());
                this.button.setStringOff(this.button.getText(true));
            }, this),
            new cc.ScaleTo(0.3, 1.0)
        ));
    },

    updateAvailability: function () {
        if (this.tileModel.isAvailable()) {
            if (this.button) {
                this.button.enable();
            }
            if (this.icon) {
                this.icon.enable();
            }
        } else {
            if (this.button) {
                this.button.disable();
            }
            if (this.icon) {
                this.icon.disable();
            }
        }

        if (this.titleBg) {
            this.titleBg.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.getTitleImage()));
        }

        if (this.descriptionBg) {
            this.descriptionBg.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.getDescriptionBg()));
        }
    },

    addFinger: function () {
        this.finger = FingerView.hintClick(this.button);
    },

    removeFinger: function () {
        FingerView.remove(this.finger);
        this.finger = undefined;
    },

    updateTileState: function () {
        if (this.content) {
            this.content.removeFromParent();
        }
        this.content = this.createContent();
        this.addChild(this.content);

        if (this.tileBadge) {
            this.tileBadge.removeFromParent();
        }
        this.tileBadge = this.createBadge();
        if (this.tileBadge) {
            this.addChild(this.tileBadge);
        }

        if (this.options.onClicked && !this.options.noTileClick) {
            if (this.clickHandler) {
                this.clickHandler.remove();
                this.clickHandler = undefined;
            }

            if (this.tileModel.isAvailable()) {
                this.clickHandler = cleverapps.UI.onClick(this, function () {
                    cleverapps.audio.playSound(bundles.main.urls.click_effect);

                    this.options.onClicked(this.tileModel);
                }.bind(this));
            }
        }
    },

    addBackground: function () {
        var styles = this.styles.background;

        var image = styles.tileBg || bundles.tile_shop.frames.shop_tile_bg_png;

        var background = cleverapps.UI.createScale9Sprite(
            image,
            styles.adjustBackgroundCapInsets ? cleverapps.UI.Scale9Rect.TwoPixelXY : cleverapps.UI.Scale9Rect.Default
        );
        background.setContentSize2(this.width, this.height);
        background.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(background);
    },

    addDecorators: function () {
        var styles = this.styles.decorators;
        if (styles) {
            styles.forEach(function (styles) {
                if (styles.filter && !styles.filter(this.tileModel)) {
                    return;
                }

                var decorator = cleverapps.UI.createScale9Sprite(styles.image, cleverapps.UI.Scale9Rect.TwoPixelXY);
                if (styles.type === Decors.TYPE_SCALE9) {
                    decorator.setContentSize2(styles.width || decorator.width, styles.height || decorator.height);
                }
                decorator.setPositionRound(styles);
                decorator.setLocalZOrder(styles.zOrder || 0);

                if (styles.content) {
                    var filling = styles.content.generator(this.tileModel.product);
                    decorator.addChild(filling);
                    filling.setPositionRound(styles.content);
                }

                if (styles.fitToBox) {
                    cleverapps.UI.fitToBox(decorator, styles.fitToBox);
                }

                this.addChild(decorator);
            }, this);
        }
    },

    createBadge: function () {
        var options = this.tileModel.getBadge();
        if (options) {
            var badge = new TileBadge(options);
            badge.setPositionRound(this.styles.badge);
            badge.setLocalZOrder(2);
            badge.setScale(this.styles.badge.scale);

            if (!this.tileModel.isAvailable()) {
                badge.disable();
            }
            return badge;
        }
    },

    createContent: function () {
        var styles = this.styles;

        var limit = this.createLimit();
        var icon = this.icon = this.createIcon();
        var title = this.wrapTitleWithBg(this.createTitle());
        var description = this.wrapDescriptionWithBg(this.createDescription());
        var button = this.button = this.createButton();

        var items = [limit, icon, title, description, button];
        if (styles.content.order === BaseProductTile.ORDER.TITLE_TOP) {
            items = [limit, title, icon, description, button];
        } else if (styles.content.order === BaseProductTile.ORDER.TITLE_BOTTOM) {
            items = [limit, icon, description, title, button];
        }

        var content = new cleverapps.Layout(items.filter(Boolean), {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.content[this.tileModel.product.itemId] && styles.content[this.tileModel.product.itemId].margin || styles.content.margin
        });
        content.setAnchorPoint2();
        content.setPositionRound(this.options.contentOffset || styles.content);
        content.setLocalZOrder(1);

        if (limit) {
            limit.y += styles.limit.y;
        }
        if (icon) {
            icon.y += styles.icon.y;
        }
        if (title) {
            title.x += styles.title.x;
            title.y += styles.title.y;
        }
        if (description) {
            description.x += styles.description.x;
            description.y += styles.description.y;
        }
        if (button) {
            button.y += styles.button.y;
        }

        return content;
    },

    createIcon: function () {
        var icon = new TileIcon(this.tileModel, {
            animationOverride: this.options.iconAnimationOverride,
            skipScale: this.options.iconSkipScale,
            zOrder: this.options.iconZOrder
        });
        if (!this.tileModel.isAvailable()) {
            icon.disable();
        }
        return icon;
    },

    createLimit: function () {
        var limit = this.tileModel.getProductLimit();
        if (!limit) {
            return;
        }

        var styles = this.styles.limit;
        var font = cleverapps.styles.FONTS.PRODUCT_TILE_LIMIT_TEXT;

        if (limit.countdown) {
            var title = cleverapps.UI.generateOnlyText("TileShop.tile.leftTime", font);
            var countdown = new cleverapps.CountDownView(new cleverapps.CountDown(limit.countdown, {
                onFinish: this.tileModel.updateModelState.bind(this.tileModel)
            }), {
                font: font
            });
            return new cleverapps.Layout([title, countdown].filter(Boolean), {
                direction: cleverapps.UI.VERTICAL,
                dimensions: styles
            });
        }

        if (limit.left) {
            var left = cleverapps.UI.generateOnlyText(limit.left, font);
            left.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            left.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            left.setDimensions(styles.width, styles.height);
            return left;
        }
    },

    createDescription: function () {

    },

    wrapDescriptionWithBg: function (description) {
        if (!description) {
            return;
        }

        var image = this.getDescriptionBg();
        if (!image) {
            return description;
        }

        var styles = this.styles.description;

        var bg = this.descriptionBg = new cc.Scale9Sprite(image);
        bg.setContentSize2(styles.bg && styles.bg.width || description.width, styles.bg && styles.bg.height || description.height);
        bg.setAnchorPoint2();
        bg.setPositionRound(this.styles.description.bg);
        bg.setLocalZOrder(-1);

        bg.addChild(description);
        description.setPositionRound(bg.width / 2, bg.height / 2);

        return bg;
    },

    getTitleImage: function () {
        var image = this instanceof PackProductTile && bundles.tile_shop.frames.pack_shop_title || bundles.tile_shop.frames.shop_title;

        if (!this.tileModel.isAvailable()) {
            image = this instanceof PackProductTile && bundles.tile_shop.frames.pack_shop_title_off || bundles.tile_shop.frames.shop_title_off;
        }

        return image;
    },

    getDescriptionBg: function () {
        var image = bundles.tile_shop.frames.description_bg;

        if (!this.tileModel.isAvailable()) {
            image = bundles.tile_shop.frames.description_bg_off;
        }

        return image || bundles.tile_shop.frames.rewards_block_bg_png;
    },

    createTitle: function () {
        var styles = this.styles.title;
        if (!styles) {
            return;
        }

        var font = cleverapps.styles.FONTS.SHOP_WINDOW_SMALL_TILE_TITLE;
        var text = this.tileModel.getTitle();

        if (cleverapps.UI.ImageFont.IsApplicable(cleverapps.styles.FONTS.SHOP_WINDOW_TILE_TITLE, text)) {
            font = cleverapps.styles.FONTS.SHOP_WINDOW_TILE_TITLE;
        }

        var icon = this.tileModel.getRewardsIcon();

        return new TextWithIcon((icon ? "%%" : "") + text, {
            font: font,
            icons: {
                "%%": icon
            }
        });
    },

    wrapTitleWithBg: function (title) {
        if (!title) {
            return;
        }

        var styles = this.styles.title;

        var background = this.titleBg = cleverapps.UI.createScale9Sprite(this.getTitleImage());
        background.setAnchorPoint2();
        background.setLocalZOrder(styles.zOrder);
        background.setContentSize2(styles.width || background.width, styles.height || background.height);

        if (title.fitTo) {
            title.fitTo(background.width * 0.9);
        }

        title.setPositionRound(styles.text);
        background.addChild(title);
        return background;
    },

    createRewards: function (font) {
        var rewards = new RewardsList(this.tileModel.getReward());
        var reward = rewards.listRewards()[0];

        var text = reward.getText(cleverapps.config.type === "merge" ? "" : "x");
        var icon = TextWithIcon.ICONS_BY_NAME[reward.type] || "%%";

        var customIcon = this.tileModel.getRewardsIcon();
        if (customIcon) {
            icon = "%%";
        }

        return new TextWithIcon(icon + text, {
            font: font,
            icons: {
                "%%": customIcon || RewardTypes[reward.type].icon
            }
        });
    },

    createButton: function () {
        var styles = this.styles.button;
        if (!styles || this.options.noButton) {
            return;
        }

        var button = new TileButton(this.tileModel, {
            onClicked: function () {
                this.removeFinger();

                this.options.onClicked.apply(this, arguments);
            }.bind(this)
        });
        button.setLocalZOrder(1);
        if (!this.tileModel.isAvailable()) {
            button.disable();
        }
        return button;
    }
});

BaseProductTile.ORDER = {
    DEFAULT: 0,
    TITLE_TOP: 1,
    TITLE_BOTTOM: 2
};

cleverapps.styles.BaseProductTile = {
    width: 444,
    height: 747,

    background: {

    },

    badge: {
        x: { align: "left", dx: -30 },
        y: { align: "top", dy: 30 },
        scale: 1
    },

    content: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 0 }
    },

    limit: {
        width: 370,
        height: 70,
        y: 0
    },

    icon: {
        y: 0
    },

    title: {
        width: 480,
        x: 0,
        y: 0,
        zOrder: 1,
        text: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 0 }
        },
        content: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 0 }
        }
    },

    description: {
        width: 360,
        height: 180,
        y: 0,
        x: 0,
        bg: {
            width: 494,
            height: 120,
            x: { align: "center" },
            y: { align: "center" }
        }
    },

    button: {
        y: 0
    }
};
