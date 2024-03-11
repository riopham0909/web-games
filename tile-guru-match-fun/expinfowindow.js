/**
 * Created by slava on 24.03.17.
 */

var ExpInfoWindow = Window.extend({
    onWindowLoaded: function () {
        var content = this.generateContent();

        this._super({
            title: "ExpInfoWindow.Title",
            name: "expinfowindow",
            content: content
        });

        Lottery.addText(this);
    },

    generateProductOption: function (optionId, spriteFileName) {
        var styles = cleverapps.styles.ExpInfoWindow;
        var product = Product.Create(optionId);

        var optionButton = new cleverapps.UI.Button({
            text: product.getCurrentPrice(),
            onClicked: function () { 
                product.buy(function (success) {
                    if (success) {
                        this.close();
                    }
                }.bind(this));
            }.bind(this),
            width: styles.button.width,
            height: styles.button.height
        });

        Lottery.addIcon(optionButton);

        var expAmount = new TextWithIcon(product.reward.exp + "%%", {
            font: cleverapps.styles.FONTS.EXP_INFO_WINDOW_AMOUNT_TEXT || cleverapps.styles.FONTS.WINDOW_TEXT,
            icons: {
                "%%": bundles.reward_icons.frames.reward_exp_png
            }
        });

        var optionIcon = new cc.Sprite(spriteFileName);

        return new cleverapps.Layout([optionIcon, expAmount, optionButton], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.button.itemsMargin
        });
    },

    generateContent: function () {
        var styles = cleverapps.styles.ExpInfoWindow;

        var descriptionText = cleverapps.UI.generateOnlyText("ExpInfoWindow.Message", cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        descriptionText.setDimensions(styles.text.width, 0);
        descriptionText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var offerText = cleverapps.UI.generateOnlyText("ExpInfoWindow.BuyMessage", cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        offerText.setDimensions(styles.text.width, 0);
        offerText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var offerOptions = new cleverapps.Layout([
            this.generateProductOption("buyExp10", bundles.exp_window.frames.small_exp_box),
            this.generateProductOption("buyExp150", bundles.exp_window.frames.exp_box)
        ], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.buttonsMargin,
            align: cleverapps.UI.ALIGN_START
        });

        return new cleverapps.Layout([descriptionText, offerText, offerOptions], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });
    },

    listBundles: function () {
        return ["exp_window"];
    }
});

cleverapps.styles.ExpInfoWindow = {
    margin: 30,
    buttonsMargin: 50,

    text: {
        width: 600
    },

    exp: {
        width: 400,
        height: 200
    },

    button: {
        itemsMargin: 3,
        width: 300,
        height: 100
    }
};