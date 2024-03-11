/**
 * Created by iamso on 17.08.2021
 */

var GrowthFundWindow = Window.extend({
    onWindowLoaded: function () {
        this.product = Product.Create("growthFund");

        this._super({
            name: "GrowthFundWindow",
            title: "GrowthFundWindow.title",
            content: this.createContent(),
            styles: cleverapps.styles.GrowthFundWindow.window,
            foreground: bundles.windows.frames.window_foreground_png
        });

        cleverapps.meta.showControlsWhileFocused("MenuBarGoldItem");
        cleverapps.growthFund.on("updateState", this.updateState.bind(this), this);
        cleverapps.growthFund.wantsAttention = false;

        Lottery.addText(this);
    },

    getPerson: function () {
        return PersonsLibrary.hasRole("seller") && "seller";
    },

    onShow: function () {
        this._super();

        if (cleverapps.growthFund.isBought()) {
            this.removeBuyButton();
        }
    },

    createContent: function () {
        var styles = cleverapps.styles.GrowthFundWindow;

        return new cleverapps.Layout([this.createTop(), this.createTiles()], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
    },

    createTop: function () {
        var styles = cleverapps.styles.GrowthFundWindow.top;

        var bg = this.top = cleverapps.UI.createScale9Sprite(bundles.growth_fund.frames.top_bg, cleverapps.UI.Scale9Rect.TwoPixelXY);
        bg.setContentSize2(styles);
        bg.setLocalZOrder(1);

        var icon = new cleverapps.Spine(bundles.growth_fund.jsons.main_win_safe);
        icon.setAnimationAndIdleAfter("open", "idle");
        bg.addChild(icon);
        icon.setPositionRound(styles.icon);

        var text1 = cleverapps.UI.generateOnlyText("GrowthFundWindow.cta1", cleverapps.styles.FONTS.GROWTH_FUND_CTA1);
        var text2 = cleverapps.UI.generateOnlyText("GrowthFundWindow.cta2", cleverapps.styles.FONTS.GROWTH_FUND_CTA2);
        text2.fitTo(styles.text.width);

        var cta = new cleverapps.Layout([text1, text2], {
            align: styles.align,
            direction: cleverapps.UI.VERTICAL,
            margin: styles.text.margin
        });
        bg.addChild(cta);
        cta.setPositionRound(styles.text);

        this.createBuyButton();
        return bg;
    },

    createBuyButton: function () {
        if (cleverapps.growthFund.isBought()) {
            this.removeBuyButton();
            return;
        }

        var styles = cleverapps.styles.GrowthFundWindow.top.button;

        this.buyButton = new cleverapps.UI.Button({
            width: styles.width,
            height: styles.height,
            type: ["tropical", "riddles"].includes(cleverapps.config.ui) ? cleverapps.styles.UI.Button.Images.button_blue : cleverapps.styles.UI.Button.Images.button_purple,
            text: this.product.getCurrentPrice(),
            onClicked: this.onBuy.bind(this)
        });
        Lottery.addIcon(this.buyButton);

        this.top.addChild(this.buyButton);
        this.buyButton.setPositionRound(styles);
    },

    removeBuyButton: function () {
        if (this.buyButton) {
            this.buyButton.removeFromParent();
            delete this.buyButton;
        }

        if (!this.mark) {
            this.mark = new cc.Sprite(bundles.growth_fund.frames.bought_checkmark || bundles.growth_fund.frames.checkmark);
            this.top.addChild(this.mark);
            this.mark.setPositionRound(cleverapps.styles.GrowthFundWindow.top.mark);
        }
    },

    onBuy: function () {
        this.product.buy(function (success) {
            if (success) {
                this.removeBuyButton();
                cleverapps.growthFund.afterBuy();
            }
        }.bind(this));
    },

    createTiles: function () {
        var styles = cleverapps.styles.GrowthFundWindow.scroll;

        this.levelTiles = cleverapps.growthFund.levels.map(function (item) {
            return new GrowthFundLevelView(item);
        }, this);

        var tilesNode = new cleverapps.Layout(this.levelTiles, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });

        var scroll = this.scroll = new cleverapps.UI.ScrollView(tilesNode, {
            direction: cleverapps.UI.ScrollView.DIR_VERTICAL
        });
        scroll.setContentSize2(styles);
        this.animateScrollToRelevant();

        if (styles.top) {
            var top = cleverapps.UI.createScale9Sprite(bundles.growth_fund.frames.scroll_top);
            top.setContentSize2(styles.top);
            scroll.addChild(top);
            top.setPositionRound(styles.top);
        }

        return scroll;
    },

    animateScrollToRelevant: function () {
        var lastOpen = this.levelTiles.length - 1;
        for (; lastOpen >= 0; lastOpen--) {
            if (this.levelTiles[lastOpen].state !== GrowthFund.STATE.INSUFFICIENT) {
                break;
            }
        }

        var time = Math.min(2, Math.max(0.5, 2 * lastOpen / this.levelTiles.length));
        this.scroll.scrollTo(this.levelTiles[lastOpen]);
        this.scroll.runAction(
            new cc.Sequence(
                new cc.DelayTime(0.3),
                new cc.CallFunc(function () {
                    var level = cleverapps.growthFund.findFirst(GrowthFund.STATE.READY) || cleverapps.growthFund.findFirst(GrowthFund.STATE.INSUFFICIENT);
                    if (level) {
                        var index = cleverapps.growthFund.levels.indexOf(level);
                        this.scroll.scrollTo(this.levelTiles[index], time, {
                            easing: cc.easeInOut(2)
                        });
                    }
                }.bind(this))
            )
        );
    },

    updateState: function () {
        this.levelTiles.forEach(function (tile) {
            tile.updateState();
        });
    },

    listBundles: function () {
        return ["growth_fund"];
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    GROWTH_FUND_CTA1: {
        size: 52,
        color: cleverapps.styles.COLORS.WHITE
    },

    GROWTH_FUND_CTA2: {
        size: 35,
        color: cleverapps.styles.COLORS.WHITE
    }
});

cleverapps.styles.GrowthFundWindow = {
    margin: 10,

    window: {
        padding: {
            left: 45,
            right: 45,
            top: 90,
            bottom: 30
        }
    },

    top: {
        width: 980,
        height: 250,
        align: cleverapps.UI.ALIGN_START,

        text: {
            width: 590,
            margin: -15,
            x: { align: "left", dx: 290 },
            y: { align: "top", dy: -5 }
        },

        icon: {
            x: { align: "left", dx: 15 },
            y: { align: "center", dy: -30 }
        },

        button: {
            width: 230,
            height: 90,
            x: { align: "right", dx: -80 },
            y: { align: "bottom", dy: 25 }
        },

        mark: {
            x: { align: "right", dx: -150 },
            y: { align: "bottom", dy: 45 }
        }
    },

    scroll: {
        margin: 5,
        width: 990,
        height: 710,

        top: {
            width: 1078,
            height: 45,
            x: { align: "center", dx: 0 },
            y: { align: "top", dy: 25 }
        }
    }
};
