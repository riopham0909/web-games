/**
 * Created by iamso on 30.08.2021
 */

var GrowthFundBuyWindow = Window.extend({
    onWindowLoaded: function () {
        this.product = Product.Create("growthFund");

        this._super({
            name: "GrowthFundBuyWindow",
            title: "GrowthFundBuyWindow.title",
            content: this.createContent()
        });

        this.createBadge();
        Lottery.addText(this);
    },

    getPerson: function () {
        return PersonsLibrary.hasRole("seller") && "seller";
    },

    createContent: function () {
        var styles = cleverapps.styles.GrowthFundBuyWindow;

        var button = this.createBuyButton();
        var textNode = this.creteTextNode();
        var icon = new cleverapps.Spine(bundles.growth_fund.jsons.buy_fund_safe);
        icon.setAnimationAndIdleAfter("open", "idle");

        return new cleverapps.Layout([icon, textNode, button], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });
    },

    creteTextNode: function () {
        var styles = cleverapps.styles.GrowthFundBuyWindow.text;

        var createLine = function (msg, amount) {
            var cta = cleverapps.UI.generateOnlyText(msg, cleverapps.styles.FONTS.WINDOW_TEXT);
            var amountText = cleverapps.UI.generateImageText(cleverapps.formatAmount(amount), cleverapps.styles.FONTS.GROWTH_FUND_RECEIVE_AMOUNT);
            var icon = new cc.Sprite(bundles.growth_fund.frames.rubies);

            var amountBlock = new cleverapps.Layout([amountText, icon], {
                direction: cleverapps.UI.HORIZONTAL,
                margin: styles.iconMargin
            });

            return new cleverapps.Layout([cta, amountBlock], {
                direction: cleverapps.UI.HORIZONTAL,
                margin: styles.margin
            });
        };

        var line1 = createLine("GrowthFundBuyWindow.text1", cleverapps.growthFund.getTotalWaitingRewards());
        var line2 = createLine("GrowthFundBuyWindow.text2", GrowthFund.LEVELS.rewards.default);

        return new cleverapps.Layout([line1, line2], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.lineMargin
        });
    },

    createBuyButton: function () {
        var btn = new cleverapps.UI.Button({
            text: this.product.getCurrentPrice(),
            onClicked: function () {
                this.product.buy(function (success) {
                    if (success) {
                        cleverapps.growthFund.afterBuy();
                        this.close();
                    }
                }.bind(this));
            }.bind(this),
            width: cleverapps.styles.GrowthFundBuyWindow.button.width,
            height: cleverapps.styles.GrowthFundBuyWindow.button.height
        });
        Lottery.addIcon(btn);
        return btn;
    },

    createBadge: function () {
        var styles = cleverapps.styles.GrowthFundBuyWindow.badge;

        var badge = new TileBadge({
            type: "value",
            value: "800%"
        });
        badge.setPositionRound(styles);
        this.window.addChild(badge);
    },

    listBundles: function () {
        return ["growth_fund"];
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    GROWTH_FUND_RECEIVE_AMOUNT: {
        name: "nostroke",
        size: 53,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    }
});

cleverapps.styles.GrowthFundBuyWindow = {
    margin: 20,

    text: {
        margin: 20,
        iconMargin: 5,
        lineMargin: 0
    },

    badge: {
        x: { align: "right", dx: 40 },
        y: { align: "bottom", dy: -40 }
    },

    button: {
        width: 240,
        height: 95
    }
};
