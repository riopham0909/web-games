/**
 * Created by slava on 24.03.17.
 */

var ExtendUnlimitedLivesWindow = Window.extend({
    onWindowLoaded: function () {
        var styles = cleverapps.styles.ExtendUnlimitedLivesWindow;

        var animation = this.createAnimation();

        var text = this.createText();

        this.product = Product.Create("unlimitedLives");

        var content = new cleverapps.Layout([animation, text], {
            margin: styles.margin,
            direction: cleverapps.UI.VERTICAL,
            padding: styles.padding
        });

        this._super({
            content: content,
            title: "ExtendUnlimitedLivesWindow.title",
            name: "extendunlimitedliveswindow",
            button: {
                text: this.getButtonText(),
                width: styles.button.width,
                height: styles.button.height,
                onPressed: this.onBuy.bind(this)
            },
            openSound: bundles.extend_unlimited_lives_window.urls.lives_effect
        });

        if (this.product.currency === "hard") {
            cleverapps.meta.showControlsWhileFocused("MenuBarGoldItem");
        }

        Lottery.addIcon(this.button);
    },

    getPerson: function () {
        return {
            role: "hero",
            emotion: "sad"
        };
    },

    createText: function () {
        var styles = cleverapps.styles.ExtendUnlimitedLivesWindow;

        var text = cleverapps.UI.generateOnlyText("ExtendUnlimitedLivesWindow.unlimitedLivesText", cleverapps.styles.FONTS.WINDOW_TEXT);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.text.width, 0);
        text.fitTo(undefined, styles.text.height);

        return text;
    },

    createAnimation: function () {
        var styles = cleverapps.styles.ExtendUnlimitedLivesWindow;

        var node = new cc.Node();
        node.setAnchorPoint2();
        node.setContentSize2(styles.animation);

        var animation = new cleverapps.Spine(bundles.extend_unlimited_lives_window.jsons.lives_json);
        if (["differences", "tripeaks", "olympics", "spades", "zenmatch"].indexOf(cleverapps.config.name) !== -1) {
            animation.setAnimationAndIdleAfter("no_life", "idle");
        } else {
            animation.setAnimation(0, "no_life", true);
        }

        node.addChild(animation);
        animation.setPositionRound(styles.animation);

        return node;
    },

    onBuy: function () {
        this.product.buy(function (success) {
            if (success) {
                this.close();
            }
        }.bind(this));
    },

    getButtonText: function () {
        return this.product.getCurrentPrice();
    },

    listBundles: function () {
        return ["extend_unlimited_lives_window"];
    }
});

cleverapps.styles.ExtendUnlimitedLivesWindow = {
    margin: 75,

    padding: {
        bottom: 40
    },

    animation: {
        width: 250,
        height: 250,

        x: { align: "center" },
        y: { align: "center" }
    },

    text: {
        width: 700,
        height: 300
    },

    button: {
        width: 300,
        height: 100
    }
};
