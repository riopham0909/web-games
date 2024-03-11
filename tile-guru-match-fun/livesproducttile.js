/**
 * Created by vladislav on 26.08.2019
 */

var LivesProductTile = BaseProductTile.extend({
    ctor: function (tileModel, options) {
        var styles = LivesProductTile.styles = LivesProductTile.styles || cleverapps.overrideStyles(cleverapps.styles.BaseProductTile, cleverapps.styles.LivesProductTile, true);

        options = options || {};
        options.noTileClick = true;
        options.iconSkipScale = true;
        options.iconAnimationOverride = tileModel.product.animation ? {
            json: bundles.tile_shop.jsons.shop_lives_animations_json,
            delay: 0
        } : {};

        this._super(tileModel, styles, options);
    },

    onReady: function () {
        if (this.tileModel instanceof EnergyLotteryTileModel && Game.currentGame.energyLottery.isHintActive() && Game.currentGame.energyLottery.isReady()) {
            this.addFinger();
        }
    },

    createDescription: function () {
        var description = this.tileModel.getProductDescription();
        if (!description) {
            return;
        }

        if (typeof description === "string") {
            description = {
                title: description
            };
        }

        var styles = this.styles.description;

        if (description.reward) {
            return this.createRewards(cleverapps.styles.FONTS.SHOP_WINDOW_LIVES_TEXT);
        } if (description.countdown) {
            var font = cleverapps.styles.FONTS.SHOP_LIVES_PRODUCT_TILE_DESCRIPTION_TEXT || cleverapps.styles.FONTS.SMALL_WHITE_TEXT;

            var title = cleverapps.UI.generateOnlyText("TileShop.tile.leftTime", font);
            var countdown = new cleverapps.CountDownView(new cleverapps.CountDown(description.countdown, {
                onFinish: this.tileModel.updateModelState.bind(this.tileModel)
            }), {
                font: font
            });

            var icon = new cc.Sprite(bundles.timer.frames.timer_png);
            countdown = new cleverapps.Layout([icon, countdown], {
                direction: cleverapps.UI.HORIZONTAL,
                margin: styles.timer.margin
            });

            return new cleverapps.Layout([title, countdown], {
                direction: cleverapps.UI.VERTICAL,
                dimensions: styles
            });
        } if (description.text) {
            font = cleverapps.styles.FONTS.SHOP_LIVES_PRODUCT_TILE_DESCRIPTION_TEXT || cleverapps.styles.FONTS.SMALL_WHITE_TEXT;

            var text = cleverapps.UI.generateOnlyText(description.text, font);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            text.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            text.setDimensions(styles.width, 0);
            text.fitTo(undefined, styles.height);
            text.setDimensions(styles.width, styles.height);
            return text;
        }
    },

    createLimit: function () {
        if (cleverapps.config.type !== "merge") {
            return this._super();
        }

        var limit = this.tileModel.getProductLimit();
        if (!limit) {
            return;
        }

        var styles = this.styles.limit;

        if (limit.left) {
            var left = cleverapps.UI.generateOnlyText(limit.left, cleverapps.styles.FONTS.SHOP_LIVES_PRODUCT_TILE_DESCRIPTION_TEXT);
            left.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            left.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            left.setDimensions(styles.width, styles.height);
            return left;
        }
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    SHOP_LIVES_PRODUCT_TILE_DESCRIPTION_TEXT: {
        size: 30,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    }
});

cleverapps.styles.LivesProductTile = {
    button: {
        width: 225,
        height: 75
    },

    description: {
        width: 300,
        height: 70,

        timer: {
            margin: 6
        }
    },

    badge: {
        x: { align: "right", dx: -5 },
        y: { align: "top", dy: -58 },
        rotation: 0
    }
};
