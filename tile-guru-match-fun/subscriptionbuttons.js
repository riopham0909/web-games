/**
 * Created by Oleg on 28.02.2020.
 */

var SubscriptionButtons = cleverapps.GridLayout.extend({
    ctor: function (options) {
        var styles = cleverapps.styles.SubscriptionButtons;
        var isIOS = cleverapps.platform.oneOf(IOS);

        var payText = isIOS ? Messages.get("SubscriptionWindow.iosMonthButton", {
            price: Product.ReplaceIconCodes(options.monthProduct.getCurrentPrice())
        }) : options.monthProduct.getCurrentPrice();

        var buttonPay = this.createBuyButton(options.monthProduct, options.buySubscription, cleverapps.styles.UI.Button.Images.button_blue, payText);
        Lottery.addIcon(buttonPay);

        var tryFreeText = Messages.get(isIOS ? "SubscriptionWindow.iosWeekButton" : "SubscriptionWindow.Free", {
            price: Product.ReplaceIconCodes(options.weekProduct.getCurrentPrice())
        });
        var buttonTryFree = this.createBuyButton(options.weekProduct, options.buySubscription, cleverapps.styles.UI.Button.Images.button_green, tryFreeText);

        var tryFreeTitle = Messages.get(options.weekProduct.trial.indexOf("3 day") === 0 ? "SubscriptionWindow.ThreeDaysAdditional" : "SubscriptionWindow.OneDayAdditional", {
            newline: "\n"
        });
        if (isIOS) {
            tryFreeTitle = Messages.get("SubscriptionWindow.iOSThreeDaysAdditional", {
                price: Product.ReplaceIconCodes(options.weekProduct.getCurrentPrice())
            });
        }

        tryFreeTitle = cleverapps.UI.generateOnlyText(tryFreeTitle, cleverapps.styles.FONTS.SUBSCRIPTION_BUTTON_TITLE);
        tryFreeTitle.setDimensions(styles.buttonWidth, 0);
        tryFreeTitle.fitTo(undefined, styles.titleHeight);
        tryFreeTitle.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var payTitle = "SubscriptionWindow.MonthlyAdditional";
        payTitle = cleverapps.UI.generateOnlyText(payTitle, cleverapps.styles.FONTS.SUBSCRIPTION_BUTTON_TITLE);
        payTitle.setDimensions(styles.buttonWidth, 0);
        payTitle.fitTo(undefined, styles.titleHeight);
        payTitle.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        this._super([tryFreeTitle, payTitle, buttonTryFree, buttonPay], {
            columns: 2,
            align: {
                y: cleverapps.UI.ALIGN_START
            },
            margin: styles.margin
        });
    },

    createBuyButton: function (product, buyCallback, type, text) {
        var styles = cleverapps.styles.SubscriptionButtons;
        return new cleverapps.UI.Button({
            text: text || product.getCurrentPrice(),
            type: type,
            width: styles.buttonWidth,
            height: styles.buttonHeight,
            onClicked: function () {
                buyCallback(product);
            }
        });
    }
});

cleverapps.styles.SubscriptionButtons = {
    contentObjectsMargin: 7,
    buttonWidth: 270,
    buttonHeight: 100,
    titleHeight: 70,
    margin: {
        x: 40,
        y: 7
    }
};
