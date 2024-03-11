/**
 * Created by olga on 24.01.2024
 */

var ChainSaleLot = cc.Scale9Sprite.extend({
    ctor: function (stage, logic) {
        this.stage = stage;
        this.logic = logic;

        var product = logic.getProduct(stage);
        if (product) {
            this.product = Product.Create(product);
        }

        if (this.logic.isOpened(this.stage)) {
            this.open(true);
        }

        var bg = this.product ? bundles.chain_sale.frames.paid_tile_bg : bundles.chain_sale.frames.free_tile_bg;
        this._super(bg, cleverapps.UI.getScale9Rect(bg, { x: 0.5, y: 0.3 }));
        this.setContentSize2(cleverapps.styles.ChainSaleLot);
        this.setCascadeOpacityEnabledRecursively(true);

        this.createReward();
        this.createButton();
        this.setVisible(false);
        if (!this.logic.isLast(stage)) {
            this.createArrow();
        }
    },

    createArrow: function () {
        var arrow = this.arrow = new cc.Sprite(bundles.chain_sale.frames.arrow_png);
        arrow.setPositionRound(cleverapps.styles.ChainSaleLot.arrow);
        this.addChild(arrow);
    },

    open: function (silent) {
        this.opened = true;
        cleverapps.UI.onClick(this, this.buyProduct.bind(this));
        if (!silent) {
            var buttonLightAnimation = new cleverapps.Spine(bundles.chain_sale.jsons.button_light_json);
            buttonLightAnimation.setAnimation(0, "animation", false);
            buttonLightAnimation.setPositionRound(cleverapps.styles.ChainSaleLot.button);
            buttonLightAnimation.setCompleteListenerRemove();
            this.addChild(buttonLightAnimation, 1);

            this.lock.replaceParentSamePlace(this, {
                keepScale: true
            });
            this.lock.setLocalZOrder(10);
            this.lock.setAnimation(0, "open", false);
            this.lock.setCompleteListenerRemove();

            this.runAction(new cc.Sequence(
                new cc.DelayTime(0.1),
                new cc.CallFunc(function () {
                    this.createButton();
                }.bind(this))
            ));
        }
    },

    createReward: function () {
        var styles = cleverapps.styles.ChainSaleLot.reward;

        var rewardComponent = this.rewardComponent = new RewardsListComponent(this.logic.getReward(this.stage), {
            columns: 2,
            font: cleverapps.styles.FONTS.CHAIN_SALE_REWARD,
            textDirection: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            textMargin: -5,
            icons: {
                soft: bundles.chain_sale.frames.coins_png
            }
        });
        rewardComponent.setPositionRound(styles);
        rewardComponent.setCascadeOpacityEnabledRecursively(true);
        this.addChild(rewardComponent);
    },

    createButton: function () {
        if (this.button) {
            this.button.removeFromParent(true);
        }
        var styles = cleverapps.styles.ChainSaleLot.button;

        var text = this.product ? this.product.getCurrentPrice() : "FREE";
        var textNode = new TextWithIcon(text, { font: cleverapps.styles.FONTS.BUTTON_BOOSTER });
        if (!this.opened) {
            var lock = this.lock = new cleverapps.Spine(bundles.chain_sale.jsons.lock_json);
            lock.setAnimation(0, "idle", false);
        }

        var buttonContent = new cleverapps.Layout([textNode, lock], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });

        var button = this.button = new cleverapps.UI.Button({
            content: buttonContent,
            type: this.opened ? {
                button_png: bundles.chain_sale.frames.yellow_button,
                button_on_png: bundles.chain_sale.frames.yellow_button_on,
                button_off_png: bundles.buttons.frames.button_disabled_png
            } : undefined,
            onClicked: this.buyProduct.bind(this),
            width: styles.width,
            height: styles.height
        });
        button.setPositionRound(styles);
        button.setCascadeOpacityEnabledRecursively(true);
        this.addChild(button);
    },

    buyProduct: function () {
        if (!this.opened || this.logic.isSold(this.stage)) {
            return;
        }

        var onSuccess = function () {
            this.logic.lotBought();
            if (this.isRunning()) {
                this.rewardComponent.receiveRewards();
                this.onBuyAnimation();
            } else {
                var reward = this.logic.getReward(this.stage);
                cleverapps.meta.display({
                    focus: "chainSaleRewardWindow",
                    action: function (f) {
                        new RewardWindow(reward);
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            }
        }.bind(this);
        if (this.product) {
            this.product.buy(function (success) {
                if (success) {
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SPENT.CHAIN_LOT + this.stage);
                    onSuccess();
                }
            }.bind(this), { noRewardWindow: true });
        } else {
            onSuccess();
        }
    },

    hideAnimation: function (delay) {
        this.runAction(new cc.Sequence(
            new cc.DelayTime(delay),
            new cc.ScaleTo(0.25, 1.3).easing(cc.easeOut(2)),
            new cc.Spawn(
                new cc.ScaleTo(0.25, 0.15).easing(cc.easeIn(2)),
                new cc.Sequence(
                    new cc.DelayTime(0.1),
                    new cc.FadeTo(0.2, 0.3),
                    new cc.Hide()
                )
            )
        ));
    },

    appearAnimation: function (delay) {
        this.setScale(0.4);
        this.setOpacity(0.3);
        this.runAction(new cc.Sequence(
            new cc.DelayTime(delay),
            new cc.Show(),
            new cc.Spawn(
                new cc.ScaleTo(0.4, 1).easing(cc.easeBackOut()),
                new cc.FadeIn(0.15)
            )
        ));
    },

    onBuyAnimation: function () {
        this.rewardComponent.receiveRewardsAnimation();
        var checkmark = new cleverapps.Spine(bundles.chain_sale.jsons.checkmark_json);
        checkmark.setAnimation(0, "open", false);
        checkmark.setPositionRound(cleverapps.styles.ChainSaleLot.checkmark);
        this.addChild(checkmark);

        cleverapps.audio.playSound(bundles.chain_sale.urls.chain_sale_open_effect);

        this.button.runAction(
            new cc.Sequence(
                new cc.ScaleTo(0.2, 1.3).easing(cc.easeOut(2)),
                new cc.Spawn(
                    new cc.ScaleTo(0.2, 0.3).easing(cc.easeIn(2)),
                    new cc.Sequence(
                        new cc.DelayTime(0.1),
                        new cc.FadeTo(0.1, 0.3),
                        new cc.Hide()
                    )
                )
            )
        );
    }

});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CHAIN_SALE_REWARD: {
        name: "nostroke",
        size: 45,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    }

});

cleverapps.styles.ChainSaleLot = {
    width: 450,
    height: 700,

    reward: {
        x: { align: "center" },
        y: { align: "center", dy: 50 },
        margin: { x: 10, y: -5 }
    },

    button: {
        width: 250,
        height: 90,
        margin: 5,
        x: { align: "center" },
        y: { align: "bottom", dy: 48 }
    },

    checkmark: {
        x: { align: "center" },
        y: { align: "bottom", dy: 40 }
    },

    arrow: {
        x: { align: "right", dx: 45 },
        y: { align: "center" }
    }
};
