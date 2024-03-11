/**
 * Created by spepa on 24.04.2023
 */

var BonusSaleLot = cc.Scale9Sprite.extend({
    ctor: function (lot, logic) {
        this._super(bundles.periodic_sale.frames.tile_bg, cleverapps.UI.getScale9Rect(bundles.periodic_sale.frames.tile_bg, cleverapps.UI.Scale9Rect.TwoPixelXY));
        this.setContentSize2(cleverapps.styles.BonusSaleLot);

        this.lot = lot;
        this.logic = logic;
        this.product = Product.Create(this.lot.product);

        this.createHeader();
        this.createIcon();
        this.createButton();

        this.clickHandler = cleverapps.UI.onClick(this, this.buyProduct.bind(this));
        this.updateState();
    },

    createHeader: function () {
        var styles = cleverapps.styles.BonusSaleLot.header;

        var rewardBg = cleverapps.UI.createScale9Sprite(bundles.periodic_sale.frames.reward_title, cleverapps.UI.Scale9Rect.TwoPixelXY);
        rewardBg.setContentSize2(styles.reward.bg);

        if (cleverapps.config.ui === "tropical") {
            var bonus = cleverapps.UI.createScale9Sprite(bundles.periodic_sale.frames.bonus_sale_header);
            bonus.setContentSize(styles.bonus);
        } else {
            var bonusBg1 = new cc.Sprite(bundles.periodic_sale.frames.bonus_sale_header);
            var bonusBg2 = new cc.Sprite(bundles.periodic_sale.frames.bonus_sale_header);
            bonusBg2.setScaleX(-1);
            bonus = new cleverapps.Layout([bonusBg1, bonusBg2], { direction: cleverapps.UI.HORIZONTAL });
        }
        bonus.setPositionRound(styles.bonus);
        rewardBg.addChild(bonus, -1);

        if (cleverapps.config.ui === "wooden") {
            var decor1 = new cc.Sprite(bundles.periodic_sale.frames.bonus_tile_decor1);
            decor1.setPositionRound(styles.bonus.decor1);
            bonus.addChild(decor1, -1);

            var decor2 = new cc.Sprite(bundles.periodic_sale.frames.bonus_tile_decor2);
            decor2.setPositionRound(styles.bonus.decor2);
            bonus.addChild(decor2, -1);
        }

        var bonusText = cleverapps.UI.generateOnlyText(Messages.get("BonusSalePlus"), cleverapps.styles.FONTS.BONUSSALE_PLUS);
        bonusText.fitTo(styles.bonus.text.width);
        bonusText.setPositionRound(styles.bonus.text);
        bonus.addChild(bonusText);

        var bonusReward = new RewardsListComponent(this.lot.reward, {
            columns: 2,
            noPrefix: true,
            small: true,
            font: cleverapps.styles.FONTS.BONUSSALE_BONUS_REWARD,
            textDirection: cleverapps.UI.HORIZONTAL,
            margin: styles.bonus.reward.margin,
            textMargin: styles.bonus.reward.textMargin
        });
        bonusReward.setPositionRound(styles.bonus.reward);
        bonus.addChild(bonusReward);

        var reward = new RewardsListComponent(this.product.reward, {
            columns: 1,
            noPrefix: true,
            small: true,
            font: cleverapps.styles.FONTS.BONUSSALE_PRODUCT_REWARD,
            textDirection: cleverapps.UI.HORIZONTAL
        });
        reward.setPositionRound(styles.reward);
        rewardBg.addChild(reward);

        rewardBg.setPositionRound(styles);
        this.addChild(rewardBg);
    },

    createIcon: function () {
        var styles = cleverapps.styles.BonusSaleLot.icon;

        var icon = new cc.Sprite(bundles.periodic_sale.frames[this.product.icon]);
        var sparkle = new cleverapps.Spine(bundles.periodic_sale.jsons.shop_sparkles_large_json);
        sparkle.setPosition(icon.width / 2, icon.height / 2);
        sparkle.setAnimation(0, "animation", true);
        icon.addChild(sparkle);

        if (["wooden", "riddles", "tropical"].includes(cleverapps.config.ui)) {
            var decor1 = new cc.Sprite(bundles.periodic_sale.frames.bonus_product_decor1);
            decor1.setPositionRound(styles.decor1);
            icon.addChild(decor1, -1);

            var decor2 = new cc.Sprite(bundles.periodic_sale.frames.bonus_product_decor2);
            decor2.setPositionRound(styles.decor2);
            icon.addChild(decor2, -1);
        }

        if (styles.light) {
            var light = new cc.Sprite(bundles.periodic_sale.frames.bonus_sale_light_bg);
            light.setPositionRound(icon.width / 2, icon.height / 2);
            light.setScale(styles.light.scale);
            icon.addChild(light, -2);
        }

        icon.setPositionRound(styles);
        this.addChild(icon);
    },

    createButton: function () {
        var styles = cleverapps.styles.BonusSaleLot.button;
        var button = this.button = new cleverapps.UI.Button({
            text: this.product.getCurrentPrice(),
            onClicked: this.buyProduct.bind(this),
            width: cleverapps.styles.BonusSaleLot.button.width,
            height: cleverapps.styles.BonusSaleLot.button.height
        });

        var badge = new cc.Sprite(bundles.periodic_sale.frames.sale_badge_png);
        var text = cleverapps.UI.generateOnlyText(this.lot.profit + "\nFREE", cleverapps.styles.FONTS.BONUSSALE_BADGE);
        text.fitTo(styles.badge.text.width, styles.badge.text.height);
        text.setPositionRound(styles.badge.text);
        text.setRotation(styles.badge.text.rotation);
        badge.addChild(text);
        badge.setPositionRound(styles.badge);
        button.addChild(badge);

        Lottery.addIcon(button);

        button.setPositionRound(styles);
        this.addChild(button);
    },

    buyProduct: function () {
        if (!this.logic.isSoldLot(this.lot.id)) {
            this.product.buy(function (success) {
                if (success) {
                    this.updateState();
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SPENT.PERIODIC_LOT + this.lot.id);
                }
            }.bind(this));
        }
    },

    updateState: function () {
        if (this.logic.isSoldLot(this.lot.id)) {
            this.button.disable();
            this.button.setString(Messages.get("SoldOut"));

            if (this.clickHandler) {
                this.clickHandler.remove();
                this.clickHandler = undefined;
            }

            if (this.button.lotteryIcon) {
                this.button.lotteryIcon.removeFromParent();
            }
        }
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    BONUSSALE_PLUS: {
        size: 42,
        color: cleverapps.styles.COLORS.YELLOW,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    BONUSSALE_REWARDS: {
        size: 30,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE
    },

    BONUSSALE_BADGE: {
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        size: 23
    },

    BONUSSALE_PRODUCT_REWARD: {
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.SHOP_STROKE,
        size: 60
    },

    BONUSSALE_BONUS_REWARD: {
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.SHOP_STROKE,
        size: 45
    }
});

cleverapps.styles.BonusSaleLot = {
    width: 460,
    height: 800,

    header: {
        x: { align: "center", dx: -1 },
        y: { align: "top", dy: -25 },

        reward: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 10 },

            bg: {
                width: 496,
                height: 120
            }
        },

        bonus: {
            x: { align: "center" },
            y: { align: "bottom", dy: -187 },

            reward: {
                x: { align: "center" },
                y: { align: "center", dy: -20 },
                margin: { y: 0 }
            },

            text: {
                width: 300,
                x: { align: "center", dx: 0 },
                y: { align: "center", dy: 65 }
            }
        }
    },

    icon: {
        x: { align: "center" },
        y: { align: "bottom", dy: 140 },

        decor1: {
            x: { align: "center", dx: -116 },
            y: { align: "bottom", dy: 74 }
        },

        decor2: {
            x: { align: "center", dx: 120 },
            y: { align: "bottom", dy: 74 }
        }
    },

    button: {
        width: 300,

        x: { align: "center" },
        y: { align: "bottom", dy: 22 },

        badge: {
            x: { align: "right", dx: 76 },
            y: { align: "center", dy: 21 },
            text: {
                x: { align: "center", dx: 15 },
                y: { align: "center", dy: 3 },
                rotation: 32,
                width: 90,
                height: 68
            }
        }
    }

};
